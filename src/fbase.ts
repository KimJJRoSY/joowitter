import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCzrsIuq5TQL0D2EDFU1uhxhygD6Jh3tuU",
  authDomain: "twitterclone-d4d38.firebaseapp.com",
  projectId: "twitterclone-d4d38",
  storageBucket: "twitterclone-d4d38.appspot.com",
  messagingSenderId: "560398917199",
  appId: "1:560398917199:web:957161d29cf2526a44543a",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
