import React, { useEffect } from 'react';
import { View, StyleSheet, Pressable, Alert, Button } from 'react-native';
import { Image } from 'expo-image';
import ImageViewer from "@/components/ImageViewer";
/* This different usage of button broke things. */
// import Button from '@/components/Button';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { router, useLocalSearchParams, Redirect } from 'expo-router';
import PictureView from '@/components/PictureView';

// This is the page that shows the default or uploaded picture
// It gives users the option to either choose a photo or take a new photo
// also contains the submit button for proof submission

const PlaceholderImage = require('@/assets/images/no_items_selected_image.png');

export interface MediaOptionsRouteParams {
    selectedImage?: string; // selectedImage is optional, as it might not always be passed
}

export default function media_options() {
    const { username, projID } = useLocalSearchParams();
    if (typeof(username) !== 'string' || typeof(projID) !== 'string') {
      Alert.alert('Internal error encountered.', 'Unable to parse your information.');
      /* The user's username and/or the project ID couldn't be parsed properly.
       * This means something's wrong with useLocalSearchParams.
       * This is not expected to happen, but signal an error by logging the user out. */
      return <Redirect href='../login' />
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

    const onSubmit = () => {
      if (!selectedImage) {
        Alert.alert("Error", "Please choose or take a photo before submitting.");
      } else {
        const project_id_number: string = projID;
        const user_name: string = username;
        const image_as_string: string = selectedImage;
            
        /*** This is where to include the image-sending login. ***/

        Alert.alert("Success", "Photo submitted successfully!");
        /* Right now, it's set to router.back().
         * If we do router.navigate, it causes an error because currently
         * _layout.tsx requires params in router.navigate().
         * This can be changed back to navigate if local params are provided. */
        router.back();
      }
    };

    return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} />
        </View>
        <View style={styles.footerContainer}>
          <View style={{bottom: 110, position: "absolute"}}>
            <Button title="Choose a photo" onPress={pickImageAsync} />
          </View>
          <View style={{bottom: 70, position: "absolute"}}>
            <Button title="Take a photo" onPress={takePictureAsync} />
          </View>
          <View style={{bottom: 30, position: "absolute"}}>
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
  footerContainer: {
      flex: 1 / 3,
      alignItems: 'center',
      paddingTop: 20,
      bottom: 0,
      position: 'absolute',
  },
});