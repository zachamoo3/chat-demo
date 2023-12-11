// root/components/Chat.jsx

// import components
import { addDoc, collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';

const Chat = ({ route, navigation, db, isConnected, storage }) => {
	// importing values from Start.jsx
	const { userID, name, color } = route.params;

	// state
	const [messages, setMessages] = useState([]);

	// define how to load cached messages
	const loadCachedMessages = async () => {
		const cachedMessages = (await AsyncStorage.getItem('messages')) || [];
		setMessages(JSON.parse(cachedMessages));
	}

	// define how to cache messages
	const cacheMessages = async (messagesToCache) => {
		try {
			await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
		} catch (error) {
			console.log(error.message);
		}
	};

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
	let unsubMessages;
	useEffect(() => {
		// places the name in the header
		navigation.setOptions({ title: name });

		if (isConnected === true) { // if the user is connected
			// to fetch messages from the database in real time
			const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
			unsubMessages = onSnapshot(q, (docs) => {
				let newMessages = [];
				docs.forEach(doc => {
					newMessages.push({
						id: doc.id,
						...doc.data(),
						createdAt: new Date(doc.data().createdAt.toMillis())
					});
				});
				cacheMessages(newMessages);
				setMessages(newMessages);
			});
		} else { // else, if the user is disconnected
			loadCachedMessages();
		}

		// clean up code
		return () => {
			if (unsubMessages) unsubMessages();
		};
	}, [isConnected]);

	// disable the input toolbar if the user is not connected
	const renderInputToolbar = (props) => {
		if (isConnected) {
			return <InputToolbar {...props} />
		} else {
			return null
		};
	};

	// to add the "action bubble" to the left of the input toolbar
	const renderCustomActions = (props) => {
		return <CustomActions storage={storage} userID={userID} {...props} />;
	};

	// to change the view of a message bubble if the message is a location
	const renderCustomView = (props) => {
		const { currentMessage } = props;
		if (currentMessage.location) {
			return (
				<MapView
					style={{
						width: 150,
						height: 100,
						borderRadius: 13,
						margin: 3
					}}
					region={{
						latitude: currentMessage.location.latitude,
						longitude: currentMessage.location.longitude,
						latitudeDelta: 0.0922,
						longitudeDelta: 0.0421,
					}}
				/>
			);
		};
	};

	return (
		<View style={styles.container}>
			<GiftedChat
				messages={messages}
				renderBubble={renderBubble}
				renderInputToolbar={renderInputToolbar}
				renderActions={renderCustomActions}
				renderCustomView={renderCustomView}
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
	container: { //topmost View container
		flex: 1,
	},
});

export default Chat;
