import React, { useContext } from "react";
import { Text, View } from "react-native";
import { UserContext } from './(tabs)/_layout';
import { User } from './types';

export default function Index() {
  const user: User = useContext(UserContext);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>You'll want to submit proof here, {user.username}.</Text>
    </View>
  );
}