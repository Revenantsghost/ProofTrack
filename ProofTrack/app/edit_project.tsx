import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Project, ProjectInfo } from './types';

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

  //Fetch project details on component mount
  useEffect(() => {
    if (projInfo) {
      //Utilize async/await to anticipate fetch
      const fetchInfo = async () => {
        try{
          //Fetch project details, provide endpoint params using projInfo
          const infoResponse = await fetch(`http://13.64.145.249:3000/fetchProject?user_name=${projInfo.username}&proj_id=${projInfo.projID}`, {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
            })
            //Error checking
            if (!infoResponse.ok) {
              throw new Error('Failed to fetch project data');
            }
            const data = await infoResponse.json(); //Processs response into JSON
            const fetchedProject: Project = {
              username: projInfo.username,
              name: data.project_name,
              projID: data.proj_id,
              notificationFrequency: data.checkpoint_frequency,
              duration: data.duration,
              images: [], // Placeholder, images will be fetched separately
            };
            setProject(fetchedProject); //Set program variables
        }
        catch(error){
          console.error('Error fetching project info:', error);
        }
      }

      // Fetch images for the project
      const fetchImages = async () => {
      try{
        const imageResponse = await fetch(`http://13.64.145.249:3000/media/${projInfo.username}/${projInfo.projID}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        if (!imageResponse.ok) {
          throw new Error('Failed to fetch media files');
        }
        const data = await imageResponse.json();

        if (data.success) {
          const fetchedImages = data.files.map((file: { fileName: string; fileData: string }) =>
            `data:image/png;base64,${file.fileData}` // Construct data URI for base64 images
          );
          console.log(fetchImages);
          setImages(fetchedImages);
        }
      }
      catch(error) {
        console.error('Error fetching media files:', error);
      }
    }

      fetchInfo();
      fetchImages();
    }
  }, [projInfo]);

//Display loading message as project info is fetched
  if (!project) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading project...</Text>
      </View>
    );
  }

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
        {project.images.map((imageUrl, index) => (
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
