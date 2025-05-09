import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { getAuth, signOut } from "firebase/auth";

export default function Logout({ navigation }) {
    const auth = getAuth();
  
    useEffect(() => {
      const logoutUser = async () => {
        try {
          await signOut(auth);
          
        } catch (error) {
          console.error("Error logging out:", error);
        }
      };
  
      logoutUser();
    }, []);
  
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f8f8f8",
    },
  });