import { Text, View, TouchableOpacity, StyleSheet } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>This will function as the home page.</Text>

      <TouchableOpacity
        //onPress={console.log("im pressed")}
        style={styles.roundButton}>
        <Text>I'm a button</Text>
      </TouchableOpacity>
    </View>
    
  );

}

const styles = StyleSheet.create({
  roundButton: {
    marginTop: 20,
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    backgroundColor: '#4a91e2',
  },
});
