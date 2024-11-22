import React, { useState } from 'react';
import { router } from 'expo-router';
import { View, Text, TextInput, Pressable } from 'react-native';
import { StyleSheet, Alert, Button } from 'react-native';

/* Renders a "Create Account" page.
 * (Currently it accepts any non-empty input as long as passwords match) */
export default function CreateAccount() {
  /* The new user's unique username entered when creating an account. */
  const [username, setUsername] = useState('');
  /* The new user's password entered when creating an account. */
  const [password, setPassword] = useState('');
  /* Password and PasswordConfirm MUST be equal. */
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const handleCreation = () => {
    if (!(username && password && passwordConfirm)) {
      /* Make sure every field has an entry. */
      Alert.alert('Error', 'Please enter both username and passwords.');
      return;
    } else if (password !== passwordConfirm) {
      /* Make sure "Password" and "Confirm Password" match. */
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    
    /* Attempt to create a user and send to backend.
     * If false, the username was already taken. */
    const sendAttempt: boolean = sendNewUser(username, password);
    if (!sendAttempt) {
      /* Make sure the username wasn't already taken. */
      Alert.alert('Error', 'Username already taken.');
    } else {
      /* A friendly welcome message! */
      Alert.alert('Account Creation Successful', `Welcome, ${username}!`);
      /* Since this is a new account, numProjects will be zero.
       * This takes the user to the homepage. */
      router.replace(`./(tabs)/?username=${username}&numProjects=0`);
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

/* Attempts to send a new user to the database.
 * If username already taken, returns false (recoverable error).
 * Upon encountering an unrecoverable error, throws an error.
 * If no errors, returns true. */
function sendNewUser(user_name: string, password: string): boolean {
  fetch('http://localhost:3000/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ user_name: user_name, password: password })
  })
  .then(response => {
    if (response.status === 409) {

      return false;
    } else if (!response.ok) {
      throw new Error('Server error');
    } else {
      console.log("OK");
    }
  })
  .catch(error => {
    console.error('Error fetching profile:', error); 
  });
  return true;
}

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