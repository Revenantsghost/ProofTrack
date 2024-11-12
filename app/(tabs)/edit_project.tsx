import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';

const project = {
  name: 'Project ProofTrack',
  checkpointFrequency: 'Weekly',
  duration: '3 months',
  images: [
    'https://via.placeholder.com/150',
    'https://via.placeholder.com/150',
    'https://via.placeholder.com/150',
  ],
};

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