import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

var firebaseConfig = {
    apiKey: "AIzaSyBvo8J3G_CPptEozD05PBGC3NPPT17QQ0U",
    authDomain: "shaunovi-kvizovi.firebaseapp.com",
    databaseURL: "https://shaunovi-kvizovi.firebaseio.com",
    projectId: "shaunovi-kvizovi",
    storageBucket: "shaunovi-kvizovi.appspot.com",
    messagingSenderId: "402367154675",
    appId: "1:402367154675:web:79f0486b4a4065c6246a86",
    measurementId: "G-SKFNFDV2XP"
  };
firebase.initializeApp(firebaseConfig);

export default firebase;