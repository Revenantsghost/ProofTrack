import React from "react";
import { ComponentProps } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SFSymbol, SymbolView } from "expo-symbols";
import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";

// IconButton component which allows us to use those symbols that are displayed on the camera:
// ex: the flash button, the flip camera button, etc.

const CONTAINER_PADDING = 5;
const CONTAINER_WIDTH = 34;
const ICON_SIZE = 25;

interface IconButtonProps {
  iosName: SFSymbol;
  androidName: ComponentProps<typeof Ionicons>["name"];
  containerStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
  width?: number;
  height?: number;
}
export default function IconButton({
  onPress,
  androidName,
  iosName,
  containerStyle,
  height,
  width,
}: IconButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.5}
      style={[
        {
          backgroundColor: "#00000050",
          padding: CONTAINER_PADDING,
          borderRadius: (CONTAINER_WIDTH + CONTAINER_PADDING * 2) / 2,
          width: CONTAINER_WIDTH,
        },
        containerStyle,
      ]}
    >
      <SymbolView
        name={iosName}
        size={ICON_SIZE}
        style={
          width && height
            ? {
                width,
                height,
              }
            : {}
        }
        tintColor={"white"}
        fallback={
          <Ionicons
            size={ICON_SIZE}
            name={androidName}
            style={{}}
            color={"white"}
          />
        }
      />
    </TouchableOpacity>
  );
}