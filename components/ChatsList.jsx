import { getChatsForUser } from "../firebase-sw-messaging";
import {
	Text,
	ScrollView,
	View,
	Button,
	StyleSheet,
	Image,
	StatusBar,
} from "react-native";
import React from "react";
import { Link } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChatsList({ navigation }) {
	const [chats, setChats] = React.useState([]);

	React.useEffect(() => {
		getChatsForUser().then((result) => {
			setChats(result);
		});
	}, []);

	return (
		<View style={styles.container}>
			<ScrollView>
				{chats.map((chatroom) => {
					console.log(chatroom);
					const date = new Date(chatroom.date);
					return (
						<View key={chatroom.id} style={styles.facebookCard}>
							<View>
								<Image source={{ uri: chatroom.image }} style={styles.cardImage} />
							</View>
							<View style={styles.eventDetails}>
								<Text style={styles.date}>{date.toUTCString()}</Text>
								<Text style={styles.title}>{chatroom.name}</Text>
								<Text style={styles.venue}>{chatroom.venue}</Text>
								<Text>{chatroom.users}</Text>
							</View>

							<TouchableOpacity
								style={styles.goToChatroomButton}
								onPress={() => {
									navigation.navigate("Chats", {
										id: chatroom.id,
									});
								}}
							>
								<Text style={styles.buttonInner}>Go to Chatroom</Text>
							</TouchableOpacity>
						</View>
					);
				})}
			</ScrollView>
			<StatusBar
				barStyle="dark-content"
				hidden={false}
				backgroundColor="#00BCD4"
				translucent={true}
			/>
		</View>
	);
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	facebookCard: {
		backgroundColor: "black",
		padding: 0,
		margin: 10,
		borderRadius: 10,
		flex: 1,
		opacity: 0.9,
		shadowColor: "#171717",
		shadowOffset: { width: -2, height: 4 },
		shadowOpacity: 0.5,
		shadowRadius: 3,
	},
	cardImage: {
		width: "100%",
		height: 200,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
	},
	goToChatroomButton: {
		padding: 10,
		margin: 15,
		borderRadius: 5,
		backgroundColor: "white",
		flex: 1,
		textAlign: "center",
	},
	buttonInner: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		textAlign: "center",
	},
	eventDetails: {
		flex: 1,
		flexDirection: "column",
		justifyContent: "space-around",
		alignItems: "flex-start",
		paddingLeft: 15,
		paddingRight: 15,
	},
	date: {
		fontSize: 15,
		color: "white",
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		color: "white",
	},
	venue: {
		fontSize: 15,
		fontWeight: "bold",
		color: "grey",
	},
});
