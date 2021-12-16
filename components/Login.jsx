import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  Text,
  Image,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { signIn } from "../firebase";
import Icon from 'react-native-vector-icons/FontAwesome5';

export default function Login({ navigation, route }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [hidePass, setHidePass] = useState(true)
  return (
    <View style={styles.container}>
      <Image
        source={require("../images/3.png")}
        style={{ width: 375, height: 200 }}
      ></Image>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#EBE645"
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        secureTextEntry={true}
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#EBE645"
        onChangeText={(text) => setPassword(text)}
      />
       <View style={styles.buttonsView}>
        <Pressable
        style={({ pressed }) => [
          { opacity: pressed ? 0.5 : 1.0 }, 
          styles.button
        ]}
          color="blue"
          onPress={() => {
            signIn(email, password).then(() => {
              route.params.newUser(true);
            });
          }}
        >
          <Text style={styles.text}>Log In</Text>
        </Pressable>
        <Pressable
        style={({ pressed }) => [
          { opacity: pressed ? 0.5 : 1.0 }, 
          styles.button
        ]}
          onPress={() => {
            navigation.navigate("Sign Up");
          }}
        >
          <Text style={styles.text}>Sign Up</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000957",
    alignItems: "center",
    justifyContent: "center",
  },
  // buttonsView: {
  //   flex: 1,
  // },
  input: {
    marginBottom: 30,
    backgroundColor: "#577BC1",
    color: "#EBE645",
    fontSize: 24,
    height: 40,
    width: Dimensions.get("window").width - 50,
    borderRadius: 10,
    padding: 10
    // marginRight: 5,
    // marginLeft: 5
  },
  button: {
    backgroundColor: "#577BC1",
    alignItems: "center",
    height: 40,
    fontSize: 16,
    marginBottom: 20,
    paddingBottom: 5,
    borderRadius: 10,
    elevation: 2,
    width: Dimensions.get("window").width / 2,
  },
  text: {
    fontSize: 20,
    fontWeight: "700",
    color: "#EBE645",
    padding: 7,
  },
  eye: {
    flexDirection: "row",
    alignItems: "baseline",
    paddingLeft: 8
  }
});
