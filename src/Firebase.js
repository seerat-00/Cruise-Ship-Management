import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase project configuration object
const firebaseConfig = {
  apiKey: "", 
  authDomain: "", 
  projectId: "", 
  storageBucket: "", 
  messagingSenderId: "", 
  appId: "" 
}; //empty for security reason

// Initialize Firebase app with config object
const app = initializeApp(firebaseConfig);
console.log('Firebase app initialized:', app.name); // Log Firebase app name (usually '[DEFAULT]')

// Initialize Firebase Authentication and Firestore services
const auth = getAuth(app);
console.log('Firebase Auth service initialized.');

const db = getFirestore(app);
console.log('Firestore database service initialized.');

// Export initialized services for use in other parts of the app
export { app, auth, db };
