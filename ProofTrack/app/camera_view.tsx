import { useContext, useState, useEffect, useRef } from "react";
import * as React from 'react';
import { Button, StyleSheet, Text, View } from "react-native";
import { UserContext } from './(tabs)/_layout';
import { User } from './types';
import { Camera, CameraMode, CameraType, CameraView, FlashMode, useCameraPermissions } from "expo-camera";
import { GestureHandlerRootView, TouchableOpacity } from "react-native-gesture-handler";
import CameraActions from "@/components/CameraActions";
import PictureView from "@/components/PictureView";
import Animated, { FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import CameraTools from "@/components/CameraTools";

// This is the page that displays the camera, ready for the user to take the photo
// also displays all of the camera tools

export default function UploadMedia() {
  const user: User = useContext(UserContext);
  const [permission, requestPermission] = useCameraPermissions();
  const [image, setImage] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false); // To check if camera is ready
  const [picture, setPicture] = React.useState<string>(""); 

  const [cameraMode, setCameraMode] = React.useState<CameraMode>("picture");
  const [cameraZoom, setCameraZoom] = React.useState<number>(0);
  const [cameraTorch, setCameraTorch] = React.useState<boolean>(false);
  const [cameraFlash, setCameraFlash] = React.useState<FlashMode>("off");
  const [cameraFacing, setCameraFacing] = React.useState<"front" | "back">(
    "back"
  );
  
  const cameraRef = React.useRef<CameraView>(null);

  async function handleTakePicture() {
    const response = await cameraRef.current?.takePictureAsync({})
    console.log(response?.uri);
    setPicture(response!.uri);
  };

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }
  if (picture) return <PictureView picture={picture} setPicture={setPicture} />;

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <GestureHandlerRootView>
        <View style={styles.container}>
          <Text style={styles.message}>We need your permission to show the camera</Text>
          <Button onPress={requestPermission} title="Grant Permission" />
        </View>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView>
      <Animated.View
        layout={LinearTransition}
        entering={FadeIn.duration(1000)}
        exiting={FadeOut.duration(1000)}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <CameraView 
            ref={cameraRef}
            style={{ flex: 1 }}
            facing={cameraFacing}
            mode={cameraMode}
            zoom={cameraZoom}
            enableTorch={cameraTorch}
            flash={cameraFlash}
            onCameraReady={() => console.log("camera is ready")}
          >
            <SafeAreaView style={{ flex: 1, paddingTop: 40 }}>
              <View style={{ flex: 1, padding: 6 }}>
                <CameraTools
                  cameraZoom={cameraZoom}
                  cameraFlash={cameraFlash}
                  cameraTorch={cameraTorch}
                  setCameraZoom={setCameraZoom}
                  setCameraFacing={setCameraFacing}
                  setCameraTorch={setCameraTorch}
                  setCameraFlash={setCameraFlash}
                />
                <CameraActions 
                  cameraMode={cameraMode} 
                  handleTakePicture={handleTakePicture}
                  isRecording={false}
                />
              </View>

            </SafeAreaView>

          </CameraView>
        </View>
      </Animated.View>
    </GestureHandlerRootView>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
});