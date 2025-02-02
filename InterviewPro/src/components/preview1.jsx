import React, { useEffect, useState, useRef } from "react";
import { CiMicrophoneOn, CiVideoOn } from "react-icons/ci";
import sample from "../assets/sample2.png";
import { useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory
import { db } from "../firebase"; // Ensure db is correctly imported
import { collection, query, where, onSnapshot } from "firebase/firestore";

function Preview1() {
  const navigate = useNavigate(); 
  const [candidateData, setCandidateData] = useState({
    candidate_name: "",
    candidate_email: "",
    candidate_contact: "",
    company_name: "",
    company_email: "",
    company_icon: "",
    rubric_role: "",
    rubric_difficulty: "",
    rubric_experience: "",
    rubric_notes: "",
    rubric_selected_skills: "",
    interview_id: "",
  });


  const [cameraOn, setCameraOn] = useState(false);
  const [microphoneOn, setMicrophoneOn] = useState(true);
  const [cameraAvailable, setCameraAvailable] = useState(true);
  const [joined, setJoined] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [showNotification, setShowNotification] = useState(false);

  const soundRef = useRef(new Audio("/notification_sound.mp3"));
  const isUserInteracted = useRef(false);   
// Function to handle the Check CV button
const handleCheckCV = () => {
  fetch(`http://localhost:5000/api/check_cv/${candidateData.interview_id}`)
    .then((response) => {
      if (response.ok) {
        return response.blob(); // Get the file as a blob
      }
      throw new Error("CV not found in the database.");
    })
    .then((blob) => {
      const url = window.URL.createObjectURL(blob); // Create URL for the file
      window.open(url, "_blank"); // Open the file in a new tab
    })
    .catch((error) => alert(error.message));
};

// Function to handle the Check JD button
const handleCheckJD = () => {
  fetch(`http://localhost:5000/api/check_jd/${candidateData.interview_id}`)
    .then((response) => {
      if (response.ok) {
        return response.blob();
      }
      throw new Error("Job description not found in the database.");
    })
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    })
    .catch((error) => alert(error.message));
};


  useEffect(() => {
    const enableAudioPlayback = () => {
      isUserInteracted.current = true;
      document.removeEventListener("click", enableAudioPlayback);
    };
    document.addEventListener("click", enableAudioPlayback);

    return () => document.removeEventListener("click", enableAudioPlayback);
  }, []);


    // Listen for new recording stopped reports
    useEffect(() => {
      const interviewId = sessionStorage.getItem("interview_id");
      if (!interviewId) return;
  
      const reportsRef = collection(db, `recordingReports/${interviewId}/reports`);
      const q = query(reportsRef, where("action", "==", "Recording Interrupted"));
  
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty && isUserInteracted.current) {
          soundRef.current.play().catch((err) => console.error("Audio playback failed:", err)); // Play sound if interaction occurred
          setShowNotification(true); // Show notification
          setTimeout(() => setShowNotification(false), 3000); // Hide after 3 seconds
        }
      });
  
      return () => unsubscribe();
    }, []);

  const [interviewerData, setInterviewerData] = useState({
    name: "",
    email: "",
    contact: "",
    company_name: "",
    picpath: ""
  });
  useEffect(() => {
    // Fetch candidate data from session storage
    try {
      setCandidateData({
        candidate_name: sessionStorage.getItem("candidate_name"),
        candidate_email: sessionStorage.getItem("candidate_email"),
        candidate_contact: sessionStorage.getItem("candidate_contact"),
        company_name: sessionStorage.getItem("company_name"),
        company_email: sessionStorage.getItem("company_email"),
        company_icon: sessionStorage.getItem("company_icon"),
        rubric_role: sessionStorage.getItem("rubric_role"),
        rubric_difficulty: sessionStorage.getItem("rubric_difficulty"),
        rubric_experience: sessionStorage.getItem("rubric_experience"),
        rubric_notes: sessionStorage.getItem("rubric_notes"),
        rubric_selected_skills: sessionStorage.getItem("rubric_selected_skills"),
        interview_id: sessionStorage.getItem("interview_id"),
      });
    } catch (error) {
      console.error("Error fetching candidate data:", error);
    }
  
    // Fetch interviewer details if interview_id is present
    const interviewId = sessionStorage.getItem("interview_id");
    if (interviewId) {
      fetch(`http://localhost:5000/api/get_interviewer_details/${interviewId}`)
        .then((response) => response.json())
        .then((data) => {
          if (!data.error) {
            setInterviewerData({
              name: data.name,
              email: data.email,
              contact: data.contact,
              company_name: data.company_name,
              picpath: data.picpath,
            });
          }
        })
        .catch((err) => console.error("Error fetching interviewer details:", err));
    }
  
    // Check the interview status
    checkInterviewStatus();
  }, []);
  

  const checkInterviewStatus = () => {
    // Fetch the interview status from the backend
    fetch(`http://localhost:5000/api/get_interview_status/${sessionStorage.getItem("interview_id")}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status_description === "2") {
          setJoined(true); // If status is 2, the interview is already joined
          sessionStorage.setItem("joined", "true"); // Update sessionStorage
        }
      })
      .catch((error) => console.error("Error fetching interview status:", error));
  };

  const handleCameraToggle = async () => {
    if (cameraOn) {
      // Turn off the camera
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setCameraOn(false);
    } else {
      // Try to access the camera
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
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

  const handleMicrophoneToggle = () => {
    setMicrophoneOn((prev) => !prev);
  };

  const joinInterview = () => {
    const baseUrl = "http://localhost:3000/";
    const roomId = generateRoomId(); // Generate a random room ID for the URL
    const expandedUrl = `${baseUrl}?room=${roomId}`;

    // Open the expanded URL in a new tab
    window.open(expandedUrl, "_blank");

    // Save the expanded URL to the backend
    fetch("http://localhost:5000/api/update_joining_details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        interview_id: candidateData.interview_id,
        joining_details: expandedUrl,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log("Joining details updated successfully");
          updateStatusDescription(2); // Update the status to "2" (joined)
          setJoined(true);
          sessionStorage.setItem("joined", "true"); // Update sessionStorage
        } else {
          console.error("Failed to update joining details:", data.error);
        }
      })
      .catch((error) => console.error("Error updating joining details:", error));
  };

  const updateStatusDescription = (status) => {
    fetch("http://localhost:5000/api/update_status_description", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        interview_id: candidateData.interview_id,
        status_description: status,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log("Status updated successfully");
        } else {
          console.error("Failed to update status:", data.error);
        }
      })
      .catch((error) => {
        console.error("Error updating status:", error);
        alert("Failed to update interview status. Please try again.");
      });
  };
  

  const handleDoneInterview = () => {
    updateStatusDescription(3); // Update the status to "3" (completed)
    navigate("/rating"); // Navigate to the rating page

  };

  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 15);
  };

  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        {/* Left Half */}
        <section className="relative h-32 items-end bg-[#191064] lg:col-span-5 lg:h-full xl:col-span-6">
          <p className="mt-24 mb-4 text-4xl font-bold text-[#EFF0FA] text-center">
            Get Started
          </p>
          <p className="text-2xl text-[#C5C6D0] text-center">
            Please check your camera before joining
          </p>
          <div className="mt-14 mb-14 ml-[22rem]">
            <span className="whitespace-nowrap rounded-full font-bold bg-[#C74E5B] px-6 py-2 text-xl text-white">
              Live
            </span>
            <span className="ml-4 whitespace-nowrap rounded-full font-bold bg-white px-6 py-2 text-xl text-[#191064]">
              1 in session
            </span>
          </div>
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
          <div className="mt-4 ml-[22rem]">
            <span className="inline-flex overflow-hidden rounded-md border border-white bg-[#191064] shadow-sm">
              <button
                className={`inline-block p-3 text-white ${!microphoneOn ? "line-through" : ""}`}
                onClick={handleMicrophoneToggle}
                title="Microphone"
              >
                <CiMicrophoneOn className="h-6 w-6" />
              </button>
            </span>
            <span className="inline-flex overflow-hidden rounded-md border border-white bg-[#191064] shadow-sm ml-10">
              <button
                className={`inline-block p-3 text-white ${!cameraOn ? "line-through" : ""}`}
                onClick={handleCameraToggle}
                title="Camera"
              >
                <CiVideoOn className="h-6 w-6" />
              </button>
            </span>
          </div>
          <br />
          <div className="flex justify-center space-x-6 mt-3">
            <button
              className={`px-6 py-2 font-medium tracking-wide text-medium capitalize transition-colors duration-300 transform rounded-xl focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80 ${
                joined ? "bg-green-600" : "bg-blue-600"
              }`}
              onClick={joinInterview}
            >
              {joined ? "Rejoin" : "Join Now"}
            </button>
            {joined && (
              <button
                className="px-6 py-2 font-medium tracking-wide text-medium text-white capitalize transition-colors duration-300 transform bg-red-600 rounded-xl hover:bg-gray-500 focus:outline-none focus:ring focus:ring-red-300 focus:ring-opacity-80"
                onClick={handleDoneInterview}
              >
                Done Interview
              </button>
            )}

{showNotification && (
              <div className="bg-red-500 text-white p-3 rounded mb-4 text-center">
                Recording has stopped
              </div>
            )}
          </div>
        </section>

        
        {/* Right Half - Dynamic Data */}
        <main className="flex items-center px-8 py-2 sm:px-12 lg:col-span-7 lg:px-16 lg:py-2 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <h2 className="mt-0 text-2xl font-bold text-[#09005F] sm:text-3xl md:text-4xl">Organisation</h2>
            <div className="mt-6 flex items-center gap-x-2">
              <img className="object-cover w-32 h-32 rounded-xl" src={`http://localhost:5000${candidateData.company_icon}`} alt="Company Icon" />
              <div>
                <h1 className="ml-4 text-3xl font-bold text-[#032D6C] capitalize">{candidateData.company_name}</h1>
                <p className="ml-4 text-xl font-semibold text-[#032D6C]">{candidateData.company_email}</p>
                {/* <p className="ml-4 text-lg font-semibold text-[#032D6C]">{candidateData.candidate_contact}</p> */}
              </div>
            </div>

            {/* Separate Section for Company Information */}
            <h2 className="mt-8 mb-4 text-2xl font-bold text-[#09005F]">Candidate Information</h2>
            <p className="text-lg text-[#09005F]"><strong>Candidate Name:</strong> {candidateData.candidate_name}</p>
            <p className="text-lg text-[#09005F]"><strong>Candidate Email:</strong> {candidateData.candidate_email}</p>
            <p className="text-lg text-[#09005F]"><strong>Candidate Contact:</strong> {candidateData.candidate_contact}</p>

            <h2 className="mt-8 mb-4 text-4xl font-bold text-[#09005F]">Rubrics</h2>

            <h2 className="mt-4 mb-4 text-2xl font-bold text-[#09005F]">Seniority</h2>
            <article className="mr-[14rem] mt-4 mb-4 rounded-3xl bg-[#09005F] p-4">
              <span className="text-xl font-bold text-white">{candidateData.rubric_role}</span>
              <p className="mt-1 text-large text-white">{candidateData.rubric_experience} years of experience</p>
            </article>

            <h2 className="mt-4 mb-4 text-2xl font-bold text-[#09005F]">Difficulty Level</h2>
            <article className="mr-[6rem] mt-4 mb-4 rounded-3xl bg-[#09005F] p-4">
              <span className="text-xl font-bold text-white">{candidateData.rubric_difficulty}</span>
            </article>

            <h2 className="mt-4 mb-4 text-2xl font-bold text-[#09005F]">Hiring Criteria</h2>
            <h2 className="mt-4 mb-2 text-xl font-bold text-[#09005F]">Skill Rubric</h2>
            <p className="mb-4 text-lg text-[#09005F]">Evaluate the following skills:</p>
            <div className="ml-4 text-lg font-semibold text-[#09005F]">
              {candidateData.rubric_selected_skills}
            </div>

            {/* Notes Section */}
            <h2 className="mt-8 mb-4 text-2xl font-bold text-[#09005F]">Notes</h2>
            <article className="mt-4 mb-4 rounded-3xl bg-[#09005F] p-4">
              <p className="text-lg text-white" style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
                {candidateData.rubric_notes}
              </p>
            </article>

            <div className="flex justify-center space-x-6 mt-3">
  {/* Existing Join Now / Done Interview Buttons */}
  <button
    onClick={handleCheckCV}
    className="px-6 py-2 font-medium tracking-wide text-medium text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-xl hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
  >
    Check CV
  </button>
  <button
    onClick={handleCheckJD}
    className="px-6 py-2 font-medium tracking-wide text-medium text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-xl hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
  >
    Check JD
  </button>
</div>
          </div>
        </main>
      </div>
    </section>
  );
}

export default Preview1;
