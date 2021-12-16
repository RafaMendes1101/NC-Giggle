import {
  Text,
  View,
  Image,
  TextInput,
  StyleSheet,
  Dimensions,
  Pressable,
  Picker,
} from "react-native";
import { getAuth } from "firebase/auth";
import React, { useEffect } from "react";
import { updateUser } from "../firebase";
import MultiSelect from "react-native-multiple-select";
export default function Profile({ navigation, route }) {
  // console.log(route);
  const [userData, setUserData] = React.useState({ isNewUser: false });
  const [isLoading, setIsLoading] = React.useState(true);
  const [genreValue, setGenreValue] = React.useState("");
  const auth = getAuth();
  const genres = [
    { id: "", name: "Pick favorite genre" },
    { id: "KnvZfZ7vAvv", name: "Alternative" },
    { id: "KnvZfZ7vAve", name: "Ballads/Romantic" },
    { id: "KnvZfZ7vAvd", name: "Blues" },
    { id: "KnvZfZ7vAvA", name: "Chanson Francais" },
    { id: "KnvZfZ7vAvk", name: "Children's Music" },
    { id: "KnvZfZ7vAeJ", name: "Classical" },
    { id: "KnvZfZ7vAv6", name: "Country" },
    { id: "KnvZfZ7vAvF", name: "Dance/Electronic" },
    { id: "KnvZfZ7vAva", name: "Folk" },
    { id: "KnvZfZ7vAv1", name: "Hip-Hop/Rap" },
    { id: "KnvZfZ7vAvJ", name: "Holiday" },
    { id: "KnvZfZ7vAvE", name: "Jazz" },
    { id: "KnvZfZ7vAJ6", name: "Latin" },
    { id: "KnvZfZ7vAvI", name: "Medieval/Renaissance" },
    { id: "KnvZfZ7vAvt", name: "Metal" },
    { id: "KnvZfZ7vAvn", name: "New Age" },
    { id: "KnvZfZ7vAvl", name: "Other" },
    { id: "KnvZfZ7vAev", name: "Pop" },
    { id: "KnvZfZ7vAee", name: "R&B" },
    { id: "KnvZfZ7vAed", name: "Reggae" },
    { id: "KnvZfZ7vAe7", name: "Religious" },
    { id: "KnvZfZ7vAeA", name: "Rock" },
    { id: "KnvZfZ7vAeF", name: "World" },
  ];

  useEffect(() => {
    if (auth.currentUser) {
      setIsLoading(false);
    }
  }, [auth.currentUser]);
  if (isLoading) {
    return <Text>isLoading</Text>;
  }
  return (
    <View style={styles.container}>
      <Image
        source={require("../images/3.png")}
        style={{ width: 375, height: 200 }}
      ></Image>
      {/* <Text style={styles.text}>{auth.currentUser.displayName} Profile</Text> */}
      <TextInput
        placeholder={auth.currentUser.displayName || "name"}
        placeholderTextColor="#EBE645"
        style={styles.input}
        onChangeText={(text) => setUserData({ ...userData, displayName: text })}
      />
      <TextInput
        placeholder="age"
        placeholderTextColor="#EBE645"
        style={styles.input}
        onChangeText={(text) => setUserData({ ...userData, age: text })}
      />
      <TextInput
        placeholder="city"
        placeholderTextColor="#EBE645"
        style={styles.input}
        onChangeText={(text) => setUserData({ ...userData, city: text })}
      />
      <TextInput
        placeholder="bio"
        placeholderTextColor="#EBE645"
        style={styles.input}
        onChangeText={(text) => setUserData({ ...userData, bio: text })}
      />
      <TextInput
        placeholder="profile picture"
        placeholderTextColor="#EBE645"
        style={styles.input}
        onChangeText={(text) =>
          setUserData({ ...userData, profile_picture: text })
        }
      />
      <Picker
        style={styles.inputDropDown}
        selectedValue={genreValue}
        onChange={(itemValue) => {
          setGenreValue(itemValue.target.value);

          setUserData({
            ...userData,
            genrePreferences: itemValue.target.value,
          });
        }}
      >
        {genres.map((genre) => {
          return (
            <Picker.Item key={genre.id} value={genre.id} label={genre.name} />
          );
        })}
      </Picker>

      <Pressable
         style={({ pressed }) => [
          { opacity: pressed ? 0.5 : 1.0 }, 
          styles.button
        ]}
        onPress={() => {
          updateUser(userData).then(() => {
            route.params.newUser(true);
          });
        }}
      >
        <Text style={styles.text}>Confirm</Text>
      </Pressable>
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
  input: {
    marginBottom: 30,
    backgroundColor: "#577BC1",
    color: "#EBE645",
    fontSize: 24,
    height: 40,
    width: Dimensions.get("window").width - 50,
    borderRadius: 10,
    padding: 10,
  },
  inputDropDown:{
      marginBottom: 30,
      backgroundColor: "#577BC1",
      color: "#EBE645",
      fontSize: 24,
      height: 40,
      width: Dimensions.get("window").width - 50,
      borderRadius: 10,
      // padding: 10,
  },
  button: {
    backgroundColor: "#577BC1",
    alignItems: "center",
    height: 40,
    fontSize: 16,
    marginBottom: 20,
    paddingBottom: 5,
    elevation: 2,
    width: Dimensions.get("window").width / 2,
    borderRadius: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: "700",
    color: "#EBE645",
    padding: 7,

  },
});
