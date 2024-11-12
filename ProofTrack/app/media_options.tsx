import React from 'react';
import { View, StyleSheet, Pressable, Alert } from 'react-native';
import { Image } from 'expo-image';
import ImageViewer from "@/components/ImageViewer";
import Button from '@/components/Button';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';


const PlaceholderImage = require('@/assets/images/no_items_selected_image.png');

export default function Index() {
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
          <Button theme="secondary" label="Take a photo" />
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
  },
  button: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  item: {
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    borderColor: 'white', // White border color
    borderWidth: 2,       // Width of the border
    paddingVertical: 10,  // Adds padding to make the button box larger
    paddingHorizontal: 20,
    marginTop: 10,        
  },
});