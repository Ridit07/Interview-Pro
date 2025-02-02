// Import necessary styles and Firebase modules
import './style.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-DSJyy5NJMvcTGAuX-_80Xp9APUB5TXM",
  authDomain: "webrtc-98512.firebaseapp.com",
  projectId: "webrtc-98512",
  storageBucket: "webrtc-98512.appspot.com",
  messagingSenderId: "492561842033",
  appId: "1:492561842033:web:f9fe024b058f2a7f6bc0d0",
  measurementId: "G-QMKDG1FZE1"
};

// Initialize Firebase if not already initialized
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const firestore = firebase.firestore();
const storage = firebase.storage();

// Room ID variable
let roomId = null;

// HTML Elements for Collaborative Code
const codeEditor = document.getElementById('codeEditor');
const languageSelect = document.getElementById('languageSelect');
const runCodeButton = document.getElementById('runCodeButton');
const codeInput = document.getElementById('codeInput');
const codeOutput = document.getElementById('codeOutput');

// HTML Elements for Chat and File Upload
const chatBox = document.getElementById('chatBox');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');
const fileInput = document.getElementById('fileInput');
const uploadButton = document.getElementById('uploadButton');

// HTML Elements for Video
const webcamVideo = document.getElementById('webcamVideo');
const remoteVideo = document.getElementById('remoteVideo');
const toggleCameraButton = document.getElementById('toggleCameraButton');
const toggleMicButton = document.getElementById('toggleMicButton');
const endCallButton = document.getElementById('endCallButton');

// Function to sanitize input to prevent XSS attacks
function sanitize(str) {
  const temp = document.createElement('div');
  temp.textContent = str;
  return temp.innerHTML;
}

// Debounce function to limit Firestore writes during typing
function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), timeout);
  };
}

// Function to create or join a room based on the URL
function createOrJoinRoom() {
  // Check if a room ID is already in the URL
  const urlParams = new URLSearchParams(window.location.search);
  roomId = urlParams.get('room');

  if (!roomId) {
    // Generate a new room ID and update the URL
    roomId = firestore.collection('rooms').doc().id;
    window.history.replaceState(null, "Room", `?room=${roomId}`);
    console.log("Created new room with ID:", roomId);
  } else {
    console.log("Joining existing room with ID:", roomId);
  }

  setupRoom(roomId);
}

// Function to set up Firestore references and listeners based on room ID
function setupRoom(roomId) {
  // Room-specific Firestore references
  const roomDoc = firestore.collection('rooms').doc(roomId);
  const codeDoc = roomDoc.collection('codeCollab').doc('code');
  const inputDoc = roomDoc.collection('codeCollab').doc('input');
  const outputDoc = roomDoc.collection('codeCollab').doc('output');
  const chatRef = roomDoc.collection('chat');

  // Initialize room-specific collaborative code
  codeDoc.onSnapshot((doc) => {
    const data = doc.data();
    if (data && data.text !== codeEditor.value) {
      codeEditor.value = data.text;
    }
  });

  inputDoc.onSnapshot((doc) => {
    const data = doc.data();
    if (data && data.text !== codeInput.value) {
      codeInput.value = data.text;
    }
  });

  outputDoc.onSnapshot((doc) => {
    const data = doc.data();
    if (data && data.text !== codeOutput.value) {
      codeOutput.value = data.text;
    }
  });

  const updateCodeInFirestore = debounce(async (text) => {
    await codeDoc.set({ text });
  }, 300);

  const updateInputInFirestore = debounce(async (text) => {
    await inputDoc.set({ text });
  }, 300);

  codeEditor.addEventListener('input', (event) => {
    const text = event.target.value;
    updateCodeInFirestore(text);
  });

  codeInput.addEventListener('input', (event) => {
    const text = event.target.value;
    updateInputInFirestore(text);
  });

  // Generate a unique peer ID for this client
  const peerId = generatePeerId();

  // Initialize WebRTC and Chat functionalities
  initializeWebRTC(roomId, peerId);
  initializeChat(roomId);
  initializeCodeExecution();
}

// Function to generate a unique peer ID
function generatePeerId() {
  return Math.random().toString(36).substring(2, 15);
}

// Function to initialize WebRTC connections and related functionalities
function initializeWebRTC(roomId, peerId) {
  const servers = {
    iceServers: [
      {
        urls: [
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
        ],
      },
    ],
    iceCandidatePoolSize: 10,
  };

  const pcCamera = new RTCPeerConnection(servers);
  let localStream = null;

  // Automatically start the webcam and connections
  startWebcam().then(() => {
    startCameraConnection(roomId, pcCamera, peerId);
  });

  // Function to start the webcam
  async function startWebcam() {
    try {
      localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      // Add camera stream tracks to pcCamera connection
      localStream.getTracks().forEach((track) => {
        pcCamera.addTrack(track, localStream);
      });

      webcamVideo.srcObject = localStream;
      webcamVideo.muted = true;

      console.log('Webcam started.');

      // Set up toggle buttons
      setupToggleButtons();

    } catch (error) {
      console.error('Error accessing media devices.', error);
      alert('Could not access camera and microphone.');
    }
  }

  // Function to set up toggle buttons
  function setupToggleButtons() {
    // Initialize button text
    toggleCameraButton.innerHTML = '<i class="fas fa-video"></i> Turn Camera Off';
    toggleMicButton.innerHTML = '<i class="fas fa-microphone"></i> Mute Microphone';

    // Toggle Camera
    toggleCameraButton.onclick = () => {
      const videoTracks = localStream.getVideoTracks();
      if (videoTracks.length === 0) {
        return;
      }
      videoTracks.forEach((track) => {
        track.enabled = !track.enabled;
        if (track.enabled) {
          toggleCameraButton.innerHTML = '<i class="fas fa-video"></i> Turn Camera Off';
        } else {
          toggleCameraButton.innerHTML = '<i class="fas fa-video-slash"></i> Turn Camera On';
        }
      });
    };

    // Toggle Microphone
    toggleMicButton.onclick = () => {
      const audioTracks = localStream.getAudioTracks();
      if (audioTracks.length === 0) {
        return;
      }
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
        if (track.enabled) {
          toggleMicButton.innerHTML = '<i class="fas fa-microphone"></i> Mute Microphone';
        } else {
          toggleMicButton.innerHTML = '<i class="fas fa-microphone-slash"></i> Unmute Microphone';
        }
      });
    };

    // End Call
    endCallButton.onclick = () => {
      // Close all tracks
      localStream.getTracks().forEach(track => track.stop());
      pcCamera.close();
      // Optionally, redirect or notify other users
      alert('Call ended.');
      window.location.href = '/'; // Redirect to home or another page
    };
  }

  // Function to start camera connection
  async function startCameraConnection(roomId, pc, peerId) {
    const roomDoc = firestore.collection('rooms').doc(roomId);
    const callDoc = roomDoc.collection('calls').doc('camera');
    const offerCandidates = callDoc.collection('offerCandidates');
    const answerCandidates = callDoc.collection('answerCandidates');

    let isCaller = false;

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        const candidatesCollection = isCaller
          ? offerCandidates
          : answerCandidates;
        candidatesCollection.add(event.candidate.toJSON());
      }
    };

    // Use a transaction to determine if we should be the caller
    await firestore.runTransaction(async (transaction) => {
      const roomDocSnapshot = await transaction.get(roomDoc);
      let roomData = roomDocSnapshot.data();
      if (!roomData || !roomData.callerId) {
        // No caller yet, we become the caller
        transaction.set(roomDoc, { callerId: peerId }, { merge: true });
        isCaller = true;
      } else {
        // Caller already exists, we become the callee
        isCaller = false;
      }
    });

    if (isCaller) {
      // Create an offer
      const offerDescription = await pc.createOffer();
      await pc.setLocalDescription(offerDescription);

      await callDoc.set({ offer: offerDescription });

      callDoc.onSnapshot((snapshot) => {
        const data = snapshot.data();
        if (data && data.answer && !pc.currentRemoteDescription) {
          const answerDescription = new RTCSessionDescription(data.answer);
          pc.setRemoteDescription(answerDescription);
        }
      });
    } else {
      // Wait for the offer
      callDoc.onSnapshot(async (snapshot) => {
        const data = snapshot.data();
        if (data && data.offer && !pc.currentRemoteDescription) {
          const offerDescription = data.offer;
          await pc.setRemoteDescription(
            new RTCSessionDescription(offerDescription)
          );

          const answerDescription = await pc.createAnswer();
          await pc.setLocalDescription(answerDescription);

          await callDoc.update({ answer: answerDescription });
        }
      });
    }

    const candidatesCollection = isCaller ? answerCandidates : offerCandidates;
    candidatesCollection.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const candidate = new RTCIceCandidate(change.doc.data());
          pc.addIceCandidate(candidate);
        }
      });
    });

    // Display incoming streams on the remote side
    pc.ontrack = (event) => {
      remoteVideo.srcObject = event.streams[0];
    };
  }
}

// Function to initialize chat functionalities
function initializeChat(roomId) {
  // Room-specific Firestore references
  const chatRef = firestore.collection('rooms').doc(roomId).collection('chat');

  // Listen for incoming messages
  chatRef.orderBy('timestamp').onSnapshot((snapshot) => {
    chatBox.innerHTML = '';
    snapshot.forEach((doc) => {
      const message = doc.data();
      if (message.type === 'text') {
        chatBox.innerHTML += `<p>${sanitize(message.text)}</p>`;
      } else if (message.type === 'file') {
        chatBox.innerHTML += `
          <p>
            <a href="${message.url}" target="_blank" class="file-link">${sanitize(message.fileName)}</a>
            <button class="summarize-button" data-url="${message.url}" data-filename="${message.fileName}">
              <i class="fas fa-sitemap"></i> Summarize
            </button>
          </p>`;
      }
    });
    chatBox.scrollTop = chatBox.scrollHeight;

    // Add event listeners to summarize buttons
    const summarizeButtons = document.querySelectorAll('.summarize-button');
    summarizeButtons.forEach(button => {
      button.onclick = () => {
        const fileUrl = button.getAttribute('data-url');
        const fileName = button.getAttribute('data-filename');
        summarizePDF(fileUrl, fileName, button);
      };
    });
  });

  // Sending a text message to the room-specific chat
  sendButton.onclick = async () => {
    const message = chatInput.value;
    if (message.trim()) {
      await chatRef.add({
        type: 'text',
        text: message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
      chatInput.value = '';
    }
  };

  // File upload
  uploadButton.onclick = async () => {
    const file = fileInput.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      // 5 MB limit
      const storageRef = storage.ref(
        `chat_files/${roomId}/${Date.now()}_${file.name}`
      );
      const uploadTask = storageRef.put(file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error('Upload failed:', error);
          alert('File upload failed. Please try again.');
        },
        async () => {
          // Get the download URL and save it to Firestore
          const downloadURL = await storageRef.getDownloadURL();
          await chatRef.add({
            type: 'file',
            fileName: file.name,
            url: downloadURL,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          });
          console.log('File uploaded and saved to chat.');
          fileInput.value = ''; // Clear the file input
        }
      );
    } else {
      alert(
        'File is too large or not supported. Please select a file up to 5 MB.'
      );
    }
  };
}

// Function to initialize code execution functionality
function initializeCodeExecution() {
  runCodeButton.onclick = async () => {
    const language = languageSelect.value;
    const code = codeEditor.value;
    const input = codeInput.value;

    if (!code.trim()) {
      alert('Please write some code to run.');
      return;
    }

    // Prepare the data for the API
    const data = JSON.stringify({
      langEnum: [
        'php',
        'python',
        'c',
        'c_cpp',
        'csharp',
        'kotlin',
        'golang',
        'r',
        'java',
        'typescript',
        'nodejs',
        'ruby',
        'perl',
        'swift',
        'fortran',
        'bash'
      ],
      lang: language,
      code: code,
      input: input
    });

    // Clear previous output
    codeOutput.value = 'Running...';

    try {
      const response = await fetch('https://code-compiler10.p.rapidapi.com/', {
        method: 'POST',
        headers: {
          'x-rapidapi-key': '2feb9e75b2msh46acb8bc3776d74p12a995jsn30a26ea0c2b8',
          'x-rapidapi-host': 'code-compiler10.p.rapidapi.com',
          'Content-Type': 'application/json',
          'x-compile': 'rapidapi'
        },
        body: data
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      codeOutput.value = result.output || 'No output returned.';
      // Update output in Firestore
      const outputDoc = firestore.collection('rooms').doc(roomId).collection('codeCollab').doc('output');
      await outputDoc.set({ text: result.output || 'No output returned.' });
    } catch (error) {
      console.error('Error executing code:', error);
      codeOutput.value = 'Error executing code. Please try again.';
      // Update output in Firestore
      const outputDoc = firestore.collection('rooms').doc(roomId).collection('codeCollab').doc('output');
      await outputDoc.set({ text: 'Error executing code. Please try again.' });
    }
  };
}

// Function to initialize summarize PDF functionality
async function summarizePDF(fileUrl, fileName, button) {
  // Disable the summarize button and show a spinner
  button.disabled = true;
  const spinner = document.createElement('div');
  spinner.classList.add('spinner');
  button.appendChild(spinner);
  
  try {
    // Fetch the PDF file from the URL
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch the PDF file.');
    }
    const blob = await response.blob();
    const formData = new FormData();
    formData.append('file', blob, fileName);

    // Send the PDF to the summarize endpoint
    const summarizeResponse = await fetch('http://localhost:5011/summarize_pdf', {
      method: 'POST',
      body: formData
    });

    if (!summarizeResponse.ok) {
      throw new Error('Failed to summarize the PDF.');
    }

    const summarizedBlob = await summarizeResponse.blob();
    const summarizedUrl = URL.createObjectURL(summarizedBlob);
    
    // Create a link to download the summarized PDF
    const a = document.createElement('a');
    a.href = summarizedUrl;
    a.download = `summarized_${fileName}`;
    a.click();
    URL.revokeObjectURL(summarizedUrl);
    alert('Summarized PDF downloaded successfully.');
  } catch (error) {
    console.error('Error summarizing PDF:', error);
    alert('Failed to summarize the PDF. Please try again.');
  } finally {
    // Re-enable the summarize button and remove the spinner
    button.disabled = false;
    button.removeChild(spinner);
  }
}

// Function to get room ID from URL
function getRoomIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('room');
}

// Call createOrJoinRoom when the page loads
window.onload = createOrJoinRoom;
