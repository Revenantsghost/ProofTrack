import React, { useState, useEffect } from 'react';
import { FlatList, SafeAreaView, Text, View, StyleSheet, Pressable } from 'react-native';
import { getServer } from '../constants';

const SERVER: string = getServer();

/* Interface to make the `projects` state field more clear. */
interface ProjectEntry {
  /* The project's title. */
  title: string,
  /* The project's UNIQUE ID "number". */
  projID: string,
}

/* Props! */
interface ListOfProjectProps {
  /* The current user's username. */
  username: string,
  /* An event handler. Called when a project item is tapped. */
  handleProjectPress: (projID: string) => void,
}

/** 
 * Renders an individual item row in the list.
 * 
 * @param props Defined above.
 * @returns {JSX.Element} A list of pressable item row components.
 * What they do when pressed is defined in @props (handleProjectPress).
 */
export default function ListOfProjects(props: ListOfProjectProps) {
  /* Undefined only when loading/fetching user's projects from the backend.
   * Therefore an empty list means the user has no projects. */
  const [projects, setProjects] = useState<ProjectEntry[] | undefined>(undefined);

  /**
   * Fetches projects for the current user from the server.
   * Updates the `projects` state with the fetched data.
   */
  const fetchUserInfo = async () => {
    try {
      /* Adjust username dynamically in route. */
      const route: string = 'fetchProjects';
      const userInfoResponse = await fetch(`${SERVER}/${route}?user_name=${props.username}`, {
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

  /* Fetch user info when the component mounts. */
  useEffect(() => {
    fetchUserInfo();
  }, []);

  /* Projects are still loading. */
  if (projects === undefined) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading projects...</Text>
      </View>
    );
  }
  
  /* Projects are finished loading, but the user has zero projects. */
  if (projects.length === 0){
    return (
      <View style={styles.container}>
        <Text
          style={{
            fontSize: 20,
            marginBottom: 20,
            textAlign: 'center',
          }}
        >
          You have no projects.
        </Text>
      </View>
    );
  }

  /* Projects are finished loading and the user has at least one project. */
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={projects}
        keyExtractor={(item) => item.projID}
        renderItem={({ item }) =>
          <ItemRow
            item={item}
            onPress={() => {props.handleProjectPress(item.projID)}}
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
  loadingText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
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