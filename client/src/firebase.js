import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
const firebaseConfig = {
    apiKey: "AIzaSyC6nb2_r-JTRSVs5-9celW69fKCn4fcjUw",
    authDomain: "firechess0.firebaseapp.com",
    databaseURL: "https://firechess0-default-rtdb.firebaseio.com",
    projectId: "firechess0",
    storageBucket: "firechess0.appspot.com",
    messagingSenderId: "897411439363",
    appId: "1:897411439363:web:bca1b67cd29e78e71e6736",
    measurementId: "G-F7N1H13P3R"
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();

export const db = firebase.firestore();
export const arrayUnion = firebase.firestore.FieldValue.arrayUnion