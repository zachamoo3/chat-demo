// root/components/Start.jsx

// import components
import { StyleSheet, View, Text, TextInput, ImageBackground, TouchableOpacity, KeyboardAvoidingView, Alert } from 'react-native';
import { useState } from 'react';

// import components for sign in
import { getAuth, signInAnonymously } from 'firebase/auth';

const Start = ({ navigation }) => {
	// states and constants
	const [name, setName] = useState('');
	const [chosenColor, setChosenColor] = useState('#757083');

	// color options
	const colors = ['#090C08', '#474056', '#757083', '#8A95A5', '#B9C6AE'];

	const auth = getAuth();

	// function to allow the user to sign in anonymously
	const signInUser = () => {
		signInAnonymously(auth)
			.then(result => {
				navigation.navigate('Chat', {
					userID: result.user.uid,
					name: name,
					color: chosenColor
				});
				Alert.alert('Signed in Successfully!');
			})
			.catch(error => {
				console.log(error);
				Alert.alert('Unable to sign in. Try again later.');
			});
	};

	return (
		<ImageBackground
			source={require('../assets/background.png')}
			resizeMode='cover'
			style={styles.image}
		>
			<View style={styles.container}>
				<Text style={styles.title}>
					CHAT APP
				</Text>

				<View style={styles.content}>
					<TextInput
						style={styles.input}
						value={name}
						onChangeText={setName}
						placeholder='Your Name'
					/>
					<View style={styles.select}>
						<Text style={styles.selectText}>
							Choose Your Chat Color:
						</Text>
						<View style={styles.selectChoices}>
							{colors.map((color, index) => {
								return (
									<TouchableOpacity
										key={index}
										style={[
											styles.selectColors,
											{ backgroundColor: color },
											chosenColor === color && styles.selected,
										]}
										onPress={() => setChosenColor(color)}
									/>
								)
							})}
						</View>
					</View>
					<TouchableOpacity
						style={styles.button}
						onPress={signInUser}
					>
						<Text style={styles.buttonText}>Start Chatting</Text>
					</TouchableOpacity>
				</View>
			</View>
			{Platform.OS === 'ios'
				? <KeyboardAvoidingView behavior='padding' />
				: null
			}
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	image: { //background image
		flex: 1,
	},
	container: { //container on top of background image
		flex: 1,
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingBottom: 40,
	},
	title: { //object 1 ontop of container
		fontSize: 45,
		fontWeight: '600',
		color: '#FFFFFF',
		marginTop: 70,
	},
	content: { //object 2 ontop of container
		width: '88%',
		height: '44%',
		alignItems: 'center',
		backgroundColor: '#FFFFFF',
		justifyContent: 'space-between',
		borderRadius: 20,
	},
	input: { //textinput div ontop of content
		width: '88%',
		padding: 12,
		borderWidth: 1,
		marginTop: 20,
		marginBottom: 20,
		fontSize: 16,
		fontWeight: '300',
		color: '#757083',
		borderColor: '#757083',
	},
	select: { //select div ontop of content

	},
	selectText: { //text within select
		fontSize: 16,
		fontWeight: '300',
		color: '#757083',
		marginBottom: 10,
	},
	selectChoices: { //choices within select
		flexDirection: 'row'
	},
	selectColors: { //individual colors within choices
		width: 30,
		height: 30,
		margin: 10,
		borderRadius: 15,
	},
	selected: { //selected color
		borderWidth: 1,
		borderColor: 'red',
	},
	button: { //button div ontop of content
		backgroundColor: '#757083',
		width: '88%',
		margin: 20,
		padding: 20,
		alignItems: 'center',
	},
	buttonText: { //text within button
		fontSize: 16,
		fontWeight: '600',
		color: '#FFFFFF',
	}
});

export default Start;
