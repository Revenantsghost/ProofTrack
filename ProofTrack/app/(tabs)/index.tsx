import { Text, TextStyle, View, TouchableOpacity, StyleSheet } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={styles.header1}>Welcome to ProofTrack!</Text>
      <Text style={styles.body}>
        First set up your password under the Profile tab!{'\n'}
        After you've set up a password it's time to start on your first project! {'\n'}
        Click on the New Project tab to specify the parameters for a new project. {'\n'}
        Once your project is set up, ProofTrack will schedule persistent reminders for you. {'\n'}
        To stop being reminded, simply submit proof of your progress.
      </Text>

      <TouchableOpacity
        //onPress={navigation.navigate('Profile', {name: 'Jane'})}
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
  header1: {
    fontFamily: 'Arial',
    fontSize: 28,
    justifyContent: 'center',
    alignContent: 'flex-start',
  },
  body: {
    fontFamily: 'Arial',
    fontSize: 18,
    justifyContent: 'center',
    alignItems: 'stretch',
  }
});
