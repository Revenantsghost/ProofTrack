import { CameraMode } from "expo-camera";
import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { SymbolView } from 'expo-symbols';

interface CameraActionsProps {
    handleTakePicture: () => void;
    cameraMode: CameraMode;
    isRecording: boolean;
}

export default function CameraActions({
    cameraMode,
    handleTakePicture,
    isRecording
}: CameraActionsProps) {
    return (
        <View style={styles.container}>
          <TouchableOpacity onPress={handleTakePicture}>
            <SymbolView name = {
                cameraMode === "picture"
                ? "circle"
                : isRecording
                ? "record.circle"
                : "circle.circle"
              }
              size={90}
              type="hierarchical"
              tintColor="white"
              animationSpec={{
                effect: {
                    type: isRecording ? "pulse" : "bounce"
                },
                repeating: isRecording
              }}
              
            />
          </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    bottom: -550,
    height: 5,
  },
});