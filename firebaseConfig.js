import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const firebaseConfig = {
    apiKey: Constants.expoConfig.extra.firebaseApiKey,
    authDomain: "pilvi-react-b15e8.firebaseapp.com",
    projectId: "pilvi-react-b15e8",
    storageBucket: "pilvi-react-b15e8.firebasestorage.app",
    messagingSenderId: "914477483142",
    appId: "1:914477483142:web:14f991b04f20c7e2983d07",
    measurementId: "G-NLS70S56RM"
  };

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { auth, db };
// getAuth() can be used any time after initialization

/* alla on firestore tietokannan säännöt, jotka sallii käyttäjien lukea ja kirjoittaa vain omia tietojaan nämä säännöt on lisättävä Firestore konsolissa

rules_version = '2';
service cloud.firestore {
    match /databases/{database}/documents {
      // Allow users to read and write their own data
      match /users/{userEmail}/credentials/{credentialId} {
        allow read, write: if request.auth != null && request.auth.token.email == userEmail;
      }
    }
  }

*/