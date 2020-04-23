import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyBiqxqnMhjX7hTW0TIAIi39x_kJLgcOA3o",
  authDomain: "mutualimpact123.firebaseapp.com",
  databaseURL: "https://mutualimpact123.firebaseio.com",
  projectId: "mutualimpact123",
  storageBucket: "mutualimpact123.appspot.com",
  messagingSenderId: "442957924997",
  appId: "1:442957924997:web:93955ab269dbb7133db7ec",
  measurementId: "G-CY5QHWCCBE"
};

if (!firebase.apps.length) firebase.initializeApp(config);

const auth = firebase.auth();
const db = firebase.firestore();

export { auth, db };
