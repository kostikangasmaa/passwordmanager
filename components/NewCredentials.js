import React, { useState } from "react";
import { StyleSheet, View, TextInput, Text, Switch, Button, Alert, ActivityIndicator, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons";
import { doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebaseConfig";
import { Snackbar } from "react-native-paper";
import CryptoJS from "crypto-js";
import aesjs from "aes-js";

export default function NewCredentials() {
    const [serviceName, setServiceName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    
    const [includeSpecial, setIncludeSpecial] = useState(true);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeLower, setIncludeLower] = useState(true);
    const [includeUpper, setIncludeUpper] = useState(true);

    
    const [passwordLength, setPasswordLength] = useState(12);

    
    const evaluatePasswordStrength = (password) => {
        let score = -1;
        if (password.length >= 12) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[a-z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 1;
        return score;
    };

    const passwordStrength = evaluatePasswordStrength(password);
    const strengthColors = ['#ff0000', '#ff8000', '#ffff00', '#80ff00', '#00ff00'];
    const strengthLabels = ['Terrible', 'Weak', 'Medium', 'Strong', 'SUPAR Strong'];

    const showSnackbar = (message) => {
        setSnackbarMessage(message);
        setSnackbarVisible(true);
    };

    const generatePassword = async () => {
        setLoading(true);
        try {
            const url = `https://passwordwolf.com/api/?length=${passwordLength}&special=${includeSpecial ? "on" : "off"}&numbers=${includeNumbers ? "on" : "off"}&lower=${includeLower ? "on" : "off"}&upper=${includeUpper ? "on" : "off"}`;
            const response = await fetch(url);
            const data = await response.json();
            setPassword(data[0].password); 
        } catch (error) {
            showSnackbar("Choose at least one option to generate a password.");
            setPassword("");
        } finally {
            setLoading(false);
        }
    };

    const encryptPassword = (password, hashedKey) => {
        try {
            // Convert password to bytes
            const passwordBytes = aesjs.utils.utf8.toBytes(password);

            // Convert hashed key (already SHA-256) to bytes
            const keyBytes = aesjs.utils.hex.toBytes(hashedKey);

            // Generate a random IV (Initialization Vector)
            const iv = Array.from({ length: 16 }, () => Math.floor(Math.random() * 256));

            // Encrypt the password using AES-CBC
            const aesCbc = new aesjs.ModeOfOperation.cbc(keyBytes, iv);
            const paddedPasswordBytes = aesjs.padding.pkcs7.pad(passwordBytes);
            const encryptedBytes = aesjs.utils.hex.fromBytes(aesCbc.encrypt(paddedPasswordBytes));

            // Convert IV to hex
            const ivHex = aesjs.utils.hex.fromBytes(iv);

            // Return a single string combining encrypted password and IV
            return `${encryptedBytes}:${ivHex}`;
        } catch (error) {
            console.error("Error encrypting password:", error);
            throw error;
        }
    };

    const saveCredentials = async () => {
        const auth = getAuth(); 
        const user = auth.currentUser; 

        if (!user) {
            showSnackbar("No user is signed in.");
            return;
        }

        const userEmail = user.email; 

        if (!serviceName || !username || !password) {
            showSnackbar("Please fill in all fields and generate a password.");
            return;
        }

        const Key = CryptoJS.SHA256(user.uid).toString();
        const encryptedPassword = encryptPassword(password, Key);
        console.log(encryptedPassword)


        const credentials = {
            serviceName,
            username,
            password: encryptedPassword, 
            createdAt: new Date(),
        };

        try {
            // Save the credentials under the user's email in Firestore
            await setDoc(doc(db, "users", userEmail, "credentials", serviceName), credentials);
            showSnackbar(`Credentials for ${serviceName} saved!`);
            setServiceName("");
            setUsername("");
            setPassword("");
        } catch (error) {
            showSnackbar("Failed to save credentials.");
            console.error("Error saving credentials:", error);
        }
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#007bff" />
            ) : (
                <Text style={styles.title}>New Credentials</Text>
            )}
            <TextInput
                placeholder="Service Name"
                value={serviceName}
                onChangeText={setServiceName}
                style={styles.input}
            />
            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
            />
            <View style={styles.passwordContainer}>
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    style={[styles.input, styles.passwordInput]}
                    secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                    <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="gray" />
                </TouchableOpacity>
            </View>
            {password && (
                <View style={styles.strengthContainer}>
                    <Text>Strength: {strengthLabels[passwordStrength]}</Text>
                    <View style={[styles.strengthBar, {backgroundColor: strengthColors[passwordStrength]}]} />
                </View>
            )}
            <View style={styles.switchContainer}>
                <Text>Include Special Characters</Text>
                <Switch value={includeSpecial} onValueChange={setIncludeSpecial} />
            </View>
            <View style={styles.switchContainer}>
                <Text>Include Numbers</Text>
                <Switch value={includeNumbers} onValueChange={setIncludeNumbers} />
            </View>
            <View style={styles.switchContainer}>
                <Text>Include Lowercase Letters</Text>
                <Switch value={includeLower} onValueChange={setIncludeLower} />
            </View>
            <View style={styles.switchContainer}>
                <Text>Include Uppercase Letters</Text>
                <Switch value={includeUpper} onValueChange={setIncludeUpper} />
            </View>
            <View style={styles.sliderContainer}>
                <Text>Password Length: {passwordLength}</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={8}
                    maximumValue={20}
                    step={1}
                    value={passwordLength}
                    onValueChange={setPasswordLength}
                />
            </View>
            <View style={styles.buttonContainer}>
                <Button
                    title="Generate Password"
                    onPress={generatePassword}
                    color="#007bff"
                />
            </View>
            <View style={styles.buttonContainer}>
                <Button
                    title="Save Credentials"
                    onPress={saveCredentials}
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
        padding: 20,
        backgroundColor: "#f8f8f8",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        fontSize: 16,
    },
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        marginBottom: 10,
    },
    passwordInput: {
        flex: 1,
        padding: 10,
    },
    eyeIcon: {
        padding: 10,
    },
    switchContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 5,
    },
    sliderContainer: {
        marginVertical: 5,
    },
    slider: {
        width: "100%",
        height: 40,
    },
    buttonContainer: {
        marginVertical: 5,
        borderRadius: 5,
        overflow: "hidden",
    },
    strengthContainer: {
        marginVertical: 1,
    },
    strengthBar: {
        height: 5,
        borderRadius: 5,
        marginTop: 5,
    },
});