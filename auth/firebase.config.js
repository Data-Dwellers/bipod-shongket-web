// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA0C_i0h3ZNTkcmeIo03BFo8CNTMq-I97A",
    authDomain: "bipod-shongket.firebaseapp.com",
    projectId: "bipod-shongket",
    storageBucket: "bipod-shongket.firebasestorage.app",
    messagingSenderId: "525109516240",
    appId: "1:525109516240:web:b4f239514a930256424bd5",
    measurementId: "G-WR8H3XDS92",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export default auth;
