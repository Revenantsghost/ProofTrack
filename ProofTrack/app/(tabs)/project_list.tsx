import React, { useContext } from 'react';
import { Text, View } from 'react-native';
import { UserContext } from './_layout';
import { User } from '../types';

export default function ProjectList() {
  const user: User = useContext(UserContext);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>This is where you'll view your projects, {user.username}.</Text>
    </View>
  );
}