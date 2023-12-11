// root/App.js

// import the screens we want to navigate
import Start from './components/Start';
import Chat from './components/Chat';

// import components for navigating
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

// to prevent warnings
import { LogBox } from 'react-native';
LogBox.ignoreLogs([
	'AsyncStorage has been extracted from',
	'Each child in a list should have a unique "key" prop.',
	'@firebase/auth: Auth (10.3.1):'
]);

// import components for Firestore
import { initializeApp } from 'firebase/app';
import { getFirestore, disableNetwork, enableNetwork } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// import components for storage
import { useNetInfo } from '@react-native-community/netinfo';

// import other components
import { useEffect } from 'react';
import { Alert } from 'react-native';

const App = () => {
	// check if there is connection
	const connectionStatus = useNetInfo();
	useEffect(() => {
		if (connectionStatus.isConnected === false) {
			Alert.alert('Connection lost!');
			disableNetwork(db);
		} else if (connectionStatus.isConnected === true) {
			enableNetwork(db);
		}
	}, [connectionStatus.isConnected]);

	// initialize Firebase
	const firebaseConfig = {
		apiKey: "AIzaSyBSXXxcN6MZ9m5c7AQBrRuMRjZlaNa6_lY",
		authDomain: "chat-demo-698a1.firebaseapp.com",
		projectId: "chat-demo-698a1",
		storageBucket: "chat-demo-698a1.appspot.com",
		messagingSenderId: "355869124825",
		appId: "1:355869124825:web:f8f845bbb88ebbecbe76c8"
	};
	const app = initializeApp(firebaseConfig);
	const db = getFirestore(app);
	const storage = getStorage(app);

	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName='Login'>
				<Stack.Screen name='Login' component={Start} />
				<Stack.Screen name='Chat'>
					{props =>
						<Chat
							db={db}
							storage={storage}
							isConnected={connectionStatus.isConnected}
							{...props}
						/>
					}
				</Stack.Screen>
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default App;
