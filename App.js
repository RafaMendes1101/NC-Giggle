import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import Login from "./components/Login";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import { onAuthStateChanged, getAuth } from "@firebase/auth";
import { checkNewuser } from "./firebase";
import Profile from "./components/Profile";
import GigScreen from "./components/GigScreen";
import DrawerNavigation from "./components/Navigation";
import { AppContext } from "./context/context";
export default function App() {
  const [user, setUser] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isNewUser, setIsNewUser] = React.useState(true);
  const [currentGigs, setCurrentGigs] = React.useState([{}]);
  const auth = getAuth();
  const Stack = createNativeStackNavigator();

  // check if user is loggen into firebase
  useEffect(() => {
    setIsLoading(true);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("user is logged in");
        setUser(user);
        checkNewuser().then((u) => {
          setIsNewUser(u);
        });
      } else {
        console.log("user is not logged in");
        setUser(null);
      }
      setIsLoading(false);
    });
  }, []);
  if (isLoading) return <Text>Loading...</Text>;
  return (
    <>
      <NavigationContainer>
        <AppContext.Provider value={{ currentGigs, setCurrentGigs }}>
          <Stack.Navigator>
            {user ? (
              <>
                {isNewUser ? (
                  <>
                    <Stack.Screen
                      name="Profile"
                      component={Profile}
                      options={{ headerShown: false }}
                      initialParams={{ newUser: setIsNewUser }}
                    />
                  </>
                ) : (
                  <Stack.Group>
                    <Stack.Screen
                      name="navigator"
                      component={DrawerNavigation}
                      options={{ headerShown: false }}
                    />
                  </Stack.Group>
                )}
              </>
            ) : (
              <>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Sign Up" component={SignUp} />
              </>
            )}
          </Stack.Navigator>
        </AppContext.Provider>
      </NavigationContainer>
    </>
  );
}
