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

	// effects established once, upon rendering Chat.jsx
	useEffect(() => {
		navigation.setOptions({ title: name });
		// setMessages([
		// 	{
		// 		_id: 1,
		// 		text: 'Hello there.',
		// 		createdAt: new Date(),
		// 		user: {
		// 			_id: 2,
		// 			name: 'React Native',
		// 			avatar: 'https://placeimg.com/140/140/any',
		// 		},
		// 	},
		// 	{
		// 		_id: 2,
		// 		text: 'Welcome to the chat!',
		// 		createdAt: new Date(),
		// 		system: true,
		// 	},
		// ]);
	}, []);

	return (
		<View style={styles.container}>
			<GiftedChat
				messages={messages}
				renderBubble={renderBubble}
				onSend={messages => onSend(messages)}
				user={{ _id: 1 }}
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
