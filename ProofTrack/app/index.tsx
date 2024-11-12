import React, { useState } from 'react';
import { router } from 'expo-router';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import Login from './login';

/* Renders a login page that users have to login to.
 * (Currently it accepts any input as a login) */
export default function index() {
  return <Login/>  
};

