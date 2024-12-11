import React from 'react';
import { StyleSheet, View, Pressable, Text } from 'react-native';
import { router } from 'expo-router';

type Props = {
  label: string;
  theme?: 'primary' | 'secondary';
  onPress?: () => void;
};



export default function Button({ label, theme, onPress }: Props) {
  if (theme === 'primary') {
    return (
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={onPress}>
        <Text style={styles.buttonLabel}>{label}</Text>
        </Pressable>
      </View>
    );
  } else if (theme === 'secondary') {
    return (
        <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={() => router.navigate('./upload_media')}>
            <Text style={styles.buttonLabel}>{label}</Text>
        </Pressable>
        </View>
    );
  }
  return (
    <View style={styles.buttonContainer}>
    <Pressable style={styles.button} onPress={(onSubmit) => router.navigate('/')}>
        <Text style={styles.buttonLabel}>{label}</Text>
    </Pressable>
    </View>
    
  );

}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 320,
    height: 68,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  button: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  submitButton: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderColor: 'white',  // White border
    borderWidth: 2,         // Border width
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
  },
});
