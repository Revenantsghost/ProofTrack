import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function EditUsername() {
  return (
    <View style={{alignItems: "center", top: 50}}>
      <Ionicons name="star" size={64} color="#25292e" />
      <Text style={styles.profileName}>
        Oh, hello there!
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