import React, { useState } from 'react';
import { router } from 'expo-router';
import { View, Text, TextInput, Pressable } from 'react-native';
import { StyleSheet, Alert, Button } from 'react-native';

/* Renders a "Create Account" page. */
export default function CreateAccount() {
  const [username, setUsername] = useState('');
  const [userID, setUserID] = useState('');
  /* Password and PasswordConfirm MUST be equal. */
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const handleCreation = () => {
    // Also include a check if the UserID is available.
    if (password !== passwordConfirm) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    if (username && userID && password) {
      // Perform login action.
      Alert.alert('Account Creation Successful', `Welcome, ${username}!`);
      /* Main idea: Fetch the user's information using their unique ID.
       * Then pass said information to the router as its parameters. */
      // Currently, things are just hardcoded in.

      //const username: string = userID;
      const numProjects: number = 4;

      // Right now I've switched the username and userID params for demonstration.
      // In actuality, you'll enter your userID in the first text bar, not your username.
      // THIS MUST BE FIXED ONCE WE FETCH DATA PROPERLY!!

      router.replace(`./(tabs)/?username=${username}&userID=${userID}&numProjects=${numProjects}`);
      // The commented-out line is the one that will behave correctly.
      //router.replace(`./(tabs)/?username=${username}&userID=${userID}&numProjects=${numProjects}`);
    } else {
      Alert.alert('Error', 'Please enter both email and password.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Your Account</Text>

      <Text style={{fontSize: 20, textAlign: "center" }}>Username</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <Text style={{fontSize: 20, textAlign: "center" }}>User ID</Text>
      <TextInput
        style={styles.input}
        placeholder="User ID"
        value={userID}
        onChangeText={setUserID}
        autoCapitalize="none"
      />
      <Text style={{fontSize: 20, textAlign: "center" }}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Text style={{fontSize: 20, textAlign: "center" }}>Confirm Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={passwordConfirm}
        onChangeText={setPasswordConfirm}
        secureTextEntry
      />

      <Pressable style={styles.button} onPress={() => {handleCreation()}}>
        <Text style={styles.buttonText}>Create Account</Text>
      </Pressable>

      <Button
        onPress={() => {router.replace('./login')}}
        title='Already own an account? Log in!'
      />
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