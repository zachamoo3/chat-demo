// components/Chat.jsx

import { useEffect, useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';

const Chat = ({ route, navigation }) => {
	// state
	const [messages, setMessages] = useState([]);

	// importing values from Start.jsx
	const { name, color } = route.params;

	// function to add new messages to the log of messages
	const onSend = (newMessages) => {
		setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
	};

	// function to change the color of the chat bubbles
	const renderBubble = (props) => {
		return (
			<Bubble
				{...props}
				wrapperStyle={{
					right: { // using the color selected in Start.jsx
						backgroundColor: color,
					},
					left: {
						backgroundColor: '#fff',
					},
				}}
			/>
		);
	};

	// effects established once, upon rendering Chat.jsx
	useEffect(() => {
		navigation.setOptions({ title: name });
		setMessages([
			{
				_id: 1,
				text: 'Hello there.',
				createdAt: new Date(),
				user: {
					_id: 2,
					name: 'React Native',
					avatar: 'https://placeimg.com/140/140/any',
				},
			},
			{
				_id: 2,
				text: 'Welcome to the chat!',
				createdAt: new Date(),
				system: true,
			},
		]);
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
