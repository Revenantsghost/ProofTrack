import React, { useState } from 'react';
import { router } from 'expo-router';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';

/* Renders a login page that users have to login to.
 * (Currently it accepts any input as a login) */
export default function Login() {
  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (userID && password) {
      fetch('http://13.64.145.249:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userID,
          password: password,
        }),
      })
        .then((response) => {
          console.log('Response:', response);
          if (!response.ok) {
            return response.text().then((text) => {
              throw new Error(text || 'An error occurred');
            });
          }
          return response.json();
        })
        .then((data) => {
          // Successful login, show success alert and navigate
          console.log('Login Success:', data);
          Alert.alert('Login Successful', `Welcome, ${userID}!`, [
            {
              text: 'OK', 
              onPress: () => {
                const username = userID;
                const numProjects = 4;
  
                // Proceed with navigation after alert dismissal
                router.replace(`./(tabs)/?username=${username}&userID=${12345}&numProjects=${numProjects}`);
              },
            },
          ]);
        })
        .catch((error) => {
          // Display error alert
          console.log('Error:', error);
          Alert.alert('Error', error.message || 'An unexpected error occurred.');
        });

      // // Right now I've switched the username and userID params for demonstration.
      // // In actuality, you'll enter your userID in the first text bar, not your username.
      // // THIS MUST BE FIXED ONCE WE FETCH DATA PROPERLY!!

      // router.replace(`./(tabs)/?username=${username}&userID=${12345}&numProjects=${numProjects}`);
      // // The commented-out line is the one that will behave correctly.
      // //router.replace(`./(tabs)/?username=${username}&userID=${userID}&numProjects=${numProjects}`);
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

      <Pressable style={styles.button} onPress={() => {handleLogin()}}>
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
    backgroundColor: '#4A90E2',
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