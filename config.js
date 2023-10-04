import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBe4P1P51XqM59_xaS7xPMH2mTSr4-Ne5c",
  authDomain: "angkas-9b800.firebaseapp.com",
  databaseURL:
    "https://angkas-9b800-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "angkas-9b800",
  storageBucket: "angkas-9b800.appspot.com",
  messagingSenderId: "695994357285",
  appId: "1:695994357285:web:e95a079d76eab001c8d1cc",
  measurementId: "G-34X3VZQZ0Y",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = getDatabase();
export { firebase, db };
