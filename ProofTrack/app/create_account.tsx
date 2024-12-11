import React, { useState } from 'react';
import { router } from 'expo-router';
import { View, Text, TextInput, Pressable } from 'react-native';
import { StyleSheet, Alert, Button } from 'react-native';
import { getServer } from './constants';

const SERVER: string = getServer();

/* Renders a "Create Account" page.
 * (Currently it accepts any non-empty input as long as passwords match) */
export default function CreateAccount() {
  /* The new user's unique username entered when creating an account. */
  const [username, setUsername] = useState('');
  /* The new user's password entered when creating an account. */
  const [password, setPassword] = useState('');
  /* Password and PasswordConfirm MUST be equal. */
  const [passwordConfirm, setPasswordConfirm] = useState('');

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

      <Pressable
        style={styles.button}
        onPress={() => {handleCreation(username, password, passwordConfirm)}}
      >
        <Text style={styles.buttonText}>Create Account</Text>
      </Pressable>

      <Button
        onPress={() => {router.replace('./login')}}
        title='Already own an account? Log in!'
      />
    </View>
  );
};

/* Handles a new user's attempt to create an account.
 * If successful, creates information on new user and sends them to main app.
 * If unsuccessful, alerts the User of the problem and benignly returns.
 * Unsuccessful if:
 * * Username already taken.
 * * Not all fields entered.
 * * Passwords don't match. */
async function handleCreation(username: string, password: string, passwordConfirm: string) {
  if (!username) {
    /* Make sure user entered their username. */
    Alert.alert('Error', 'Please enter your username.');
    return;
  } else if (!password) {
    /* Make sure user entered their password. */
    Alert.alert('Error', 'Please enter your password.');
    return;
  } else if (!passwordConfirm) {
    /* Make sure user confirmed their password. */
    Alert.alert('Error', 'Please confirm your password.');
    return;
  } else if (password !== passwordConfirm) {
    /* Make sure "Password" and "Confirm Password" match. */
    Alert.alert('Error', 'Passwords do not match.');
    return;
  }
  
  /* Attempt to create a user and send to backend.
   * Handles the case of username already being taken. */
  const sendAttempt: boolean = await sendNewUser(username, password);
  if (sendAttempt) {
    /* A friendly welcome message! */
    Alert.alert('Account Creation Successful', `Welcome, ${username}!`);
    /* This takes the new user to the homepage. */
    router.replace(`./(tabs)/?username=${username}`);
  }
}

/* Attempts to send a new user to the database.
 * Returns false if username already taken.
 * Throws an error (and then returns false) if server error encountered.
 * Returns true if no issues encountered. */
async function sendNewUser(user_name: string, password: string): Promise<boolean> {
  try {
    const route: string = 'register'
    const response: Response = await fetch(`${SERVER}/${route}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user_name: user_name, password: password })
    });
    const taken_status: number = 409;
    if (response.status === taken_status) {
      /* A status of 409 means the username was already taken.
       * As this isn't technically an internal error, just return false. */
      Alert.alert('Error', 'Username already taken.');
      return false;
    } else if (!response.ok) {
      /* A server error is most definitely an internal error.
       * Throw the error and let the catch block handle it. */
      throw new Error('Server error');
    } else {
      console.log("OK");
    }
  } catch(error) {
    /* Log the error and THEN return false. */
    console.error('Error fetching profile:', error);
    Alert.alert('Error setting up profile.', 'Please try again later.');
    return false;
  }
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