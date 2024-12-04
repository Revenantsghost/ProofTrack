import React, { useContext, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { UserContext } from './_layout';
import { User } from '../types';

/* UI for user's profile page.
 * Displays their username and allows them to change username or password.
 * Also displays some stats, such as number of projects in progress. */
export default function Profile() {
  // Grab the current user's information.
  const user: User = useContext(UserContext);
  const username: string = user.username;
  // Convert their username into its possessive form.
  const theirs: string = appendApostrophe(user.username);
  return (
    <View>
      { /* Positioning for profile icon. */}
      <View style={{ alignItems: "center", top: 30 }}>
        <Ionicons name="person" size={64} color="#25292e" />
      </View>
      { /* User profile header text. */ }
      <View style={{ top: 50 }}>
        <Text style={styles.titleText}>{theirs} Profile</Text>
      </View>
      { /* Row providing link to change password. */ }
      <View style={{ top: 80 }}>
        <Text style={styles.leftText}>Password</Text>
        <TouchableOpacity
          onPress={() => router.navigate(`../change_password?username=${username}`)}
        >
          <Text style={styles.rightLink}>{"[Edit]"}</Text>
        </TouchableOpacity>
      </View>
      { /* User statistics header text. */ }
      <View style={{ top: 150 }}>
        <Text style={styles.titleText}>{theirs} Statistics</Text>
      </View>
      { /* Row displaying user's number of projects. */ }
      <View style={{ top: 180 }}>
        <Text style={styles.leftText}>Projects</Text>
        <Text style={styles.rightText}>{user.numProjects}</Text>
      </View>
      <View style={{ top: 310 }}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => router.navigate('../login')}
        >
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View> 
  );
}

/* Returns a name in its possessive form.
 * Ex: Kyle -> Kyle's
 * Ex: Charles -> Charles' */
function appendApostrophe(name: string): string {
  const lastChar: string = name[name.length - 1];
  if (lastChar.toLowerCase() == "s") {
    return name + "'";
  } else {
    return name + "'s";
  }
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  leftText: {
    position: "absolute",
    left: 30,
    fontSize: 20,
    fontWeight: "bold",
  },
  rightText: {
    position: "absolute",
    right: 30,
    fontSize: 20,
    fontWeight: "bold",
  },
  rightLink: {
    position: "absolute",
    right: 30,
    fontSize: 20,
    fontWeight: "bold",
    color: "#4A90E2",
  },
  logoutButton: {
    backgroundColor: '#CD001A',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginLeft: 30,
    marginRight: 30,
  },
  buttonText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});