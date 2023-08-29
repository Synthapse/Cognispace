import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import config from "../config.json";
import { doc, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
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
    ingredients: string[];
}

export const writeIngredientsData = async (data: IIngredientsEvent) => {
    const { userId } = data;

    try {
        // Query to check if a document with the same userId and already exists
        const querySnapshot = await getDocs(
            query(collection(db, "ingredients"),
                where("data.userId", "==", userId)
            )
        );

        if (querySnapshot.empty) {
            // No matching document found, add the new document
            const docRef = await addDoc(collection(db, "ingredients"), {
                userId: data.userId,
                ingredients: data.ingredients
            });
            console.log("Document written with ID: ", docRef.id);
        } else {
            console.log("Duplicate document not added.");

            const documentData = querySnapshot.docs.map((doc) => doc.data());

            const docRef = await updateDoc(doc(db, "ingredients", querySnapshot.docs[0].id), {
                userId: data.userId,
                ingredients: [...new Set([...data.ingredients, ...documentData[0].data.ingredients])]
            });
            console.log("Document updated with ID: ", docRef);
        }
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export const readIngredientsData = async (userId: string) => {
    try {
        const querySnapshot = await getDocs(
            query(collection(db, "ingredients"), where("userId", "==", userId))
        );
        const newData = querySnapshot.docs.map((doc) => doc.data().ingredients);
        return newData;
    } catch (error) {
        console.log("Error getting documents: ", error);
        throw error; // Re-throw the error to be caught by the caller if needed
    }
}