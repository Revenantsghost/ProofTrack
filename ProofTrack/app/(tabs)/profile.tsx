import React, {useContext } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { UserContext } from './_layout';
import { User } from '../types';

export default function Profile() {
  const user: User = useContext(UserContext);
  return (
    <View style={styles.container}>
      <View style={styles.profile_icon}>
        <Ionicons name="person" size={64} color="#25292e" />
      </View>
      <View style={styles.row}>
        <Text style={styles.leftText}>Username</Text>
        <Link href="../edit_username" style={styles.rightLink}>{"[Edit]\n"}</Link>
      </View> 
      <View style={styles.row}>
        <Text style={styles.leftText}>Password</Text>
        <Link href="../edit_username" style={styles.rightLink}>{"[Edit]"}</Link>
      </View>   
    </View> 
  );
}

const styles = StyleSheet.create({
  container: {
    // Placholder so we at least get a default!
  },
  profile_icon: {
    alignItems: "center",
    top: 37.5,
  },
  row: {
    flexDirection: "row",
    top: 80,
  },
  leftText: {
    //flex: 5,
    fontSize: 20,
    fontWeight: "bold",
    left: 20,
    textAlign: "left",
  },
  rightLink: {
    fontSize: 20,
    fontWeight: "bold",
    color: '#4A90E2',
    left: 180,
  },
});
