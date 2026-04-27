import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBl5KnceoQOftbo7iYB3DhHbvKjctJibis",
  authDomain: "food-delivery-app-acff2.firebaseapp.com",
  projectId: "food-delivery-app-acff2",
  storageBucket: "food-delivery-app-acff2.firebasestorage.app",
  messagingSenderId: "877648006121",
  appId: "1:877648006121:web:4a97cf3d85c66ee520d978",
  measurementId: "G-PQ4FGXX5KY"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);