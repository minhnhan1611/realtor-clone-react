// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC2kzrcy2UbxTY1_Gz0YtMQlqaJy8RMEoA",
    authDomain: "realtor-clone-react-36040.firebaseapp.com",
    projectId: "realtor-clone-react-36040",
    storageBucket: "realtor-clone-react-36040.appspot.com",
    messagingSenderId: "698496722801",
    appId: "1:698496722801:web:3c1933744caa74140038d0"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();