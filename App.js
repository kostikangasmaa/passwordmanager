import React, { useState, useEffect } from "react";
import { StyleSheet, ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator, TransitionPresets } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Login from "./components/Login";
import Logout from "./components/Logout";
import NewCredentials from "./components/NewCredentials";
import ListCredentials from "./components/ListCredentials";
import { StatusBar } from 'expo-status-bar';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Passwords"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Add") {
            iconName = "key-plus";
          } else if (route.name === "Passwords") {
            iconName = "folder-key-outline"; 
          }
          else if (route.name === "Logout") {
            iconName = "logout-variant"; 
          }

          return <MaterialCommunityIcons name={iconName} color={color} size={size} />;
        },
        tabBarActiveTintColor: "#007bff", 
        tabBarInactiveTintColor: "gray", 
      })}
    >
      <Tab.Screen name="Add" component={NewCredentials} options={TransitionPresets.ShiftTransition} />
      <Tab.Screen name="Passwords" component={ListCredentials} options={TransitionPresets.ShiftTransition} />
      <Tab.Screen name="Logout" component={Logout} options={TransitionPresets.ShiftTransition}/>
    </Tab.Navigator>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); 
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user); // Set to true if user is logged in, false otherwise
    });

    return unsubscribe; // Cleanup subscription on unmount
  }, []);

  if (isAuthenticated === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator>
        {isAuthenticated ? (
          <Stack.Screen
            name="Home"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
        ) : (
          
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
});