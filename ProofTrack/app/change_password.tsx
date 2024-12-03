import React, { useState } from 'react';
import { router } from 'expo-router';
import { View, Text, TextInput, Pressable } from 'react-native';
import { StyleSheet, Alert } from 'react-native';

/* Renders a "Change Password" page. */
export default function ChangePassword() {
  // Get this from UseLocalSearchParams.
  const username: string = ""
  /* The new user's password entered when creating an account. */
  const [password, setPassword] = useState('');
  /* Password and PasswordConfirm MUST be equal. */
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const handleChange = () => {
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
      Alert.alert('Error', 'Please enter a new password and confirm it.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change Password</Text>
      <Text style={{fontSize: 18, textAlign: "left" }}>New Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Text style={{fontSize: 18, textAlign: "left" }}>Confirm New Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={passwordConfirm}
        onChangeText={setPasswordConfirm}
        secureTextEntry
      />

      <Pressable style={styles.button} onPress={() => {handleChange()}}>
        <Text style={styles.buttonText}>Change Password</Text>
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