import { Stack } from 'expo-router';
import React from 'react';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#25292e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false, title: "Main" }} />
      <Stack.Screen name="submit_proof" options={{ headerShown: true, title: "Submit Proof" }} />
      <Stack.Screen name="login" options={{headerShown: true, title: "Login" }} />
      <Stack.Screen name="media_options" options={{headerShown: true, title: "Media Options" }} />
      <Stack.Screen name="create_account" options={{headerShown: true, title: "Login"}} />
      <Stack.Screen name="change_password" options={{headerShown: true, title: "Change Password"}} />
    </Stack>
  );
}
