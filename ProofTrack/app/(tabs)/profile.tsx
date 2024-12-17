import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { UserContext } from './_layout';
import { getServer } from '../constants';

const SERVER: string = getServer();

/* UI for user's profile page.
 * Displays their username and allows them to change username or password.
 * Also displays some stats, such as number of projects in progress. */
export default function Profile() {
  /* Grab the user's username. */
  const username: string = useContext(UserContext);
  /* And then convert it into its possessive form. */
  const theirs: string = appendApostrophe(username);
  /* User's number of projects. */
  const [numProjects, setNumProjects] = useState('Loading...');


  const populateNumProjects = async () => {
    /* Called method handles case of internal errors. */
    const num_projects: number | undefined = await fetchNumProjects(username);
    if (num_projects !== undefined) {
      setNumProjects(`${num_projects}`);
    } else {
      setNumProjects('Error!');
    }
  }

  /* Fetch user's number of projects when the component mounts. */
  /*
  useEffect(() => {
    populateNumProjects();
  }, []); */
  /* I will also try without using useEffect. */
  populateNumProjects();

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
        <Text style={styles.rightText}>{numProjects}</Text>
      </View>
      <View style={{ top: 310 }}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {router.replace('../login')}}
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

/* Fetches the user's number of projects.
 * Returns a number on success. 
 * Returns undefined (and throws an error) if internal error encountered. */
async function fetchNumProjects(user_name: string): Promise<number | undefined> {
  const route: string = 'fetchProfile';
  try {
    const response: Response = await fetch(`${SERVER}/${route}?user_name=${user_name}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Internal error');
    }
    const jsonData: any = await response.json();
    const num_projects: number = jsonData.num_of_projects;
    if (num_projects === undefined) {
      /* This means the JSON didn't have the expected field!
       * Internal error, so throw an error. */
      throw new Error('Parsing error');
    }
    console.log("Parsing user's num_of_projects attempt OK.");
    return num_projects;
  } catch (error) {
    console.error('Internal error encountered:', error);
    Alert.alert('Internal error encountered.', 'Couldn\'t fetch your number of projects.');
    return undefined;
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