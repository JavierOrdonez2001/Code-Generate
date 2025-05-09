import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAT2910muoT__Djnj8a61SbPC83o1qMdpE",
    authDomain: "barcode-55d7c.firebaseapp.com",
    projectId: "barcode-55d7c",
    storageBucket: "barcode-55d7c.appspot.com",
    messagingSenderId: "520017492676",
    appId: "1:520017492676:web:d394d4b8ae96b6b0c66791",
    measurementId: "G-2PYQ2X7VEW"
    
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);