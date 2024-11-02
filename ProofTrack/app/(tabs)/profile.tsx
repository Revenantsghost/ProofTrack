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
      <Text style={styles.profileName}>
        {appendApostrophe(user.username)} Profile
      </Text>
      <View style={{ top: 90 }}>
        <Text style={styles.leftText}>Username</Text>
        <Link href="../edit_username" style={styles.rightLink}>{"[Edit]"}</Link>
      </View>
      <View style={{ top: 140 }}>
        <Text style={styles.leftText}>Password</Text>
        <Link href="./profile" style={styles.rightLink}>{"[Edit]"}</Link>
      </View>
    </View> 
  );
}

/* Turns a name into its possessive form.
 * Ex: Kyle -> Kyle's
 * Ex: Charles -> Charles' */
function appendApostrophe(name: string): string {
  const lastChar: string = name[name.length - 1];
  if (lastChar == "s" || lastChar == "S") {
    return name + "'";
  } else {
    return name + "'s";
  }
}

const styles = StyleSheet.create({
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    top: 50,
  },
  leftText: {
    position: "absolute",
    fontSize: 20,
    fontWeight: "bold",
    left: 30,
    textAlign: "left",
  },
  rightLink: {
    position: "absolute",
    fontSize: 20,
    fontWeight: "bold",
    color: "#4A90E2",
    textAlign: "right",
    right: 30,
  },
});
