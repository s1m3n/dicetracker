import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCoABXAPkFY7AAp8tBZUWzFICmbX2iCJ1A',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'thedicetracker.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'thedicetracker',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'thedicetracker.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1044596557320',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1044596557320:web:58c59df9f8ff06a93ab3bd'
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);

const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

if (isLocalhost) {
  try {
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    connectFirestoreEmulator(firestore, 'localhost', 8080);
    console.log('Connected to Firebase emulators');
  } catch (error) {
    console.warn('Emulators already connected or not available:', error);
  }
}

export default app;
