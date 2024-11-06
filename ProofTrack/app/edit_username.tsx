import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/* (UNFINISHED) UI allowing user to edit their username.
 * Displays username and allows them to change it. */
export default function EditUsername() {
  return (
    <View style={{alignItems: "center", top: 50}}>
      <Ionicons name="person" size={64} color="#25292e" />
      <Text style={styles.profileName}>
        Unfinished, but this will allow you to edit your username.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    top: 50,
  },
});