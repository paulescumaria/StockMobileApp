// Import the functions you need from the SDKs you need
//import * as firebase from "firebase";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDYw_HC1P5SPBtXB85w7LApt840DMwznOs",
  authDomain: "appstock-fe44a.firebaseapp.com",
  projectId: "appstock-fe44a",
  storageBucket: "appstock-fe44a.appspot.com",
  messagingSenderId: "1001481357785",
  appId: "1:1001481357785:web:39635892e707fe3c3131c8"
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
} else {
     app = firebase.app();
}

const auth = firebase.auth();

export { auth }
// const app = initializeApp(firebaseConfig);