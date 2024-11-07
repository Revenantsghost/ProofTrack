import React, { useState } from 'react';
import { router } from 'expo-router';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { User } from './types';

export default function index() {
  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (userID && password) {
      // Perform login action
      Alert.alert('Login Successful', `Welcome, ${userID}!`);
      /* Main idea: Fetch the user's information using their unique ID.
       * Then pass said information to the router as its parameters. */
      const username: string = userID;
      const numProjects: number = 4;

      // Right now I've switched the username and userID params for demonstration.
      // In actuality, you'll enter your userID in the first text bar, not your username.
      // THIS MUST BE FIXED ONCE WE FETCH DATA PROPERLY!!
      setUserID('');
      setPassword('');
      router.replace(`./(tabs)/?username=${username}&userID=${12345}&numProjects=${numProjects}`);
      // The commented-out line is the one that will behave correctly.
      //router.replace(`./(tabs)/?username=${username}&userID=${userID}&numProjects=${numProjects}`);
    } else {
      Alert.alert('Error', 'Please enter both email and password.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="User ID"
        value={userID}
        onChangeText={setUserID}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

