import { GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, browserLocalPersistence, setPersistence } from 'firebase/auth';
import type { User, AuthError } from 'firebase/auth';
import { auth } from './config';

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async (): Promise<User> => {
  try {
    // Ensure persistence is set before sign-in attempt
    await setPersistence(auth, browserLocalPersistence);
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    const authError = error as AuthError;
    console.error('Error signing in with Google:', authError);

    // Handle storage partitioning error by clearing state and retrying once
    if (authError.code === 'auth/missing-initial-state' ||
        authError.message?.includes('missing initial state')) {
      console.log('Detected storage issue, clearing state and retrying...');
      try {
        // Clear any stale auth state
        await firebaseSignOut(auth);
        // Retry the sign-in
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
      } catch (retryError) {
        console.error('Retry also failed:', retryError);
        throw retryError;
      }
    }

    throw error;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};
