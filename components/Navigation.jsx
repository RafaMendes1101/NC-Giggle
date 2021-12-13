import React, { useContext, useEffect, useState } from "react";
import GigScreen from "./GigScreen";
import Profile from "./Profile";
import Chats from "./Chats";
import { createDrawerNavigator } from "@react-navigation/drawer";
import UserProfile from "./UserProfile";
import { getGigsForHomePage } from "../utils/api";
import {
	View,
	Button,
	Text,
	StyleSheet,
	Modal,
	Pressable,
	Picker,
} from "react-native";

import { UserContext } from "../context/context";

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
	const {userParams} = useContext(UserContext);
	console.log(userParams.city, "Params")
	const [modalVisible, setModalVisible] = useState(false);
	const [genreValue, setGenreValue] = useState(userParams.genre);
	const [sortByValue, setSortByValue] = useState("date,asc");
	const [userCity, setUserCity] = useState(userParams.city);
	console.log(userParams.city, '<=============')
	const [gigs, setGigs] = useState([{}]);
	const [filtered, setFiltered] = useState(false);
	const [genres, setGenres] = useState([
		{ value: "KnvZfZ7vAvv", label: "Alternative" },
		{ value: "KnvZfZ7vAve", label: "Ballads/Romantic" },
		{ value: "KnvZfZ7vAvd", label: "Blues" },
		{ value: "KnvZfZ7vAvA", label: "Chanson Francais" },
		{ value: "KnvZfZ7vAvk", label: "Children's Music" },
		{ value: "KnvZfZ7vAeJ", label: "Classical" },
		{ value: "KnvZfZ7vAv6", label: "Country" },
		{ value: "KnvZfZ7vAvF", label: "Dance/Electronic" },
		{ value: "KnvZfZ7vAva", label: "Folk" },
		{ value: "KnvZfZ7vAv1", label: "Hip-Hop/Rap" },
		{ value: "KnvZfZ7vAvE", label: "Jazz" },
		{ value: "KnvZfZ7vAJ6", label: "Latin" },
		{ value: "KnvZfZ7vAvI", label: "Medieval/Renaissance" },
		{ value: "KnvZfZ7vAvt", label: "Metal" },
		{ value: "KnvZfZ7vAvn", label: "New Age" },
		{ value: "KnvZfZ7vAvl", label: "Other" },
		{ value: "KnvZfZ7vAev", label: "Pop" },
		{ value: "KnvZfZ7vAee", label: "R&B" },
		{ value: "KnvZfZ7vAed", label: "Reggae" },
		{ value: "KnvZfZ7vAe7", label: "Religious" },
		{ value: "KnvZfZ7vAeA", label: "Rock" },
		{ value: "KnvZfZ7vAeF", label: "World" },
	]);
	const [sort, setSort] = useState([
		{ value: "date,asc", label: "Date Ascending" },
		{ value: "date,desc", label: "Date Descending" },
		{ value: "name,asc", label: "Name Ascending" },
		{ value: "name,desc", label: "Name Descending" },
		{ value: "venueName,asc", label: "Venue Name Ascending" },
		{ value: "venueName,desc", label: "Venue Name Descending" },
		{ value: "random", label: "Random" },
	]);

	const filter = () => {
		getGigsForHomePage(genreValue, sortByValue, userCity).then((results) => {
			setGigs(results);
			setFiltered(true);
		});
		setModalVisible(!modalVisible);
	};

	return (
		<>
			<Drawer.Navigator initialRouteName="Home">
				<Drawer.Screen
					name="Home"
					children={() => (
						<GigScreen events={gigs} genreId={genreValue} sort={sortByValue} city={userCity}/>
					)}
					options={{
						headerTitle: "Gigs",
						headerRight: () => (
							<>
								<>
									<Button
										onPress={() => setModalVisible(!modalVisible)}
										title="Filter"
										color="gray"
									/>
								</>
							</>
						),
					}}
				/>
				<Drawer.Screen name="Profile" component={UserProfile} />
				<Drawer.Screen name="Chats" component={Chats} />
			</Drawer.Navigator>
			<View>
				<Modal visible={modalVisible} animationType="slide">
					<View style={styles.container}>
						<Text style={styles.text}>Select a genre:</Text>
						<Picker
							selectedValue={genreValue}
							onChange={(itemValue) => setGenreValue(itemValue.target.value)}
						>
							{genres.map((genre) => {
								return (
									<Picker.Item
										key={genre.value}
										value={genre.value}
										label={genre.label}
									/>
								);
							})}
						</Picker>
						<Text style={styles.text}>Sort By:</Text>
						<Picker
							selectedValue={sortByValue}
							onChange={(itemValue) => setSortByValue(itemValue.target.value)}
						>
							{sort.map((sortBy) => {
								return (
									<Picker.Item
										key={sortBy.value}
										value={sortBy.value}
										label={sortBy.label}
									/>
								);
							})}
						</Picker>

						<Pressable style={[styles.button]} onPress={filter}>
							<Text>Apply</Text>
						</Pressable>
					</View>
				</Modal>
			</View>
		</>
	);
};
const styles = StyleSheet.create({
	container: {
		borderColor: "red",
		borderWidth: 3,
		borderStyle: "solid",
		flex: 1,
		paddingTop: 40,
		justifyContent: "center",
		alignItems: "center",
	},
	text: {
		marginBottom: 20,
		marginTop: 20,
		fontSize: 20,
		fontWeight: "700",
	},
	button: {
		borderRadius: 20,
		padding: 10,
		elevation: 2,
	},
});
export default DrawerNavigation;
