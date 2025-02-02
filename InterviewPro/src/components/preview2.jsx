import React, { useEffect, useState, useRef } from "react";
import { CiMicrophoneOn, CiVideoOn } from "react-icons/ci";
import sample from "../assets/sample2.png";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../firebase";
import { ref, uploadBytes, listAll, uploadBytesResumable } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function Preview2() {
  const navigate = useNavigate();
  const [cameraOn, setCameraOn] = useState(false);
  const [microphoneOn, setMicrophoneOn] = useState(true);
  const [cameraAvailable, setCameraAvailable] = useState(true);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [interviewId, setInterviewId] = useState(null);
  const [statusDescription, setStatusDescription] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const manualStopRef = useRef(false); // Flag to distinguish manual vs unexpected stop


   // Function to detect external display
  //  const detectExternalDisplay = () => {
  //   const { width, height, availWidth, availHeight, orientation, left, top } = window.screen;
  //   const devicePixelRatio = window.devicePixelRatio || 1;
  
  //   // Detect if screen properties differ significantly, indicating multiple displays
  //   const externalDisplayDetected = (
  //     width !== availWidth ||
  //     height !== availHeight ||
  //     left !== 0 ||
  //     top !== 0 ||
  //     devicePixelRatio !== 1 ||  // Typically, an external display may have a different pixel ratio
  //     orientation.type.includes("landscape-primary") === false // Usually, primary screens are in landscape-primary
  //   );
  
  //   if (externalDisplayDetected) {
  //     console.log("External display detected.");
  //   } else {
  //     console.log("No external display detected.");
  //   }
  //   return externalDisplayDetected;
  // };
  
  const [vmCheckDone, setVmCheckDone] = useState(false);

  // Function to detect if running in a virtual machine
  const detectVirtualMachine = async () => {
    if (vmCheckDone) return; // Skip if already done
    const userAgent = navigator.userAgent; 
    const platform = navigator.platform;

    const vmSigns = [ "QEMU", "VirtualBox", "VMware"];
    const isVM = vmSigns.some(sign => userAgent.includes(sign) || platform.includes(sign));
    
    if (isVM) {
      console.log("Running on a virtual machine.");
      try {
        const response = await fetch('http://localhost:5001/api/detect_virtual_machine', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ interview_id: interviewId })
        });
  
        if (response.ok) {
          console.log("Virtual machine detection recorded in the database.");
          setVmCheckDone(true); // Mark as done
        } else {
          const errorData = await response.json();
          console.error("Error reporting virtual machine detection:", errorData.error);
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    } else {
      console.log("Not running on a virtual machine.");
    }
    return isVM;
  };

  // Effect to check external display and VM status only when recording is on
  useEffect(() => {
    let interval;

    if (isRecording) {
      interval = setInterval(async () => {
        //detectExternalDisplay();
        await detectVirtualMachine();
      }, 5000); // Check every 5 seconds
    }

    // Clear interval on component unmount or when recording stops
    return () => clearInterval(interval);
  }, [isRecording]);



  const handleStopRecordingReport = async (actionType) => {
    try {
      // Reference to the document for the specific interviewId
      const reportRef = collection(db, `recordingReports/${interviewId}/reports`);
  
      // Add a new report entry within the interviewId document
      await addDoc(reportRef, {
        action: actionType,
        timestamp: serverTimestamp(),
      });
  
      console.log(`${actionType} action reported to Firebase under interviewId: ${interviewId}`);
    } catch (error) {
      console.error("Error reporting to Firebase:", error);
    }
  };
  

  const fetchJoiningDetailsAndOpenLink = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/get_interview_joining_details?interview_id=${interviewId}`);
      const data = await response.json();
      if (response.ok && data.joining_details) {
        const url = data.joining_details.startsWith("http://") || data.joining_details.startsWith("https://")
          ? data.joining_details
          : `http://${data.joining_details}`;
          
        window.open(url, "_blank");
      } else {
        console.error("Error fetching joining details:", data.error);
        setError(data.error || "Unable to fetch joining details.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Failed to fetch joining details.");
    }
  };
  
  

  // Fetch Candidate Dashboard on Mount
  useEffect(() => {
    setInterviewId(sessionStorage.getItem("interview_id"));
  }, []);

  // Poll Interview Status
  useEffect(() => {
    if (!interviewId) return;
    const interval = setInterval(async () => {
      try {
        console.log("Interview ID:", interviewId);
        const response = await fetch(`http://localhost:5001/api/get_interview_status?interview_id=${interviewId}`, {
          credentials: 'include'
        });
        const data = await response.json();
        if (response.ok) {
          setStatusDescription(data.status_description);
        } else {
          console.error("Error fetching status:", data.error);
        }
      } catch (error) {
        console.error("Error fetching status:", error);
      }
    }, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [interviewId]);

  // Automatically stop recording if status changes to "3"
  useEffect(() => {
    if (statusDescription === '3' && recorder) {
      console.log("Status description is 3, stopping the recording...");
      manualStopRef.current = true; // Set flag to indicate manual stop
      recorder.stop();
    }
  }, [statusDescription, recorder]);


  // Toggle Camera
  const handleCameraToggle = async () => {
    if (cameraOn) {
      // Turn off the camera
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setCameraOn(false);
    } else {
      // Try to access the camera and microphone
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraOn(true);
        setCameraAvailable(true);
      } catch (error) {
        console.error("Camera access error:", error);
        setCameraAvailable(false);
      }
    }
  };

  // Clean up the video stream when the component is unmounted
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Handle "Join Now" Click
  const handleJoinNow = async () => {
    if (!streamRef.current) {
      setError("Camera and microphone are not available.");
      return;
    }
  
    try {
      const mediaStream = streamRef.current;
      const options = { mimeType: 'video/webm; codecs=vp8' };
      const mediaRecorder = new MediaRecorder(mediaStream, options);
      const recordedData = []; // Accumulate all data here
  
      setRecorder(mediaRecorder);
      setIsRecording(true);
  
      await fetchJoiningDetailsAndOpenLink();

      // Define a counter to track file numbering
      let fileCounter = 1;
  
      // Check existing files in the `interviewId` folder and set the counter
      const folderRef = ref(storage, `recordings/${interviewId}/`);
      const listFiles = await listAll(folderRef);
      fileCounter = listFiles.items.length + 1;
  
      // When data is available, add it to recordedData
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedData.push(event.data);
        }
      };
  
      // Periodically stop and restart the recorder to upload the data
      const uploadInterval = setInterval(async () => {
        if (recordedData.length > 0) {
          // Stop and restart the recorder to get the current data
          mediaRecorder.stop();
  
          // Create a Blob from all accumulated data
          const combinedBlob = new Blob(recordedData, { type: 'video/webm' });
  
          // Create a unique file name with incremental numbering
          const storageRef = ref(storage, `recordings/${interviewId}/recording_${fileCounter}.webm`);
  
          try {
            // Upload the current recording to Firebase
            await uploadBytes(storageRef, combinedBlob);
            console.log(`Uploaded recording ${fileCounter} to Firebase!`);
            fileCounter++; // Increment the file counter
          } catch (error) {
            setError(`Upload error: ${error.message}`);
            console.error("Upload error:", error);
          }
  
          // Clear recordedData and restart the recorder
          recordedData.length = 0; // Clear the accumulated data
          mediaRecorder.start();
        }
      }, 10000); // Adjust interval (10 seconds) as needed
  
      // When recording stops, upload the final recording
      mediaRecorder.onstop = async () => {
        clearInterval(uploadInterval); // Stop periodic uploads
        setIsRecording(false);

        // Report based on stop type
        if (manualStopRef.current) {
          await handleStopRecordingReport("Recording Stopped");
        } else {
          await handleStopRecordingReport("Recording Interrupted");
        }

        // Reset manualStop flag
        manualStopRef.current = false;

        // Upload the final recording with the next increment in numbering
        const finalBlob = new Blob(recordedData, { type: 'video/webm' });
        const finalStorageRef = ref(storage, `recordings/${interviewId}/recording_${fileCounter}.webm`);
        const uploadTask = uploadBytesResumable(finalStorageRef, finalBlob);
        setIsUploading(true);
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress.toFixed(0)); // Update upload progress
          },
          (error) => {
            setError(`Final upload error: ${error.message}`);
            console.error("Final upload error:", error);
            setIsUploading(false); // Hide loader on error
          },
          async () => {
            console.log(`Uploaded final recording ${fileCounter} to Firebase!`);
            setIsUploading(false); // Hide loader when done

            const response = await fetch(`http://localhost:5001/api/get_interview_status?interview_id=${interviewId}`);
            const data = await response.json();
            if (response.ok && data.status_description === "3") {
              // Update status to 4 if current status is 3
              try {
                await fetch(`http://localhost:5001/api/update_interview_status`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ interview_id: interviewId, status_description: "4" }),
                });
                console.log("Status updated to 4");
              } catch (error) {
                console.error("Error updating status to 4:", error);
              }
            }

          }
        );
      };
  
      // Start recording
      mediaRecorder.start();
  
      // Automatically stop recording after 5 minutes
      setTimeout(() => {
        if (mediaRecorder.state !== 'inactive') {
          manualStopRef.current = true; // Indicate manual stop
          mediaRecorder.stop();
        }
      }, 5 * 60 * 1000); // 5 minutes
  
    } catch (error) {
      console.error("Error starting recording:", error);
      setError("Error starting recording.");
    }
  };

  // Handle page visibility change or close
  // useEffect(() => {
  //   const handleVisibilityChange = async () => {
  //     if (document.visibilityState === 'hidden' && isRecording) {
  //       manualStopRef.current = false; // Indicate unexpected interruption
  //       await handleStopRecordingReport("Recording Interrupted"); // Report the interruption
  //     }
  //   };
  
  //   document.addEventListener("visibilitychange", handleVisibilityChange);
  
  //   // Cleanup listener on component unmount
  //   return () => {
  //     document.removeEventListener("visibilitychange", handleVisibilityChange);
  //   };
  // }, [isRecording]);
  

  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        {/* Left Half - Video Feed and Controls */}
        <section className="relative h-32 items-end bg-[#191064] lg:col-span-5 lg:h-full xl:col-span-6">
          <p className="mt-24 mb-4 text-4xl font-bold text-[#EFF0FA] text-center">
            Get Started
          </p>
          <p className="text-2xl text-[#C5C6D0] text-center">
            Setup your audio and video before joining
          </p>

          <div className="mt-14 mb-14 ml-[22rem]">
            <span className="whitespace-nowrap rounded-full font-bold bg-[#C74E5B] px-6 py-2 text-xl text-white">
              Live
            </span>
            <span className="ml-4 whitespace-nowrap rounded-full font-bold bg-white px-6 py-2 text-xl text-[#191064]">
              1 in session
            </span>
          </div>

          {/* Camera Feed or Placeholder Image */}
          {cameraAvailable ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              className={`mx-auto object-cover w-128 h-64 rounded-xl ${!cameraOn ? "hidden" : ""}`}
            />
          ) : (
            <img className="mx-auto object-cover w-128 h-64 rounded-xl" src={sample} alt="Default" />
          )}

          {!cameraAvailable && <p className="text-red-500 text-center mt-2">Camera is not available</p>}

          <div className="mt-4 ml-[22rem] flex space-x-10">
            {/* Microphone Toggle */}
            <span className="inline-flex overflow-hidden rounded-md border border-white bg-[#191064] shadow-sm">
              <button
                className={`inline-block p-3 text-white ${!microphoneOn ? "line-through" : ""}`}
                onClick={() => setMicrophoneOn((prev) => !prev)}
                title="Microphone"
              >
                <CiMicrophoneOn className="h-6 w-6" />
              </button>
            </span>

            {/* Camera Toggle */}
            <span className="inline-flex overflow-hidden rounded-md border border-white bg-[#191064] shadow-sm">
              <button
                className={`inline-block p-3 text-white ${!cameraOn ? "line-through" : ""}`}
                onClick={handleCameraToggle}
                title="Camera"
              >
                <CiVideoOn className="h-6 w-6" />
              </button>
            </span>
          </div>

          <p className="text-2xl text-[#C5C6D0] text-center mt-4">
            Interview begins in 5 minutes
          </p>

          {/* Conditional Rendering of Join Button or Please Wait */}
          {statusDescription === '2' ? (
  <button
    onClick={handleJoinNow}
    className="mt-3 ml-[25.5rem] mb-6 px-6 py-2 font-medium tracking-wide text-medium text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-xl hover:bg-gray-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
    disabled={isRecording}
  >
    {isRecording ? "Recording..." : "Join Now"}
  </button>
) : (statusDescription === '-1' || parseInt(statusDescription) > 3) ? (
  <p className="mt-3 ml-[24rem] mb-6 text-xl text-red-500">Interview does not exist</p>
) : (statusDescription === '3' ) ? (
<p className="mt-3 ml-[24rem] mb-6 text-xl text-red-500">Please wait for upload, once finished you can leave this page</p>

):(
  <p className="mt-3 ml-[24rem] mb-6 text-xl text-yellow-500">Please wait...</p>
)}

 {/* Display Loader if Uploading */}
 {isUploading && (
            <div className="mt-2 text-center">
              <p className="text-blue-600 font-medium">Uploading... {uploadProgress}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            </div>
          )}

          {/* Display Error if Any */}
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        </section>

        {/* Right Half - Instructions */}
        <main className="flex items-center px-8 py-2 sm:px-12 lg:col-span-7 lg:px-16 lg:py-2 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <h2 className="mt-0 text-2xl font-bold text-[#09005F] sm:text-3xl md:text-4xl">
              Candidate Instruction and Guideline
            </h2>

            {/* Additional Instructions */}
            <article className="mt-4 mb-4 rounded-xl bg-[#d9dadd] p-4 ring ring-indigo-50 shadow-sm transition hover:shadow-lg">
              <p className="text-xl font-bold text-[#032D6C]">Be Comfortable with the Interviewer</p>
              <p className="text-xl text-[#032D6C]">
                Take a couple of minutes to settle down. Introduce yourself to the interviewer and be comfortable with
                the platform. Take help from the interviewer if you require.
              </p>
            </article>

            <article className="mt-4 mb-4 rounded-xl bg-[#d9dadd] p-4 ring ring-indigo-50 shadow-sm transition hover:shadow-lg">
              <p className="text-xl font-bold text-[#032D6C]">Make sure you are visible properly</p>
            </article>

            <div className="flex gap-4">
              <img
                className="object-cover w-32 h-32 rounded-xl"
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=3&w=688&h=688&q=100"
                alt="Example"
              />
              <img
                className="object-cover w-32 h-32 rounded-xl"
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=3&w=688&h=688&q=100"
                alt="Example"
              />
            </div>

            <article className="mt-4 mb-4 rounded-xl bg-[#d9dadd] p-4 ring ring-indigo-50 shadow-sm transition hover:shadow-lg">
              <p className="text-xl font-bold text-[#032D6C]">Ensure your voice is clear</p>
              <p className="text-xl text-[#032D6C]">
                Make sure your voice is not muffled; any unwanted disturbance or noise could impact your interview.
              </p>
            </article>
          </div>
        </main>
      </div>
    </section>
  );
}

export default Preview2;
