import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { firestore } from './config';

export interface UserData {
  email: string;
  displayName: string;
  lastLogin: Date | null;
  blockedUser: boolean;
}

export const saveUserData = async (user: User): Promise<void> => {
  try {
    const userDocumentReference = doc(firestore, 'users', user.uid);

    await setDoc(userDocumentReference, {
      email: user.email,
      displayName: user.displayName || 'Anonymous',
      lastLogin: serverTimestamp(),
    }, { merge: true });
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
};

export const getUserData = async (userId: string): Promise<UserData | null> => {
  try {
    const userDocumentReference = doc(firestore, 'users', userId);
    const userDocumentSnapshot = await getDoc(userDocumentReference);

    if (userDocumentSnapshot.exists()) {
      const data = userDocumentSnapshot.data();
      return {
        email: data.email,
        displayName: data.displayName,
        lastLogin: data.lastLogin?.toDate() || null,
        blockedUser: data.blockedUser || false,
      };
    }

    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
};
