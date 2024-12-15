import React, { useState } from 'react';
import { router } from 'expo-router';
import { View, Text, TextInput } from 'react-native';
import { StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { getServer } from './constants'

const SERVER: string = getServer();

/* Renders a login page that users have to login to. */
export default function Login() {
  /* The username that's entered during a login attempt. */
  const [username, setUsername] = useState<string>('');
  /* The password that's entered during a login attempt. */
  const [password, setPassword] = useState<string>('');
  /* If there's a problem, these states will be non-empty. */
  const [usernameFieldText, setUsernameFieldText] = useState<string>('');
  const [passwordFieldText, setPasswordFieldText] = useState<string>('');

  const handleLogin = async () => {
    var attempt: LoginAttempt | undefined = {
      usernameEntered: true,
      passwordEntered: true,
      loginValid: true,
      successful: true,
    };

    attempt = await handleLoginFrontend(username, password, attempt);
    /* Only check the backend if the frontend input is properly formed. */
    if (attempt.usernameEntered && attempt.passwordEntered) {
      attempt = await handleLoginBackend(username, password, attempt);
    }

    if (!attempt) {
      Alert.alert('Internal error encountered.', 'Please try again later.');
      return;
    }

    /* Reset them briefly. */
    setUsernameFieldText('');
    setPasswordFieldText('');

    if (attempt.successful) {
      /* A friendly welcome message! */
      Alert.alert('Login Successful', `Welcome back, ${username}!`);
      router.replace(`./(tabs)/?username=${username}`);
    }

    if (!attempt.usernameEntered) {
      setUsernameFieldText("Please enter your username.");
    }

    if (!attempt.passwordEntered) {
      setPasswordFieldText("Please enter your password.");
    }

    if (!attempt.loginValid) {
      setUsernameFieldText("Invalid username or password.");
      setPasswordFieldText("Invalid username or password.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

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

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>     

      <TouchableOpacity onPress={() => {router.replace('./create_account')}}>
        <Text style={styles.linkText}>{'New user? Create account'}</Text>
      </TouchableOpacity>
    </View>
  );
};

/* A biggol interface to evaluate the login attempt. */
interface LoginAttempt {
  /* True iff the username field is non-empty. */
  usernameEntered: boolean,
  /* True iff the password field is non-empty. */
  passwordEntered: boolean,
  /* True iff account found for entered username and password. */
  loginValid: boolean,
  /* True iff the account creation was successful (all other fields true). */
  successful: boolean,
}

/* Evaluates a user's attempt to login on the front-end.
 * Returns a LoginAttempt record type as an evaluation. */
async function handleLoginFrontend(username: string,
                                   password: string,
                                   attempt: LoginAttempt): Promise<LoginAttempt> {
  if (!username) {
    /* Make sure user entered their username. */
    attempt.usernameEntered = false;
    attempt.successful = false;
  }

  if (!password) {
    /* Make sure user entered their password. */
    attempt.passwordEntered = false;
    attempt.successful = false;
  }
  return attempt;
}

/* Evaluates a user's attempt to login on the back-end.
 * Upon server/internal error, returns undefined.
 * Otherwise, returns a LoginAttempt record type as an evaluation. */
async function handleLoginBackend(username: string,
                                  password: string,
                                  attempt: LoginAttempt): Promise<LoginAttempt | undefined> {
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
      /* A status of 404 means the username or password weren't found. */
      attempt.loginValid = false;
      attempt.successful = false;
    } else if (!response.ok) {
      /* Either a server error or internal error.
       * Throw the error and let the catch block handle it. */
      throw new Error('Server error');
    } else {
      console.log("Login OK.");
    }
  } catch (error) {
    /* Log the error and THEN return undefined. */
    console.error('Internal error encountered:', error);
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