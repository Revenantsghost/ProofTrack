import React, { useState, useEffect } from 'react';
import { FlatList, SafeAreaView, Text, View, StyleSheet, Pressable } from 'react-native';
import { getServer } from '../constants';

const SERVER: string = getServer();

/* Props! */
type ListOfProjectProps = {
  /* The current user's username. */
  username: string,
  /* An event handler. Called when a project item is tapped. */
  handleProjectPress: (projID: number) => void,
}

export default function ListOfProjects(props: ListOfProjectProps ) {

  const [projects, setProjects] = useState([]);

  /**
   * Fetches projects for the current user from the server.
   * Updates the `projects` state with the fetched data.
   */
  const fetchUserInfo = async () => {
    try {
      /* Adjust username dynamically in route. */
      const userInfoResponse = await fetch(`${SERVER}/fetchProjects?user_name=${props.username}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }, // Ensure the server knows it's a JSON payload
        }
      );
      if (!userInfoResponse.ok) {
        throw new Error('Failed to fetch project data');
      }
      const data = await userInfoResponse.json();
      console.log(data);
      const fetchedProjects = data.map((p: { proj_id: any; proj_name: any }) => ({
        projID: p.proj_id,
        title: p.proj_name,
      }));
      setProjects(fetchedProjects);
      console.log("Fetch Projects OK.");
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  // Fetch user info when the component mounts
  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={projects}
        keyExtractor={(item) => item['projID']}
        renderItem={({ item }) =>
          <ItemRow
            item={item}
            onPress={() => {props.handleProjectPress(item['projID'])}}
          />}
        ItemSeparatorComponent={ItemSeparator}
      />
    </SafeAreaView>
  );
}

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
const ItemSeparator = () => <View style={styles.separator} />;

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
  },
});