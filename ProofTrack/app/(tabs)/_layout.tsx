import React, { createContext } from 'react';
import { Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs, useLocalSearchParams } from 'expo-router';
import { User } from '../types';

// Change this username here!
const defaultUser: User = { username: "User", userID: 0, numProjects: 0 };
export const UserContext = createContext(defaultUser);

export default function TabLayout() {
  const user: User = parseUser();

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
 * If it encounters an error parsing the params,
 * an alert pops up and the user is logged out. */
function parseUser(): User {
  const { username, userID, numProjects } = useLocalSearchParams();
  // Ensure the passed parameters are all strings.
  if (typeof(username) !== 'string' || typeof(userID) !== 'string'
                                   || typeof(numProjects) !== 'string') {
    Alert.alert("Unexpected error occured when retrieving your information.");
    // In the future, this may instantly log the user out.
  }
  // Ensure we were able to parse numbers out of userID and numProjects.
  const user_ID: number = parseFloat(userID as string);
  const num_projects: number = parseFloat(numProjects as string);
  if (Number.isNaN(user_ID) || Number.isNaN(num_projects)) {
    Alert.alert("Unexpected error occured when retrieving your information.");
    // In the future, this may instantly log the user out.
  }
  const user: User = {
    username: username as string,
    userID: user_ID,
    numProjects: num_projects,
  }
  return user;
}

  