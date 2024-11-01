import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { UserContext } from './_layout';
import { User } from '../types';

export default function Index() {
  const user: User = useContext(UserContext);
  return (
    <View style={styles.container}>
      <Text>Care to make a new project, {user.username}?</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  }
});