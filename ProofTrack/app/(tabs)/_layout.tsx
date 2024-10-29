import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';

export default function TabLayout() {
    return (
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
              <Ionicons name={focused ? 'person-sharp' : 'person-outline'} color={color} size={24}/>
            ),
          }}
        />
      </Tabs>
    );
  }
  