import React, { useEffect } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import Login from "./components/Login";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUp from "./components/SignUp";
import { onAuthStateChanged, getAuth } from "@firebase/auth";
import { checkNewuser, getUserInfo } from "./firebase";
import Profile from "./components/Profile";
import Chats from "./components/Chats";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import DrawerNavigation from "./components/Navigation";
import { UserProvider, UserContext } from "./context/context";

export default function App() {
  // console.log(UserContext);
  const { setUserParams } = React.useContext(UserContext);

  const [user, setUser] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [isNewUser, setIsNewUser] = React.useState(true);

  const auth = getAuth();
  const db = getFirestore();
  const Stack = createNativeStackNavigator();
  const HomeStack = createNativeStackNavigator();

  // check if user is loggen into firebase
  useEffect(() => {
    setIsLoading(true);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        checkNewuser().then((u) => {
          if (u) {
            const userData = {
              email: user.email,
              uid: user.uid,
              profile_picture: user.photoURL,
              displayName: user.displayName,
              age: 0,
              city: "",
              bio: "",
              rating: 0,
              awards: [],
              genrePreferences: [],
              isNewUser: true,
            };

            setDoc(doc(db, "users", user.uid), userData);
          }
          getUserInfo().then((userInfo) => {
            console.log(userInfo._document.data.value.mapValue.fields);
            setUserParams({
              city: userInfo._document.data.value.mapValue.fields.city
                .stringValue,
              genre:
                userInfo._document.data.value.mapValue.fields.genrePreferences
                  .arrayValue.values[0].stringValue,
            });
          });

          setIsNewUser(u);
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <Text>Loading...</Text>;
  return (
    <>
      <NavigationContainer>
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
                <>
                  <Stack.Screen
                    name="navigator"
                    component={DrawerNavigation}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen name="Chats" component={Chats}></Stack.Screen>
                </>
              )}
            </>
          ) : (
            <>
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Sign Up" component={SignUp} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
