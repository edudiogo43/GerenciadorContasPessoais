import firebase from 'firebase';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCTGSxFcCv6MgiuBbDHct9K65YF9OUu52Q",
    authDomain: "contaspessoais-37947.firebaseapp.com",
    projectId: "contaspessoais-37947",
    storageBucket: "contaspessoais-37947.appspot.com",
    messagingSenderId: "465335364643",
    appId: "1:465335364643:web:9751b80b5156b3c908d596"
};

firebase.initializeApp(firebaseConfig);
//const database = firebase.firestore();

export default firebase;