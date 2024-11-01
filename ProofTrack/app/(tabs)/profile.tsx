import React, {useContext } from 'react';
import { View, Text } from 'react-native';
import { UserContext } from './_layout';
import { User } from '../types';

export default function Profile() {
  const user: User = useContext(UserContext);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>
        Edit your profile, {user.username}?
      </Text>
    </View>
  );
}
