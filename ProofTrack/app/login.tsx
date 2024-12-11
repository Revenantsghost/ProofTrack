import React, { useState } from 'react';
import { router } from 'expo-router';
import { View, Text, TextInput, Pressable } from 'react-native';
import { StyleSheet, Alert, Button } from 'react-native';
import { getServer } from './constants'

const SERVER: string = getServer();

/* Renders a login page that users have to login to.
 * (Currently it accepts any non-empty input as a successful login) */
export default function Login() {
  /* The username that's entered during a login attempt. */
  const [username, setUsername] = useState('');
  /* The password that's entered during a login attempt. */
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Pressable
        style={styles.button}
        onPress={() => {handleLogin(username, password)}}
      >
        <Text style={styles.buttonText}>Log In</Text>
      </Pressable>

      <Button
        onPress={() => {router.replace('./create_account')}}
        title='New user? Create account'
      />
    </View>
  );
};

/* Handles a user's attempt to log in.
 * If successful, sends the user to the home page.
 * If unsuccessful, alerts the user of the problem and benignly returns.
 * Unsuccessful if:
 * * Invalid username or password.
 * * Not all fields entered. */
async function handleLogin(username: string, password: string) {
  if (!username) {
    /* Make sure user entered their username. */
    Alert.alert('Error', 'Please enter your username.');
    return;
  } else if (!password) {
    /* Make sure user entered their password. */
    Alert.alert('Error', 'Please enter your password.');
    return;
  }

  /* Attempt to get a record type pertaining to this user.
   * Handles the case of invalid username/password. */
  const loginAttempt: boolean = await attemptLogin(username, password);
  if (loginAttempt) {
    /* A friendly welcome message! */
    Alert.alert('Login Successful', `Welcome back, ${username}!`);
    router.replace(`./(tabs)/?username=${username}`);
  }
}

/* Attempts to log the user in.
 * Returns true upon success.
 * If user inputs invalid username/password, returns false.
 * Throws an error (and then returns false) if server error encountered. */
async function attemptLogin(username: string, password: string): Promise<boolean> {
  const route: string = 'login';
  try {
    const response: Response = await fetch(`${SERVER}/${route}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });
    const invalid_login_status: number = 404;
    if (response.status == invalid_login_status) {
      /* Invalid username/password status.
       * Not an error, but still return false. */
      Alert.alert('Login failed.', 'Invalid username or password.');
      return false;
    } else if (!response.ok) {
      /* Server error!
       * Throw the error and let the catch block handle it. */
      throw new Error('Server error');
    } else {
      console.log("Login OK.");
    }
  } catch (error) {
    /* Log the error and THEN return false. */
    console.error('Internal error encountered:', error);
    Alert.alert('Internal error encountered.', 'Please try again later.');
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