import { initializeApp } from 'firebase/app';

// Optionally import the services that you want to use
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import {...} from "firebase/functions";
import { getStorage } from "firebase/storage";

// Initialize Firebase
export const firebaseConfig = {
    apiKey: "AIzaSyCGvJ6bJtiqW6q5qmOfarmjaAr_cOrOif8",
    authDomain: "boomtingz-c21fe.firebaseapp.com",
    projectId: "boomtingz-c21fe",
    storageBucket: "boomtingz-c21fe.appspot.com",
    messagingSenderId: "243788618182",
    appId: "1:243788618182:web:e48b41d23071f9b2533ac7",
    measurementId: "G-TH66W1R647"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const data = getFirestore(app)
export const storage = getStorage(app)
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
