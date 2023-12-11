// root/components/CustomActions.jsx

// import components
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const CustomActions = ({ wrapperStyle, iconTextStyle, onSend, storage, userID }) => {
  // enables the use of the action sheet that allows user to see options
  const actionSheet = useActionSheet();

  // function that defines what happens when the user presses the "CustomAction" component
  const onActionPress = () => {
    // list of action options
    const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
    const cancelButtonIndex = options.length - 1;

    // defines which option functionally does
    actionSheet.showActionSheetWithOptions(
      { options, cancelButtonIndex },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0: // "Choose From Library"
            pickImage();
            return;
          case 1: // "Take Picture"
            takePhoto();
            return;
          case 2: // "Send Location"
            getLocation();
          default: // "Cancel"
        };
      },
    );
  };

  // function to give each reference a unique reference string
  const generateReference = (uri) => {
    const timeStamp = (new Date()).getTime();
    const imageName = uri.split('/')[uri.split('/').length - 1];
    return `${userID}-${timeStamp}-${imageName}`;
  };

  // function to upload selected or taken image to Firebase Storage and then send it as a message
  const uploadAndSendImage = async (imageURI) => {
    const uniqueRefString = generateReference(imageURI);
    const newUploadRef = ref(storage, uniqueRefString);
    const response = await fetch(imageURI);
    const blob = await response.blob();
    uploadBytes(newUploadRef, blob).then(async (snapshot) => {
      const imageURL = await getDownloadURL(snapshot.ref);
      onSend({ image: imageURL });
    });
  };

  // function to allow a user to select an image from their media library to send as a message
  const pickImage = async () => {
    let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissions?.granted) {
      let result = await ImagePicker.launchImageLibraryAsync();
      if (!result.canceled) {
        uploadAndSendImage(result.assets[0].uri);
      } else Alert.alert('Error occurred while fetching image');
    } else Alert.alert('Permissions have not been granted');
  };

  // function to allow a user to take a new photo to send as a message
  const takePhoto = async () => {
    let permissions = await ImagePicker.requestCameraPermissionsAsync();
    if (permissions?.granted) {
      let result = await ImagePicker.launchCameraAsync();
      if (!result.canceled) {
        uploadAndSendImage(result.assets[0].uri);
      } else Alert.alert('Error occurred while taking photo');
    } else Alert.alert('Permissions have not been granted');
  };

  // function to allow a user to send their location as a message
  const getLocation = async () => {
    let permissions = await Location.requestForegroundPermissionsAsync();
    if (permissions?.granted) {
      const location = await Location.getCurrentPositionAsync({});
      if (location) {
        onSend({
          location: {
            longitude: location.coords.longitude,
            latitude: location.coords.latitude,
          },
        });
      } else Alert.alert('Error occurred while fetching location');
    } else Alert.alert('Permissions have not been granted');
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onActionPress}>
      <View style={[styles.wrapper, wrapperStyle]}>
        <Text style={[styles.iconText, iconTextStyle]}>
          +
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { // TouchableOpacity that the user can interact with
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: { // the View that makes up the circle
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: { // the Text that is inside the circle: +
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 10,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

export default CustomActions;
