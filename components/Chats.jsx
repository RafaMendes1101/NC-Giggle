import React, { useEffect, useRef } from "react";
import {
	TextInput,
	Button,
	View,
	Text,
	ScrollView,
	StatusBar,
	StyleSheet,
	KeyboardAvoidingView,
	Platform,
	Keyboard,
	TouchableWithoutFeedback,
	Image,
} from "react-native";
import saveMessage from "../firebase-sw-messaging";
import { getAuth } from "firebase/auth";
import {
	query,
	docChanges,
	onSnapshot,
	collection,
	deleteMessage,
	getFirestore,
	doc,
	getDoc,
	data,
} from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Chats(props) {
	// get auth object for current logged in user
	const auth = getAuth();

	const [message, setMessage] = React.useState("");
	const [messageList, setMessageList] = React.useState([]);

	const input = useRef(null);
	const scrollView = useRef(null);
	useEffect(() => {
		// Loads chat messages history and listens for upcoming ones.

		// Create the query to load the messages from the Firestore
		const chatRef = collection(getFirestore(), "chats");
		const chatSnap = doc(getFirestore(), "chats", props.route.params.id);
		const recentMessagesQuery = query(chatSnap);

		// Start listening to the query.
		onSnapshot(recentMessagesQuery, function (snapshot) {
			setMessageList(() => [...snapshot.data().messages]);
		});
	}, [props.route.params.id]);

	return (
		<KeyboardAvoidingView
			style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}
			behavior="padding"
			enabled
			keyboardVerticalOffset={100}
		>
			<View style={styles.container}>
				<ScrollView
					ref={scrollView}
					onContentSizeChange={() => {
						scrollView.current.scrollToEnd({ animated: true });
					}}
				>
					{messageList.map((message, key) => {
						const isMe = message.user === auth.currentUser.uid;
						const date = new Date(message.timestamp.seconds * 1000);
						return (
							<>
								<Text
									style={isMe ? styles.fromMeDisplayName : styles.fromThemDisplayName}
								>
									{message.displayName}
								</Text>
								<View
									style={
										isMe ? styles.fromMeMessageAndAvatar : styles.fromThemMessageAndAvatar
									}
									key={message + key.toString()}
								>
									<Text
										style={isMe ? styles.fromMe : styles.fromThem}
									>{`${message.message}`}</Text>
									<Image
										source={{ uri: message.photoURL }}
										style={isMe ? styles.fromMe : styles.fromThem}
									/>
								</View>
								<Text style={styles.timestamp}>{date.toString().slice(0, 21)}</Text>
							</>
						);
					})}
				</ScrollView>
				<View style={styles.messageAndSend}>
					<TextInput
						placeholder="message"
						style={styles.messageInput}
						ref={input}
						onChangeText={(text) => {
							setMessage(text);
						}}
					/>
					<Button
						title="Send"
						onPress={() => {
							input.current.clear();
							saveMessage(message, props.route.params.id);
						}}
					/>
				</View>
			</View>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	fromMe: {
		alignSelf: "flex-end",
		margin: 5,
		padding: 10,
		borderRadius: 30,
		backgroundColor: "#00BCD4",
		color: "#fff",
	},
	fromMeDisplayName: {
		alignSelf: "flex-end",
		marginRight: 40,
		padding: 2,
		borderRadius: 30,
		fontSize: 10,
	},
	fromThem: {
		alignSelf: "flex-start",
		margin: 5,
		padding: 10,
		borderRadius: 30,
		backgroundColor: "#E0E0E0",
	},
	fromThemDisplayName: {
		alignSelf: "flex-start",
		marginLeft: 40,
		padding: 2,
		borderRadius: 30,
		fontSize: 10,
	},
	container: {
		flex: 1,
	},
	messageInput: {
		height: 40,
		borderColor: "gray",
		borderWidth: 1,
		margin: 5,
		padding: 5,
		borderRadius: 30,
		flexGrow: 1,
	},
	messageAndSend: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		margin: 10,
		marginBottom: 20,
	},
	fromMeMessageAndAvatar: {
		alignSelf: "flex-end",
		flexDirection: "row",
		alignItems: "baseline",
	},
	fromThemMessageAndAvatar: {
		alignSelf: "flex-start",
		flexDirection: "row-reverse",
		alignItems: "baseline",
	},
	timestamp: {
		alignSelf: "center",
		fontSize: 10,
		color: "grey",
	},
});
