import React, { useState } from 'react';
import { router } from 'expo-router';
import { View, Text, TextInput } from 'react-native';
import { StyleSheet, Alert, TouchableOpacity } from 'react-native';
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
  /* If there's a problem, these states will be non-empty. */
  const [usernameFieldText, setUsernameFieldText] = useState<string>('');
  const [passwordFieldText, setPasswordFieldText] = useState<string>('');
  const [passwordConfirmFieldText, setPasswordConfirmFieldText] = useState<string>('');

  const handleCreation = async () => {
    var attempt: CreationAttempt | undefined = {
      usernameEntered: true,
      usernameAvailable: true,
      passwordEntered: true,
      passwordConfirmEntered: true,
      passwordsMatch: true,
      successful: true,
    };

    attempt = await handleCreationFrontend(username, password, passwordConfirm, attempt);
    /* Only check the backend if the frontend input is properly formed. */
    if (attempt.usernameEntered && attempt.passwordEntered) {
      attempt = await handleCreationBackend(username, password, attempt);
    }

    /* Reset them briefly. */
    setUsernameFieldText('');
    setPasswordFieldText('');
    setPasswordConfirmFieldText('');

    if (!attempt) {
      Alert.alert('Internal error encountered.', 'Please try again later.');
      return;
    }

    if (attempt.successful) {
      /* A friendly welcome message! */
      Alert.alert('Account Creation Successful', `Welcome, ${username}!`);
      /* This takes the new user to the homepage. */
      router.replace(`./(tabs)/?username=${username}`);
    }

    if (!attempt.usernameEntered) {
      setUsernameFieldText("Please enter a username.");
    }

    if (!attempt.passwordEntered) {
      setPasswordFieldText("Please enter a password.");
    }

    if (!attempt.passwordConfirmEntered) {
      setPasswordConfirmFieldText("Please confirm your password.");
    }

    if (!attempt.passwordsMatch && password && passwordConfirm) {
      setPasswordFieldText("Passwords don't match.");
      setPasswordConfirmFieldText("Passwords don't match.");
    }

    if (!attempt.usernameAvailable) {
      setUsernameFieldText("Username not available.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Your Account</Text>

      <Text style={{fontSize: 15, color: "red", textAlign: "left" }}>
        {usernameFieldText}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <Text style={{fontSize: 15, color: "red", textAlign: "left" }}>
        {passwordFieldText}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Text style={{fontSize: 15, color: "red", textAlign: "left" }}>
        {passwordConfirmFieldText}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={passwordConfirm}
        onChangeText={setPasswordConfirm}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleCreation}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => {router.replace('./login')}}>
        <Text style={styles.linkText}>{'Already own an account? Log in'}</Text>
      </TouchableOpacity> 
    </View>
  );
};

/* A biggol interface to evaluate the account creation attempt. */
interface CreationAttempt {
  /* True iff the username field is non-empty. */
  usernameEntered: boolean,
  /* True iff the entered username is available. */
  usernameAvailable: boolean,
  /* True iff the password field is non-empty. */
  passwordEntered: boolean,
  /* True iff the "confirm password" field is non-empty. */
  passwordConfirmEntered: boolean,
  /* True iff the entered passwords match. */
  passwordsMatch: boolean,
  /* True iff the account creation was successful (all other fields true). */
  successful: boolean,
}

/* Evaluates a user's attempt to create an account on the front-end.
 * Returns a CreationAttempt record type as an evaluation. */
async function handleCreationFrontend(username: string,
                                      password: string,
                                      passwordConfirm: string,
                                      attempt: CreationAttempt): Promise<CreationAttempt> {
  if (!username) {
    attempt.usernameEntered = false;
    attempt.successful = false;
  } 
  
  if (!password) {
    attempt.passwordEntered = false;
    attempt.successful = false;
  } 
  
  if (!passwordConfirm) {
    attempt.passwordConfirmEntered = false;
    attempt.successful = false;
  } 
  
  if (password !== passwordConfirm) {
    attempt.passwordsMatch = false;
    attempt.successful = false;
  }
  return attempt;
}

/* Evaluates a user's attempt to creation an account on the back-end.
 * Upon server/internal error, returns undefined.
 * Otherwise, returns a CreationAttempt record type as an evaluation. */
async function handleCreationBackend(user_name: string,
                                     password: string,
                                     attempt: CreationAttempt): Promise<CreationAttempt | undefined> {
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
      /* A status of 409 means the username was already taken. */
      attempt.usernameAvailable = false;
      attempt.successful = false;
    } else if (!response.ok) {
      /* Either a server error or internal error.
       * Throw the error and let the catch block handle it. */
      throw new Error('Server error');
    } else {
      console.log("Account creation OK.");
    }
  } catch(error) {
    /* Log the error and THEN return undefined. */
    console.error('Error fetching profile:', error);
    return undefined;
  }
  return attempt;
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
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
  },
  linkText: {
    top: 10,
    fontSize: 18,
    color: "blue",
    textAlign: "center"
  },
});