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
    const { userId, ingredients } = data;

    const collectionName = "ingredients";

    try {
        // Query to check if a document with the same userId and already exists
        const querySnapshot = await getDocs(
            query(collection(db, collectionName),
                where("userId", "==", userId)
            )
        );

        if (querySnapshot.empty) {
            // No matching document found, add the new document
            const docRef = await addDoc(collection(db, collectionName), {
                userId: userId,
                ingredients: ingredients
            });
            console.log("Document written with ID: ", docRef.id);
        } else {
            console.log("Duplicate document not added.");

            const documentData = querySnapshot.docs.map((doc) => doc.data());

            const docRef = await updateDoc(doc(db, collectionName, querySnapshot.docs[0].id), {
                userId: userId,
                ingredients: [...new Set([...data.ingredients, ...documentData[0].ingredients])]
            });
            console.log("Document updated with ID: ", docRef);
        }
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export interface IWaterEvent {
    userId: string;
    amount: number;
    date: string;
}

export const writeWaterStatsData = async (data: IWaterEvent) => {
    const { userId, date } = data;

    const collectionName = "waterstats";


    try {
        // Query to check if a document with the same userId and date  and already exists
        const querySnapshot = await getDocs(
            query(collection(db, collectionName),
                where("userId", "==", userId),
                where("date", "==", date)
            )
        );

        if (querySnapshot.empty) {
            // No matching document found, add the new document
            const docRef = await addDoc(collection(db, collectionName), {
                userId: data.userId,
                amount: data.amount,
                date: data.date
            });
            console.log("Document written with ID: ", docRef.id);
        } else {
            console.log("Duplicate document not added.");

            const docRef = await updateDoc(doc(db, collectionName, querySnapshot.docs[0].id), {
                userId: data.userId,
                amount: data.amount,
                date: data.date
            });
            console.log("Document updated with ID: ", docRef);
        }
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export const readFirebaseUserData = async (userId: string, collectionName: string) => {
    try {
        const querySnapshot = await getDocs(
            query(collection(db, collectionName), where("userId", "==", userId))
        );
        const newData = querySnapshot.docs.map((doc) => doc.data());
        return newData;
    } catch (error) {
        console.log("Error getting documents: ", error);
        throw error; // Re-throw the error to be caught by the caller if needed
    }
}

export const updateFirebaseUserData = async (userId: string, collectionName: string, data: any) => {
    try {
        const querySnapshot = await getDocs(
            query(collection(db, collectionName), where("userId", "==", userId))
    );

        const docRef = await updateDoc(doc(db, collectionName, querySnapshot.docs[0].id), {
            userId: userId,
            ingredients: data
        });
        console.log("Document updated with ID: ", docRef);
        
        return docRef;
    }
    catch (error) {
        console.log("Error getting documents: ", error);
        throw error; // Re-throw the error to be caught by the caller if needed
    }
}


