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


interface IIngredientsEvent {
    userId: string;
    title: string;
}

export const writeIngredientsData = async (data: IIngredientsEvent) => {
    const { userId, title } = data;

    try {
        // Query to check if a document with the same userId and title already exists
        const querySnapshot = await getDocs(
            query(collection(db, "Ingredients"),
                where("userId", "==", userId),
                where("title", "==", title)
            )
        );

        if (querySnapshot.empty) {
            // No matching document found, add the new document
            const docRef = await addDoc(collection(db, "Ingredients"), {
                data: data,
            });
            console.log("Document written with ID: ", docRef.id);
        } else {
            console.log("Duplicate document not added.");
        }
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export const readIngredientsData = async (userId: string) => {
    try {
        const querySnapshot = await getDocs(
            query(collection(db, "Ingredients"), where("data.userId", "==", userId))
        );
        const newData = querySnapshot.docs.map((doc) => doc.data());
        return newData;
    } catch (error) {
        console.log("Error getting documents: ", error);
        throw error; // Re-throw the error to be caught by the caller if needed
    }
}