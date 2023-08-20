import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import config from "../config.json";
import { getDocs, getFirestore, query, where } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: config.apps.Firebase.apiKey,
    authDomain: config.apps.Firebase.authDomain,
    projectId: config.apps.Firebase.projectId,
    storageBucket: config.apps.Firebase.storageBucket,
    messagingSenderId: config.apps.Firebase.messagingSenderId,
    appId: config.apps.Firebase.appId,
    measurementId: config.apps.Firebase.measurementId
};

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();


const db = getFirestore(app);
