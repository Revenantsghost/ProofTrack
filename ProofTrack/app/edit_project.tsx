import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Project, ProjectInfo } from './types';
import { getServer } from './constants';

const SERVER: string = getServer();

/**
 * Parses project information from local search parameters. Furnishes params for endpoint
 *
 * @returns {ProjectInfo | undefined} A `ProjectInfo` object if parsing succeeds; otherwise, `undefined`.
 */
function parseProject(): ProjectInfo | undefined {
  const { userID, projID } = useLocalSearchParams();

  // Ensure the passed parameters are all strings.
  if (typeof userID !== 'string' || typeof projID !== 'string') {
    return undefined;
  }

  const user_ID = userID;
  const proj_ID: number = parseFloat(projID);

  if (Number.isNaN(user_ID) || Number.isNaN(proj_ID)) {
    return undefined;
  }

  return { username: user_ID, projID: proj_ID };
}

export default function EditProject() {
  const projInfo = parseProject();
  const [project, setProject] = useState<Project | null>(null);
  const [images, setImages] = useState<string[]>([]); // State for images

  /* Fetch project details on component mount. */
  useEffect(() => {
    if (projInfo) {
      /* Utilize async/await to anticipate fetch. */
      const fetchInfo = async () => {
        try {
          /* Fetch project details, provide endpoint params using projInfo. */
          const infoResponse = await fetch(`${SERVER}/fetchProject?user_name=${projInfo.username}&proj_id=${projInfo.projID}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });

          /* Error checking. */
          if (!infoResponse.ok) {
            console.log(`Info Response Not Okay. Status: ${infoResponse.status}`);
            throw new Error('Failed to fetch project data');
          }

          const data = await infoResponse.json(); // Process response into JSON.
          const fetchedProject: Project = {
            username: projInfo.username,
            name: data.project_name,
            projID: data.proj_id,
            notificationFrequency: data.checkpointFrequency,
            duration: data.duration,
            images: [], // Placeholder, images will be fetched separately.
          };
          setProject(fetchedProject); // Set program variables.
        } catch (error) {
          console.error('Error fetching project info:', error);
        }
      };

      const fetchImages = async () => {
        try {
          /* Fetch project images, provide endpoint params using projInfo. */
          const imageResponse = await fetch(`${SERVER}/media/${projInfo.username}/${projInfo.projID}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });

          /* Empty checking and error checking. */
          const no_images_status: number = 404;
          if (imageResponse.status === no_images_status) {
            /* A status of 404 means there are no images found for this project.
             * Not an error, but make a note of it. */
            setImages([]);
            console.log(`No images found for project ${projInfo.projID} of user ${projInfo.username}.`);
            return;
          } else if (!imageResponse.ok) {
            console.log(`Image Response Not Okay. Status: ${imageResponse.status}`);
            throw new Error('Failed to fetch media files');
          }

          const data = await imageResponse.json();

          // Validate response success.
          if (data.success && data.mediaUrl) {
            const imgURL = data.mediaUrl;
            console.log(`Media URL: ${imgURL}`);

            // Set the image URL for display.
            setImages([imgURL]);
          } else {
            throw new Error('Invalid response structure or missing media URL');
          }
        } catch (error) {
          console.error('Error fetching media files:', error);
        }
      };

      /* Call async functions */
      fetchInfo();
      fetchImages();
    }
  }, []);

  // Display loading message as project info is fetched
  if (!project) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading project...</Text>
      </View>
    );
  }

  // Page visual structure
  return (
    <View style={styles.container}>
      {/* Project Name */}
      <Text style={styles.title}>{project.name}</Text>

      {/* Project Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>
          <Text style={styles.detailLabel}>Checkpoint Frequency: </Text>
          {project.notificationFrequency}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.detailLabel}>Duration: </Text>
          {project.duration}
        </Text>
      </View>

      {/* Project Images */}
      <Text style={styles.sectionTitle}>Images</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageContainer}>
        {images.map((imageUrl, index) => (
          <Image key={index} source={{ uri: imageUrl }} style={styles.image} />
        ))}
      </ScrollView>
    </View>
  );
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