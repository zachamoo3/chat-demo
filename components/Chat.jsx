// components/Chat.jsx

// import components
import { addDoc, collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';

const Chat = ({ route, navigation, db }) => {
	// importing values from Start.jsx
	const { userID, name, color } = route.params;

	// state
	const [messages, setMessages] = useState([]);

	// function to save sent messages to the Firebase
	const onSend = (newMessages) => {
		addDoc(collection(db, 'messages'), newMessages[0]);
	};

	// function to change the color of the chat bubbles
	const renderBubble = (props) => {
		return (
			<Bubble
				{...props}
				wrapperStyle={{
					right: { backgroundColor: color },
					left: { backgroundColor: '#fff' }
				}}
			/>
		);
	};

	// effects established once, when the Chat is initialized
	useEffect(() => {
		// places the name in the header
		navigation.setOptions({ title: name });

		// to fetch messages from the database in real time
		const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
		const unsubMessages = onSnapshot(q, (docs) => {
			let newMessages = [];
			docs.forEach(doc => {
				newMessages.push({
					id: doc.id,
					...doc.data(),
					createdAt: new Date(doc.data().createdAt.toMillis())
				});
			});
			setMessages(newMessages);
		});
		// clean up code
		return () => {
			if (unsubMessages) unsubMessages();
		};
	}, []);

	return (
		<View style={styles.container}>
			<GiftedChat
				messages={messages}
				renderBubble={renderBubble}
				onSend={messages => onSend(messages)}
				user={{ _id: userID, name: name }}
			/>
			{Platform.OS === 'android'
				? <KeyboardAvoidingView behavior='height' />
				: null
			}
		</View>
	);
};

const styles = StyleSheet.create({
	container: { //topmost div container
		flex: 1,
	},
});

export default Chat;
