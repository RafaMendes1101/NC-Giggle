import {
	addDoc,
	collection,
	getFirestore,
	serverTimestamp,
	arrayUnion,
	doc,
	setDoc,
	updateDoc,
	Timestamp,
	exists,
	getDoc,
} from "firebase/firestore";
import { getAuth } from "@firebase/auth";
const auth = getAuth();

const db = getFirestore();
// Saves a new message to Cloud Firestore.
async function saveMessage(messageText, id) {
	console.log(auth.currentUser);
	// Add a new message entry to the Firebase database.
	try {
		const chatDocRef = doc(db, "chats", id);
		// const timestamp = serverTimestamp();
		await updateDoc(chatDocRef, {
			messages: arrayUnion({
				message: messageText,
				user: auth.currentUser.uid,
				timestamp: Timestamp.now(),
				displayName: auth.currentUser.displayName,
				photoURL: auth.currentUser.photoURL,
			}),
		});
	} catch (error) {
		console.error("Error writing new message to Firebase Database", error);
	}
}

export const createChatGroup = async (
	chatId,
	eventName,
	eventDate,
	eventVenue,
	eventImage,
	event
) => {
	console.log(event, "firebase");
	const chatDocRef = doc(db, "chats", chatId);
	const docSnap = await getDoc(chatDocRef);
	if (!docSnap.exists()) {
		await setDoc(
			chatDocRef,
			{
				messages: [],
				users: [],
				event: {
					date: eventDate,
					name: eventName,
					venue: eventVenue,
					id: chatId,
					image: eventImage,
				},
			},
			{ merge: true }
		);
	}
};

export const addUserToChatGroup = async (chatId) => {
	const chatDocRef = doc(db, "chats", chatId);
	await updateDoc(chatDocRef, {
		users: arrayUnion(auth.currentUser.uid),
	});

	const userDocRef = doc(db, "users", auth.currentUser.uid);
	await updateDoc(userDocRef, {
		chats: arrayUnion(chatId),
	});
};

export const getChatsForUser = async () => {
	const userDocRef = doc(db, "users", auth.currentUser.uid);
	const docSnap = await getDoc(userDocRef);

	const chatList = docSnap.data().chats.map((chatId) => {
		return getChatDoc(chatId);
	});

	return Promise.all(chatList).then((values) => {
		console.log(values);
		return values;
	});
};

const getChatDoc = async (chatId) => {
	const chatRef = doc(db, "chats", chatId);
	const docSnap = await getDoc(chatRef);
	return docSnap.data().event;
};

export default saveMessage;
