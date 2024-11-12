import React, { useEffect } from 'react';
import { View, StyleSheet, Pressable, Alert } from 'react-native';
import { Image } from 'expo-image';
import ImageViewer from "@/components/ImageViewer";
import Button from '@/components/Button';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { router } from 'expo-router';
import PictureView from '@/components/PictureView';

// This is the page that shows the default or uploaded picture
// It gives users the option to either choose a photo or take a new photo
// also contains the submit button for proof submission

const PlaceholderImage = require('@/assets/images/no_items_selected_image.png');

export interface MediaOptionsRouteParams {
    selectedImage?: string; // selectedImage is optional, as it might not always be passed
}

export default function media_options() {
    const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);


    const pickImageAsync = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
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
            Alert.alert("Success", "Photo submitted successfully!");
            router.navigate('/');
          }
    };

    return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} />
        </View>
        <View style={styles.footerContainer}>
          <Button theme="primary" label="Choose a photo" onPress={pickImageAsync} />
          <Button theme="secondary" label="Take a photo" onPress={takePictureAsync} />
          <Button label="Submit" onPress={onSubmit} />
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
      bottom: 70,
      position: 'absolute',
  },
});