import React from 'react';
import { Redirect, useLocalSearchParams } from 'expo-router';

/* This may seem like a redundant redirect, but this forces the pages to re-mount! */
export default function TabsRedirect() {
  const { username } = useLocalSearchParams();
  return <Redirect href={`./(tabs)/?username=${username}`} />
};
