import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyASyNUDIJ-iYvXH_DSZKpWlKdAETyRVS4k",
  authDomain: "react-login-f720a.firebaseapp.com",
  projectId: "react-login-f720a",
  storageBucket: "react-login-f720a.firebasestorage.app",
  messagingSenderId: "990381966893",
  appId: "1:990381966893:web:f14e7c358f2c8ebe33daa4"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)

