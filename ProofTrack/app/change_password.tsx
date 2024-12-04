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
  /* The user's current password. */
  const [currPassword, setCurrPassword] = useState('');
  /* The user's target new password. */
  const [newPassword, setNewPassword] = useState('');
  /* NewPassword and NewPasswordConfirm MUST be equal. */
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change Password</Text>
      <Text style={{fontSize: 18, textAlign: "left" }}>Current Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Current Password"
        value={currPassword}
        onChangeText={setCurrPassword}
        secureTextEntry
      />
      <Text style={{fontSize: 18, textAlign: "left" }}>New Password</Text>
      <TextInput
        style={styles.input}
        placeholder="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />
      <Text style={{fontSize: 18, textAlign: "left" }}>Confirm New Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        value={newPasswordConfirm}
        onChangeText={setNewPasswordConfirm}
        secureTextEntry
      />

      <Pressable
        style={styles.button}
        onPress={() => {handleChange(usernameStr, currPassword, newPassword, newPasswordConfirm)}}
      >
        <Text style={styles.buttonText}>Change Password</Text>
      </Pressable>
    </View>
  );
};

/* Attempts to send a new user to the database.
 * Returns false if username doesn't exist (which is an internal issue).
 * Also returns false and throws error if server error encountered.
 * Returns true if no issues encountered. */
async function handleChange(username: string, currPassword: string,
                            newPassword: string, newPasswordConfirm: string) {
  if (!username) {
    /* This case should NEVER happen. */
    Alert.alert('Internal error encountered.', 'Please try again later.');
    return;
  } else if (!currPassword) {
    /* Make sure user entered their password. */
    Alert.alert('Error', 'Please enter new password.');
    return;
  } else if (!newPassword) {
    /* Make sure user entered their password. */
    Alert.alert('Error', 'Please enter new password.');
    return;
  } else if (!newPasswordConfirm) {
    /* Make sure user confirmed their password. */
    Alert.alert('Error', 'Please confirm new password.');
    return;
  } else if (newPassword !== newPasswordConfirm) {
    /* Make sure "Password" and "Confirm Password" match. */
    Alert.alert('Error', 'New passwords do not match.');
    return;
  }

  /* Change password for user in the database.
   * Handles case of username not being found (a major internal error). */
  const changeAttempt: boolean = await editPassword(username, currPassword, newPassword);
  if (changeAttempt) {
    /* Success! */
    Alert.alert('Success!', 'Password successfully changed.');
    /* Take the user back to their profile page. */
    router.back();
  }
}

async function editPassword(user_name: string, old_password: string,
                            new_password: string): Promise<boolean> {
  try {
    // Fix to correct route and method type!!
    const route: string = '/changePassword';
    const response: Response = await fetch(`${SERVER}/${route}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_name: user_name,
        new_password: new_password,
        old_password: old_password,
      })
    });
    // Fix to correct response status!!
    const no_username_status: number = 404;
    const wrong_password_status: number = 401;
    if (response.status == wrong_password_status) {
      /* The user didn't input their correct password right.
       * Not an internal error, so just return false. */
      Alert.alert('Error', 'Your current password is incorrect.');
      return false;
    } else if (response.status === no_username_status) {
      console.log(user_name);
      /* A status of XXX means this username doesn't exist.
       * As user has already created an account, this is an internal error.
       * Not a server error, so don't throw an error. */
      Alert.alert('Error', 'We\'re having trouble accessing your information.');
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