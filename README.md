# Password Manager 🔐
This project was developed during Haaga-Helia university of applied sciences mobile programming course.
A secure mobile password manager built with React Native and Firebase. Users can register, log in, generate strong passwords, save credentials, and view or copy their stored passwords securely.

## Features ✨

- **User Authentication:** Register and log in with email and password 🔑
- **Password Generation:** Generate strong, customizable passwords 🛡️
- **Credential Storage:** Save service credentials securely in Firestore 🗄️
- **Password Encryption:** Passwords are encrypted with AES before storage 🔒
- **Password Decryption:** Decrypt and view/copy passwords securely 👁️‍🗨️
- **Clipboard Support:** Copy passwords to clipboard with one tap 📋
- **Responsive UI:** Modern, user-friendly interface with React Native Paper 📱
- **Logout:** Securely sign out from the app 🚪

## Technologies Used 🛠️

- **React Native** (with Expo) 📱
- **Firebase Authentication** 🔥
- **Firebase Firestore** 🗄️
- **AES Encryption** (`aes-js`, `crypto-js`) 🔐
- **React Navigation** 🧭
- **React Native Paper** 📝
- **React Native Vector Icons** 🎨
- **Expo Clipboard** 📋
- **AsyncStorage** 💾

## Getting Started 🚀

### Prerequisites

- [Node.js](https://nodejs.org/) 🟢
- [Expo CLI](https://docs.expo.dev/get-started/installation/) ⚡
- A Firebase project (see below) 🔥

### Installation

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd passwordmanager
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up environment variables:**
   - Create a `.env` file in the root directory:
     ```
     FIREBASE_API_KEY=your_firebase_api_key
     ```

4. **Start the development server:**
   ```sh
   npx expo start
   ```
   - Use Expo Go or an emulator to run the app.

## Firebase Setup ☁️

1. **Create a Firebase Project:**
   - Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.

2. **Enable Authentication:**
   - Go to **Authentication** > **Sign-in method**.
   - Enable **Email/Password**.

3. **Create a Firestore Database:**
   - Go to **Firestore Database** and create a database in test mode (or set up rules as below).

4. **Get Firebase Config:**
   - In **Project Settings**, find your web app’s Firebase config.
   - Copy the `apiKey` and add it to your `.env` file as shown above.

5. **Set Firestore Security Rules:**
   - In Firestore, set the following rules to ensure users can only access their own data:
     ```
     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         match /users/{userEmail}/credentials/{credentialId} {
           allow read, write: if request.auth != null && request.auth.token.email == userEmail;
         }
       }
     }
     ```

6. **Update `firebaseConfig.js`:**
   - Make sure your Firebase config in [`firebaseConfig.js`](firebaseConfig.js) matches your project settings.

## License 📄

This project is licensed under the [MIT License](LICENSE).