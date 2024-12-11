import React from "react";
import { View } from "react-native";
import { Image } from 'expo-image';
import { useNavigation } from 'expo-router';
import IconButton from "./IconButton";

// This is the page that displays when a picture is TAKEN:
// it handles displaying the taken photo and having the 
// x mark and checkmark to retake or use the photo

interface PictureViewProps {
    picture: string;
    setPicture: React.Dispatch<React.SetStateAction<string>>
}
export default function PictureView({picture, setPicture}: PictureViewProps) {
    const navigation = useNavigation(); 

    const handleCheckmarkPress = () => {
        // Navigate to the media options page and pass the picture
        // navigation.navigate('media_options', { selectedImage: picture });
    };

    return (
      <View>
        <View
          style={{ position: "absolute", zIndex: 1, paddingTop: 50, left: 15 }}>
          <IconButton
            onPress={() =>setPicture("")}
            iosName={"xmark"}
            androidName="close"
          />
        </View>
        <View
          style={{ position: "absolute", zIndex: 1, paddingTop: 50, right: 15 }}>
          <IconButton
            onPress={handleCheckmarkPress} // fix 
            iosName={"checkmark"}
            androidName="checkmark"
          />
        </View>
        <View>
            <Image source={picture} 
              style={{
                width: '100%',
                height: '100%',
            }}/>
        </View>
      </View>

    );
}
