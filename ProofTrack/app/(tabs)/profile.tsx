import React, {useContext } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Link } from 'expo-router';
import { UserContext } from './_layout';
import { User } from '../types';

export default function Profile() {
  const user: User = useContext(UserContext);
  return (
    <View style={styles.container}>
      <Text style={styles.leftLabel}>Name: {user.username}</Text>
      <Link href="./project_list" style={styles.rightLink}>{"[Edit]"}</Link>
    </View>   
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: "center",
    //alignItems: "center",
  },
  leftLabel: {
    fontSize: 20,
    fontWeight: "bold",
    left: 60,
    top: 120,
  },
  rightLink: {
    fontSize: 20,
    fontWeight: "bold",
    left: 260,
    top: 120,
  }
});
