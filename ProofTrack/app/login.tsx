import React, { useState } from 'react';
import { router } from 'expo-router';
import { View, Text, TextInput, Pressable } from 'react-native';
import { StyleSheet, Alert, Button } from 'react-native';

/* Renders a login page that users have to login to.
 * (Currently it accepts any non-empty input as a successful login) */
export default function Login() {
  /* The username that's entered during a login attempt. */
  const [username, setUsername] = useState('');
  /* The password that's entered during a login attempt. */
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username && password) {
      // Perform login action.

      /* Main idea: Check if the username exists.
       * Then check if the entered password is correct.
       * If successful, THEN fetch the user's numProjects information.
       * Then pass said information to the router as its numProjects parameter.
       * Currently, numProjects is just hardcoded in. */
      const numProjects: number = 4;
      Alert.alert('Login Successful', `Welcome, ${username}!`);

      /* Takes the user to the homepage. */
      router.replace(`./(tabs)/?username=${username}&numProjects=${numProjects}`);
    } else {
      Alert.alert('Error', 'Please enter both email and password.');
    }
  };

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

      <Pressable style={styles.button} onPress={() => {handleLogin()}}>
        <Text style={styles.buttonText}>Log In</Text>
      </Pressable>

      <Button
        onPress={() => {router.replace('./create_account')}}
        title='New user? Create account'
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