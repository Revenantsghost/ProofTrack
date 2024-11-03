import React, {useContext } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { UserContext } from './_layout';
import { User } from '../types';

/* UI for user's profile page.
 * Displays their username and allows them to change username or password.
 * Also displays some stats, such as number of projects in progress. */
export default function Profile() {
  // Grab the current user's information.
  const user: User = useContext(UserContext);
  // Convert their username into its possessive form.
  const theirs: string = appendApostrophe(user.username);
  return (
    <View>
      <View style={{ alignItems: "center", top: 30 }}>
        <Ionicons name="person" size={64} color="#25292e" />
      </View>
      <View style={{ top: 50 }}>
        <Text style={styles.titleText}>{theirs} Profile</Text>
      </View>
      <View style={{ top: 70 }}>
        <Text style={styles.leftText}>Username</Text>
        <Link href="../edit_username" style={styles.rightLink}>{"[Edit]"}</Link>
      </View>
      <View style={{ top: 120 }}>
        <Text style={styles.leftText}>Password</Text>
        <Link href="./profile" style={styles.rightLink}>{"[Edit]"}</Link>
      </View>
      <View style={{ top: 210 }}>
        <Text style={styles.titleText}>{theirs} Stats</Text>
      </View>
      <View style={{ top: 230 }}>
        <Text style={styles.leftText}>Projects</Text>
        <Text style={styles.rightText}>{/* user.numProjects? */4}</Text>
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
    fontSize: 20,
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
});