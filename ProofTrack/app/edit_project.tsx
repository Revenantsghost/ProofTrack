import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Project } from './types';

//Test data
const data = {
  name: 'Project ProofTrack',
  projID: '1',
  checkpointFrequency: 'Weekly',
  duration: '3 months',
  images: [
    'https://via.placeholder.com/150',
    'https://via.placeholder.com/150',
    'https://via.placeholder.com/150',
  ]
};

const project = {
  name: 'Study biology for an hour',
  projID:'2',
  checkpointFrequency: 'Every 30 min',
  duration:'12/10/2024',
  images: ['https://prooftrack.blob.core.windows.net/demo/Biology_HW.png?sp=r&st=2024-11-13T04:17:36Z&se=2024-11-13T12:17:36Z&spr=https&sv=2022-11-02&sr=b&sig=TwKY2vIT3oC6%2FGEt77kKwR8TpoSWEVvE372Mw2p7eOc%3D']
};

/**
 * A component to display edit_rpoject page.
 *
 * @component
 */
export default function EditProject() {
  return(
    <View style={styles.container}>
      {/* Project Name */}
      <Text style={styles.title}>{project.name}</Text>

      {/* Project Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>
          <Text style={styles.detailLabel}>Checkpoint Frequency: </Text>
          {project.checkpointFrequency}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.detailLabel}>Duration: </Text>
          {project.duration}
        </Text>
      </View>

      {/* Project Images */}
      <Text style={styles.sectionTitle}>Images</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageContainer}>
        {project.images.map((imageUrl, index) => (
          <Image
            key={index}
            source={{ uri: imageUrl }}
            style={styles.image}
          />
        ))}
      </ScrollView>
    </View>
  );
};

/**
 * Parses project information from local search parameters.
 *
 * @returns {Project | undefined} A `Project` object if parsing succeeds; otherwise, `undefined`.
 */
function parseProject(): Project| undefined {
  const { userID, projID } = useLocalSearchParams();
  // Ensure the passed parameters are all strings.
  if (typeof(userID) !== 'string'
                                    || typeof(projID) !== 'string') {
    // Undefined signals an error to the caller.
    return undefined;
  }
  // Ensure we were able to parse numbers out of userID and projID.
  const user_ID: number = parseFloat(userID as string);
  const proj_ID: number = parseFloat(projID as string);
  if (Number.isNaN(user_ID) || Number.isNaN(proj_ID)) {
    // Undefined signals an error to the caller.
    return undefined;
  }
  const project: Project = {
    userID: user_ID,
    projID: proj_ID,
  }
  console.log(userID);
  console.log(projID)
  return project;
}

/**
 * Styles for components.
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailsContainer: {
    marginBottom: 20,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 10,
  },
  detailLabel: {
    fontWeight: '600',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  imageContainer: {
    flexDirection: 'row',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#ccc',
  },
});