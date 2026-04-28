import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
  type User,
} from "firebase/auth";
import { auth } from "./firebase";

export const signInWithGoogleIdToken = async (idToken: string): Promise<void> => {
  if (!auth) {
    throw new Error("Firebase is not configured.");
  }

  const credential = GoogleAuthProvider.credential(idToken);
  await signInWithCredential(auth, credential);
};

export const signOutCurrentUser = async (): Promise<void> => {
  if (!auth) {
    return;
  }

  await signOut(auth);
};

export const subscribeToAuthState = (callback: (user: User | null) => void): (() => void) => {
  if (!auth) {
    callback(null);
    return () => undefined;
  }

  return onAuthStateChanged(auth, callback);
};
