import React, { useState } from "react";
import { StyleSheet, View, TextInput, Button, Text } from "react-native";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig"; 
import { Snackbar } from "react-native-paper";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleAuth = async () => {
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        showSnackbar("Account created successfully!");
        setIsSignUp(false); 
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        showSnackbar("Logged in successfully!");
      }
    } catch (error) {
      showSnackbar(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isSignUp ? "Sign Up" : "Password Manager"}</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <Button
          title={isSignUp ? "Sign Up" : "Login"}
          onPress={handleAuth}
          color="#007bff"
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title={isSignUp ? "Back to Login" : "Register for an Account"}
          onPress={() => setIsSignUp(!isSignUp)}
          color="#28a745"
        />
      </View>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000} 
        action={{
          label: "OK",
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  title: {
    marginBottom: 20,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  buttonContainer: {
    width: "100%",
    marginVertical: 10,
    borderRadius: 5,
    overflow: "hidden",
  },
});