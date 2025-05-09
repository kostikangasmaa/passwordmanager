import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { Divider, Snackbar } from "react-native-paper";
import { getAuth } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import CryptoJS from "crypto-js";
import { decryptPassword } from "./DecryptPassword";

export default function ListCredentials() {
    const [credentials, setCredentials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [passwordVisibility, setPasswordVisibility] = useState({});
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const showSnackbar = (message) => {
        setSnackbarMessage(message);
        setSnackbarVisible(true);
    };

    useEffect(() => {
        const fetchCredentials = async () => {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                showSnackbar("No user is signed in.");
                setLoading(false);
                return;
            }

            try {
                const userEmail = user.email;
                const credentialsRef = collection(db, "users", userEmail, "credentials");
                const querySnapshot = await getDocs(credentialsRef);

                const fetchedCredentials = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setCredentials(fetchedCredentials);
            } catch (error) {
                console.error("Error fetching credentials:", error);
                showSnackbar("Failed to fetch credentials.");
            } finally {
                setLoading(false);
            }
        };

        fetchCredentials();
    }, []);

    const togglePasswordVisibility = async (id, encryptedPassword) => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            showSnackbar("No user is signed in.");
            return;
        }

        const hashedKey = CryptoJS.SHA256(user.uid).toString(); 

        try {
            // Decrypt the password
            const decryptedPassword = await decryptPassword(encryptedPassword, hashedKey);

            // Update the password visibility state
            setPasswordVisibility((prevState) => ({
                ...prevState,
                [id]: prevState[id] ? null : decryptedPassword, 
            }));
        } catch (error) {
            showSnackbar("Failed to decrypt the password.");
        }
    };

    const copyToClipboard = async (encryptedPassword) => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            showSnackbar("No user is signed in.");
            return;
        }

        const hashedKey = CryptoJS.SHA256(user.uid).toString();

        try {
            const decryptedPassword = await decryptPassword(encryptedPassword, hashedKey);

            // Copy the decrypted password to the clipboard
            await Clipboard.setStringAsync(decryptedPassword);
            showSnackbar("The password has been copied to your clipboard.");
        } catch (error) {
            showSnackbar("Failed to decrypt and copy the password.");
        }
    };

    const renderItem = ({ item }) => {
        const isPasswordVisible = passwordVisibility[item.id] || false;
        const displayedPassword = isPasswordVisible ? passwordVisibility[item.id] : "••••••••";
        return (
            <View style={styles.credentialItem}>
                <Text style={styles.serviceName}>{item.serviceName}</Text>
                <Text>Username: {item.username}</Text>
                <Text>Password: {displayedPassword}</Text>
                <Divider />
                <View style={styles.passwordContainer}>
                    <TouchableOpacity
                        onPress={() => togglePasswordVisibility(item.id, item.password)}
                        style={styles.eyeIcon}
                    >
                        <Ionicons name={isPasswordVisible ? "eye-off" : "eye"} size={24} color="gray" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => copyToClipboard(item.password)}
                        style={styles.copyIcon}
                    >
                        <Ionicons name="copy" size={24} color="gray" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#007bff" />
            ) : credentials.length > 0 ? (
                <FlatList
                    data={credentials}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                />
            ) : (
                <Text style={styles.noCredentialsText}>No credentials saved.</Text>
            )}

            {/* Snackbar */}
            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={3000}
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
    credentialItem: {
        padding: 15,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        marginBottom: 10,
        backgroundColor: "#fff",
    },
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 5,
    },
    serviceName: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
    noCredentialsText: {
        fontSize: 16,
        textAlign: "center",
        marginTop: 20,
        color: "#888",
    },
});