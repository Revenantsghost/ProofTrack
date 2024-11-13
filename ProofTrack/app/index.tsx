import React from 'react';
import Login from './login';
import { Redirect } from 'expo-router';

/* As index.tsx is the default page, this will simply redirect to Login. */
export default function Index() {
  return <Redirect href='./login' />
};

