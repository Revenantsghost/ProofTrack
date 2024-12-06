import React from 'react';
import { Redirect } from 'expo-router';

/* As index.tsx is the default page, this will simply redirect to Login. */
export default function Index() {
  return <Redirect href='./login' />
};

