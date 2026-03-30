import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAr39IsnXPWEuh_lov4JZdu8d1Ec8dG_VU",
  authDomain: "recherche-appart-66de5.firebaseapp.com",
  databaseURL: "https://recherche-appart-66de5-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "recherche-appart-66de5",
  storageBucket: "recherche-appart-66de5.firebasestorage.app",
  messagingSenderId: "707062930592",
  appId: "1:707062930592:web:808144f4a1e0e28626bdc5",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, onValue, set };
