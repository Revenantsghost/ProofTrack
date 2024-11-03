import React, {useContext } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { UserContext } from './_layout';
import { User } from '../types';

export default function Profile() {
  const user: User = useContext(UserContext);
  return (
    <View>
      <View style={{ alignItems: "center", top: 30 }}>
        <Ionicons name="person" size={64} color="#25292e" />
      </View>
      <Text style={styles.profileText}>
        {appendApostrophe(user.username)} Profile
      </Text>
      <View style={{ top: 70 }}>
        <Text style={styles.leftText}>Username</Text>
        <Link href="../edit_username" style={styles.rightLink}>{"[Edit]"}</Link>
      </View>
      <View style={{ top: 120 }}>
        <Text style={styles.leftText}>Password</Text>
        <Link href="./profile" style={styles.rightLink}>{"[Edit]"}</Link>
      </View>
      <Text style={styles.statsText}>
        {appendApostrophe(user.username)} Stats
      </Text>
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
  profileText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    top: 50,
  },
  statsText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    top: 210,
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
