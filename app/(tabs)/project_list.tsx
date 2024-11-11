import React, { useContext } from 'react';
import { FlatList, SafeAreaView, Text, View, StyleSheet, Pressable} from 'react-native';
import { UserContext } from './_layout';
import { User } from '../types';

//const user: User = useContext(UserContext);
//const DATA = [];

const projects = [
  { id: '1', title: 'Item 1' },
  { id: '2', title: 'Item 2' },
  { id: '3', title: 'Item 3' },
  { id: '4', title: 'Item 4' },
];

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
   * Handles the press event for an item, displaying an alert with the item title.
   *
   * @param {Object} item - The item data for the pressed row.
   */
  const handlePress = (item: any) => {
    alert(`You pressed: ${item.title}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
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