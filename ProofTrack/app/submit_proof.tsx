import React from 'react';
import { FlatList, SafeAreaView, Text, View, StyleSheet, Pressable} from 'react-native';
import { User } from './types';
import { router } from 'expo-router';

// We can't use the context hooks to grab User data (this isn't a child component)
// I'll find another way to do so.

/* Things are currently hardcoded in, but this will eventually be changed. */
const projects = [
  { id: '1', title: 'Study biology for an hour' },
  { id: '2', title: 'Lose 20lb before the Summer' },
  { id: '3', title: 'Run on the treadmill for 30min' },
  { id: '4', title: 'Clean my room' },
];

/* Renders a single pressable project.
 * Upon pressing it, the user is directed to the camera usage app. */
const ItemRow = ({ item }: any) => (
  <Pressable onPress={() => router.navigate('./upload_media')} style={styles.item}>
    <Text style={styles.title}>{item.title}</Text>
  </Pressable>
);

/* Renders each project as a pressable object, separated by a thin black line.
 * Upon pressing it, the user is directed to the camera usage app. */
export default function SubmitProof() {
  /* Renders a thin black line between each pressable project. */
  const ItemSeparator = () => (
    <View style={styles.separator} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ItemRow item={item} />
        )}
        ItemSeparatorComponent={ItemSeparator}
      />
    </SafeAreaView>
  );
}

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
});