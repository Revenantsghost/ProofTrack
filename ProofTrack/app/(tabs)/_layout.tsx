import React, { createContext } from 'react';
import { Redirect } from 'expo-router';
import { Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs, useLocalSearchParams } from 'expo-router';
import { User } from '../types';

// This is a default user, but said context should be overwritten by local search params.
const defaultUser: User = { username: "User", numProjects: 0 };
export const UserContext = createContext(defaultUser);

/* Renders the tab layout of our app.
 * Also handles parsing user data sent here from login page.
 * Redirects back to login if error encountered while parsing. */
export default function TabLayout() {
  const user: User | undefined = parseUser();
  if (user === undefined) {
    Alert.alert("Unexpected error occured when retrieving your information.");
    // This means the user's information couldn't be parsed/fetched properly.
    // Rather than crash the app, we signal an error by logging the user out.
    return <Redirect href='../login' />
  }

  return (
    <UserContext.Provider value={user}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#4A90E2',
          headerStyle: {
            backgroundColor: '#25292e',
          },
          headerShadowVisible: false,
          headerTintColor: '#fff',
          tabBarStyle: {
          backgroundColor: '#25292e',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
            ),
          }}
        />
        <Tabs.Screen
          name="new_project"
          options={{
            title: 'New Project',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'add-sharp' : 'add-outline'} color={color} size={24} />
            ),
          }}
        />
        <Tabs.Screen
          name="project_list"
          options={{
            title: 'Projects',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'list-sharp' : 'list-outline'} color={color} size={24} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'person-sharp' : 'person-outline'} color={color} size={24} />
            ),
          }}
        />
      </Tabs>
    </UserContext.Provider>
  );
}

/* Parses user information given from local search params.
 * Returns a User record type containing said information.
 * Returns undefined if there's an error parsing the params. */
function parseUser(): User | undefined {
  const { username, numProjects } = useLocalSearchParams();
  // Ensure the passed parameters are all strings.
  if (typeof(username) !== 'string' || typeof(numProjects) !== 'string') {
    // Undefined signals an error to the caller.
    return undefined;
  }
  // Ensure we were able to parse number out of numProjects.
  const parsed_projects: number = parseFloat(numProjects as string);
if (Number.isNaN(parsed_projects)) {
    // Undefined signals an error to the caller.
    return undefined;
  }
  const user: User = {
    username: username as string,
    numProjects: parsed_projects,
  }
  return user;
}

  