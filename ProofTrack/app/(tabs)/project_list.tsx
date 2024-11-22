import React, { createContext, useContext, useState} from 'react';
import { FlatList, SafeAreaView, Text, View, StyleSheet, Pressable,} from 'react-native';
import { UserContext } from './_layout';
import { Project, User } from '../types';
import { router } from 'expo-router';
import { create } from 'react-test-renderer';

const user: User = useContext(UserContext);

const [projects, setProjects] = useState([
  { projID: '2', title: 'Study biology for an hour'},
  { projID: '3',  title: 'Lose 20lb before the Summer'},
  { projID: '4', title: 'Run on the treadmill for 30min'},
  { projID: '5', title: 'Clean my room'}
]);


/**
 * Fetches projects for the current user from the server.
 * Updates the `projects` state with the fetched data.
 */
fetch(`http://localhost:3000/fetchProjects?user_id=${user.userID}`, {
  method: 'GET',
  headers: {'Content-Type': 'application/json'}, // Ensure the server knows it's a JSON payload
})
.then(response => {
  if (response.ok) {
    response.json().then(data => {
      const fetchedProjects = data.map((p: { proj_id: any; project_name: any; }) => ({
        id: p.proj_id,
        title: p.project_name,
      }))
      setProjects([...projects, ...fetchedProjects]);
    }).catch(error => {
        console.log(response)
        console.error('Error parsing JSON:', error);
    });
  } else {
    console.log(response)
      throw new Error('User not found or server error');
  }
})
.catch(error => {
  console.error('Error fetching profile:', error);
});


/**
 * Renders an individual item row in the list.
 *
 * @param {Object} item - The item data for the row.
 * @param {Function} onPress - Function to handle press events on the item.
 * @returns {JSX.Element} A pressable item row component.
 */
const ItemRow = ({ item, onPress }: any) => (
  <Pressable onPress={() => onPress(item)} style={styles.item}>
    <Text style={styles.title}>{item.title}</Text>
    <Text style={styles.icon}>{'>'}</Text>
  </Pressable>
);

/**
 * Renders a separator line between items in the list.
 *
 * @returns {JSX.Element} A separator component.
 */
const ItemSeparator = () => (
  <View style={styles.separator} />
);

/**
 * Main component that displays a list of projects using a FlatList.
 *
 * @component
 */
export default function ProjectList() {
  /**
   * Handles the press event for an item, directing user to edit_project page.
   * Uses local search params to pass information to the edit_project page.
   *
   * @param {Object} item - The item data for the pressed row.
   */
  const handlePress = (item: any) => {
    router.navigate(`../edit_project?userID=${user.userID}&projID=${item.id}`);
    console.log('Item ID: ' + item.id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={projects}
        keyExtractor={(item) => item.projID}
        renderItem={({ item }) => (
          <ItemRow item={item} onPress={handlePress} />
        )}
        ItemSeparatorComponent={ItemSeparator}
      />
    </SafeAreaView>
  );
}


/**
 * Styles for components.
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#f8f8f8',
  },
  item: {
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    color: '#333',
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 8,
    marginHorizontal: 16,
  },
  icon: {
    fontSize: 18,
    color: '#ccc',
  }
});