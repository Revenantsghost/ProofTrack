import { Ionicons } from '@expo/vector-icons';
import React, { useContext } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { UserContext } from './_layout';

export default function Index() {
  /* Grab the user's username. */
  const username: string = useContext(UserContext);
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to ProofTrack, {username}!</Text>

      <TouchableOpacity
        style={styles.roundButton}
        onPress={() => {router.navigate(`../submit_proof?username=${username}`)}}
      >
        <Ionicons name="camera" size={48} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  roundButton: {
    position: 'absolute',
    bottom: 30,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 50,
    backgroundColor: '#4a91e2',
  }
});
