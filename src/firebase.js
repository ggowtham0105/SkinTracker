import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAcaRLnvxLuGM89d4A-OUieFUBkIH15-ig",
  authDomain: "skintracking.firebaseapp.com",
  projectId: "skintracking",
  storageBucket: "skintracking.firebasestorage.app",
  messagingSenderId: "585516726980",
  appId: "1:585516726980:web:7958f74ebdf0847cdb6791",
  measurementId: "G-78EFG30CCL",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  return {
    email: user.email,
    name: user.displayName || user.email.split("@")[0],
    sub: user.uid,
    photoURL: user.photoURL,
  };
}

export { signOut };
