import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyBQAQh8N3ZtV6GxVC1rhGQgpmySuS9Bg2I",
  authDomain: "insta-clone-2e17e.firebaseapp.com",
  projectId: "insta-clone-2e17e",
  storageBucket: "insta-clone-2e17e.appspot.com",
  messagingSenderId: "42360991148",
  appId: "1:42360991148:web:1d8fb350138e4ce41d1e09"
};

//need to check if app already been initialized on server bc this can be run on server and client - two times bad
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore()
const storage = getStorage()


export { app, db, storage }