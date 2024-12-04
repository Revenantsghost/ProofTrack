import React, { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, TextInput, Pressable } from 'react-native';
import { StyleSheet, Alert } from 'react-native';
import { getServer } from './constants';

/* The link to access our server. */
const SERVER: string = getServer();

/* Renders a "Change Password" page. */
export default function ChangePassword() {
  /* Parse username from the expo router. */
  var { username } = useLocalSearchParams();
  const usernameStr: string = (typeof(username) === 'string') ? (username) : ('');
  /* The new user's password entered when creating an account. */
  const [password, setPassword] = useState('');
  /* Password and PasswordConfirm MUST be equal. */
  const [passwordConfirm, setPasswordConfirm] = useState('');

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

      <Pressable
        style={styles.button}
        onPress={() => {handleChange(usernameStr, password, passwordConfirm)}}
      >
        <Text style={styles.buttonText}>Change Password</Text>
      </Pressable>
    </View>
  );
};

/* Attempts to send a new user to the database.
 * Returns false and throws error if username doesn't exist (which is an internal issue).
 * Also returns false and throws error if server error encountered.
 * Returns true if no issues encountered. */
async function handleChange(username: string, password: string, passwordConfirm: string) {
  if (!username) {
    /* This case should NEVER happen. */
    Alert.alert('Internal error encountered.', 'Please try again later.');
    return;
  } else if (!password) {
    /* Make sure user entered their password. */
    Alert.alert('Error', 'Please enter new password.');
    return;
  } else if (!passwordConfirm) {
    /* Make sure user confirmed their password. */
    Alert.alert('Error', 'Please confirm new password.');
    return;
  } else if (password !== passwordConfirm) {
    /* Make sure "Password" and "Confirm Password" match. */
    Alert.alert('Error', 'New passwords do not match.');
    return;
  }

  /* Change password for user in the database.
   * Handles case of username not being found (a major internal error). */
  const changeAttempt: boolean = await newPassword(username, password);
  if (changeAttempt) {
    /* Success! */
    Alert.alert('Success!', 'Password successfully changed.');
    /* Take the user back to their profile page. */
    router.back();
  }
}

async function newPassword(user_name: string, password: string): Promise<boolean> {
  try {
    // Fix to correct route and method type!!
    const response: Response = await fetch(SERVER + '/nonsense_route', {
      method: 'DO NOT KNOW',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user_name: user_name, password: password })
    });
    // Fix to correct response status!!
    if (response.status === 409) {
      /* A status of XXX means this username doesn't exist.
       * As user has already created an account, this is an error on our end. */
      Alert.alert('Error', 'We\'re having trouble accessing your information.');
      throw new Error('Internal error');
    } else if (!response.ok) {
      /* A server error is most definitely an internal error.
       * Throw the error and let the catch block handle it. */
      throw new Error('Server error');
    } else {
      console.log("OK");
    }
  } catch(error) {
    /* Log the error and THEN return false. */
    console.error('Error setting password:', error);
    Alert.alert('Error setting password.', 'Please try again later.');
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