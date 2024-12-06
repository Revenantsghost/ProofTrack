import React, { useState } from 'react';
import { router } from 'expo-router';
import { View, Text, TextInput, Pressable } from 'react-native';
import { StyleSheet, Alert, Button } from 'react-native';
import { User } from './types'
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

/* Handles a new user's attempt to create an account.
 * If successful, creates information on new user and sends them to main app.
 * If unsuccessful, alerts the User of the problem and benignly returns.
 * Unsuccessful if:
 * * Username already taken.
 * * Not all fields entered.
 * * Passwords don't match. */
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
   * Handles the case of incorrect username/password. */
  const user: User | undefined = await attemptLogin(username, password);
  if (user !== undefined) {
    /* A friendly welcome message! */
    Alert.alert('Login Successful', `Welcome back, ${user.username}!`);
    router.replace(`./(tabs)/?username=${user.username}&numProjects=${user.numProjects}`);
  }
}

/* Attempts to log the user in.
 * Upon success, constructs a User record type and returns it.
 * If user inputs incorrect username/password, returns undefined.
 * Throws an error (and then returns undefined) if server error encountered. */
async function attemptLogin(username: string, password: string): Promise<User | undefined> {
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
    const login_failed_status: number = 404;
    if (response.status == login_failed_status) {
      /* Invalid username/password status.
       * Not an error, but still return undefined. */
      Alert.alert('Login failed.', 'Incorrect username or password.');
      return undefined;
    } else if (!response.ok) {
      /* Server error!
       * Throw the error and let the catch block handle it. */
      throw new Error('Server error');
    }
    console.log("Login attempt OK.");
    const jsonData: any = await response.json();
    console.log(`User's JSON data: ${JSON.stringify(jsonData)}`);
    const num_projects: number = jsonData.num_of_projects;
    if (num_projects === undefined) {
      /* This means the JSON didn't have the expected field!
       * Internal error, so throw an error. */
      throw new Error('Parsing error');
    }
    console.log("Parsing user attempt OK.");
    const user: User = { username: username, numProjects: num_projects }
    return user;
  } catch (error) {
    /* Log the error and THEN return undefined. */
    console.error('Internal error encountered:', error);
    Alert.alert('Internal error encountered.', 'Please try again later.');
    return undefined;
  }
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