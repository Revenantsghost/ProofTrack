import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View, Pressable, TouchableOpacity, StyleSheet } from "react-native";

import { Link } from 'expo-router';

export default function Index({ userName = "User" }) {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to ProofTrack, {userName}!</Text>

      <Link href="../submit_proof" asChild>
        <TouchableOpacity style={styles.roundButton}>
          <Ionicons name="camera" size={48} color="white" />
        </TouchableOpacity>
      </Link>
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
