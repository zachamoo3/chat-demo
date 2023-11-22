// App.js

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
	'Each child in a list should have a unique "key" prop.'
]);

// import components for Firestore
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const App = () => {
	const firebaseConfig = {
		apiKey: "AIzaSyBSXXxcN6MZ9m5c7AQBrRuMRjZlaNa6_lY",
		authDomain: "chat-demo-698a1.firebaseapp.com",
		projectId: "chat-demo-698a1",
		storageBucket: "chat-demo-698a1.appspot.com",
		messagingSenderId: "355869124825",
		appId: "1:355869124825:web:f8f845bbb88ebbecbe76c8"
	};
	const app = initializeApp(firebaseConfig); // initialize Firebase
	const db = getFirestore(app); // initialize Cloud Firestore and get a reference to the service

	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName='Login'>
				<Stack.Screen name='Login' component={Start} />
				<Stack.Screen name='Chat'>
					{props => <Chat db={db} {...props} />}
				</Stack.Screen>
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default App;
