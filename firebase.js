// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  getFirestore,
  collection,
  addDoc,
  updateDoc,
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwuwcfV_yiEVliu-hwBDHSU9zvrzf0S88",
  authDomain: "test-authentication-with-react.firebaseapp.com",
  projectId: "test-authentication-with-react",
  storageBucket: "test-authentication-with-react.appspot.com",
  messagingSenderId: "509266572396",
  appId: "1:509266572396:web:18a0816e4fc471a6c85449",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();
const db = getFirestore();

export const createUser = async (email, password) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      console.log("User created successfully");
    })
    .catch((error) => {
      alert(error);
    });
};

export const signIn = async (email, password) => {
  await signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      return auth.currentUser;
    })
    .catch((error) => {
      alert(error);
    });
};

export const signInWithGoogle = async () => {
  signInWithRedirect(auth, provider);
};

export const getGoogleLogIn = async () => {
  getRedirectResult(auth, provider)
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const signOutUser = async () => {
  signOut(auth);
};

export const checkNewuser = async () => {
  if (auth.currentUser) {
    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    return !docSnap.exists();
  }
};

export const getUserInfo = async () => {
  if (auth.currentUser) {
    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    return docSnap;
  }
};

// use this when you need user information on a certain page/component
// gets called when user is signed in
// use getAuth to get auth object
// onAuthStateChanged(auth, (user) => {
//   try {
//     checkNewuser().then((u) => {
//       if (u) {
//         const userData = {
//           email: user.email,
//           uid: user.uid,
//           profile_picture: user.photoURL,
//           displayName: user.displayName,
//           age: 0,
//           city: "",
//           bio: "",
//           rating: 0,
//           awards: [],
//           genrePrefrences: [],
//           isNewUser: true,
//         };
//         setDoc(doc(db, "users", user.uid), userData);
//       }
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

export const updateUser = async (userData) => {
  const userRef = doc(db, "users", auth.currentUser.uid);
  await updateDoc(userRef, userData);
};

export default app;
