import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import React, { useContext } from "react";
import { signIn, signOutUser, getUserInfo } from "../firebase";
import { UserContext } from "../context/context";

export default function Login({ navigation }) {
  const { setUserParams } = useContext(UserContext);
  const getUser = async () => {
    await getUserInfo().then((userInfo) => {
      // console.log("getting user");
      setUserParams(() => {
        return {
          city: userInfo._document.data.value.mapValue.fields.city.stringValue,
          genre:
            userInfo._document.data.value.mapValue.fields.genrePreferences
              .arrayValue.values[0].stringValue,
        };
      });
    });
  };
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  return (
    <View style={styles.container}>
      <TextInput
        style={{ height: 40, borderColor: "blue", borderWidth: 2 }}
        placeholder="email"
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={{ height: 40, borderColor: "blue", borderWidth: 2 }}
        placeholder="pass"
        onChangeText={(text) => setPassword(text)}
      />
      <Button
        title="Login"
        color="blue"
        onPress={() => {
          signIn(email, password).then(() => {
            getUser();
          });
        }}
      />

      <Button
        title="Sign Up"
        onPress={() => {
          navigation.navigate("Sign Up");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
