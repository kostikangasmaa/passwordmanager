import React, { useState } from "react";
import { StyleSheet, View, TextInput, Text, Switch, Button, Alert, ActivityIndicator, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for the eye icon

export default function NewCredentials() {
    const [serviceName, setServiceName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

    // Toggles for password options
    const [includeSpecial, setIncludeSpecial] = useState(true);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeLower, setIncludeLower] = useState(true);
    const [includeUpper, setIncludeUpper] = useState(true);

    // State for password length
    const [passwordLength, setPasswordLength] = useState(12);

    const generatePassword = async () => {
        setLoading(true);
        try {
            const url = `https://passwordwolf.com/api/?length=${passwordLength}&special=${includeSpecial ? "on" : "off"}&numbers=${includeNumbers ? "on" : "off"}&lower=${includeLower ? "on" : "off"}&upper=${includeUpper ? "on" : "off"}`;
            const response = await fetch(url);
            const data = await response.json();
            setPassword(data[0].password); // Set the generated password
        } catch (error) {
            Alert.alert("Choose atleast one option to generate password");
            setPassword(""); 
        } finally {
            setLoading(false);
        }
    };

    const saveCredentials = () => {
        if (!serviceName || !username || !password) {
            Alert.alert("Error", "Please fill in all fields and generate a password.");
            return;
        }
        // Save the credentials (you can implement saving logic here)
        Alert.alert("Success", `Credentials for ${serviceName} saved!`);
        setServiceName("");
        setUsername("");
        setPassword("");
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
                    onChangeText={setPassword} // Allow user to edit the password
                    style={[styles.input, styles.passwordInput]}
                    secureTextEntry={!showPassword} // Toggle secure text entry
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                    <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="gray" />
                </TouchableOpacity>
            </View>
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
        marginVertical: 20,
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
});