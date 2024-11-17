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
    // Also include a check if the username is available.
    if (password !== passwordConfirm) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    if (username && password) {
      // Create an account.

      /* Main idea: Check the backend if the username already exists.
       * If not, instruct the backend to create a new user entry. */
      Alert.alert('Account Creation Successful', `Welcome, ${username}!`);

      /* Since this is a new account, numProjects will be zero.
       * This takes the user to the homepage. */
      router.replace(`./(tabs)/?username=${username}&numProjects=0`);
    } else {
      Alert.alert('Error', 'Please enter both username and password.');
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