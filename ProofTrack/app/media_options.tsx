import React, { useState } from 'react';
import { View, StyleSheet, Alert, Button } from 'react-native';
import { useLocalSearchParams, router, Redirect } from 'expo-router';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';

import { getServer } from './constants'

const SERVER: string = getServer();

const PlaceholderImage = require('@/assets/images/no_items_selected_image.png');

// This is the page that shows the default or uploaded picture
// It gives users the option to either choose a photo or take a new photo
// also contains the submit button for proof submission

export interface MediaOptionsRouteParams {
    selectedImage?: string; // selectedImage is optional, as it might not always be passed
}

export default function MediaOptions() {
  const { username, projID } = useLocalSearchParams();

  if (typeof(username) !== 'string' || typeof(projID) !== 'string') {
    Alert.alert('Internal error encountered.', 'Unable to parse your information.');
    return <Redirect href='../login' />;
  }

  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);

  const pickImageAsync = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    } else {
      alert('You did not select any image.');
    }
  };

  const takePictureAsync = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    } else {
      alert('You did not take a picture.');
    }
  };

  const onSubmit = async () => {
    if (!selectedImage) {
      Alert.alert("Error", "Please choose or take a photo before submitting.");
      return;
    }

    try {
      await submitProof(username, projID, selectedImage);
      // On success, return to the previous screen
      router.back();
    } catch (error) {
      // Error is already handled within submitProof
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={selectedImage ? { uri: selectedImage } : PlaceholderImage}
          style={styles.image}
        />
      </View>
      <View style={styles.footerContainer}>
        <View style={{ bottom: 110, position: "absolute" }}>
          <Button title="Choose a photo" onPress={pickImageAsync} />
        </View>
        <View style={{ bottom: 70, position: "absolute" }}>
          <Button title="Take a photo" onPress={takePictureAsync} />
        </View>
        <View style={{ bottom: 30, position: "absolute" }}>
          <Button title="Submit" onPress={onSubmit} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
    paddingTop: 20,
    bottom: 0,
    position: 'absolute',
  },
});

/**
 * Attempts to submit proof of activity (image) for a specific project.
 * Upon success, alerts success.
 * If submission fails, returns undefined or handles server errors.
 * Throws an error if the server is unavailable or another error is encountered.
 */
async function submitProof(username: string, projID: string, imageData: string): Promise<void | undefined> {
  const route: string = 'submit-proof';
  try {
    // Fetch the image from the URI and create a Blob (or File) object
    const response = await fetch(imageData);
    const blob = await response.blob();

    // Create a FormData object to send the image and other data as multipart/form-data
    const formData = new FormData();

    // Extract the file name from the URI (assuming the image has a file extension)
    const filename = imageData.split('/').pop(); // Get the file name from the URI
    
    // Append the image with the correct file name
    formData.append('file', blob, filename);
    formData.append('mediaType', blob.type);
    formData.append('username', username);
    formData.append('projID', projID);
    
    const serverResponse = await fetch(`${SERVER}/${route}`, {
      method: 'POST',
      body: formData,
    });
    // Check if the response is successful
    if (serverResponse.status === 404) {
      /* This could be a specific case where the user or project isn't found. */
      Alert.alert('Submission failed.', 'Invalid username or project ID.');
      return undefined;
    } else if (!serverResponse.ok) {
      /* If the server fails to process the request, we throw an error. */
      throw new Error('Server error during proof submission.');
    }

    console.log("Proof submission attempt OK.");
    const jsonData: any = await serverResponse.json();
    console.log(`Submission response data: ${JSON.stringify(jsonData)}`);

    const successStatus: boolean = jsonData.success;
    if (successStatus === undefined || !successStatus) {
      /* This means the JSON didn't indicate success properly, so we throw an error. */
      throw new Error('Failed to submit proof.');
    }

    // If everything is okay, alert success.
    Alert.alert("Success", "Proof submitted successfully!");
  } catch (error) {
    /* Log the error and THEN handle it gracefully. */
    console.error('Internal error encountered:', error);
    Alert.alert('Internal error encountered.', 'Please try again later.');
    return undefined;
  }
}