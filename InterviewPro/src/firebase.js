// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCOaLx127gspZ1WAI0gr8a6mEUkPjToIis",
    authDomain: "video-record2.firebaseapp.com",
    projectId: "video-record2",
    storageBucket: "video-record2.appspot.com",
    messagingSenderId: "299059975851",
    appId: "1:299059975851:web:b796e4a1ddf4702bb249ee",
    measurementId: "G-BCQ49FQPPS"
};

// Initialize Firebase
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Storage
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
