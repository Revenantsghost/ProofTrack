import React, { useContext, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, TextInput, ScrollView, Modal, FlatList, Alert } from 'react-native';
import { UserContext } from './_layout';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { format } from 'date-fns';
import { router } from 'expo-router';
import { getServer } from '../constants';

const SERVER: string = getServer();

export default function Index() {
  const username: string = useContext(UserContext);
  const [projectName, setProjectName] = useState('');
  const [notificationFrequency, setNotificationFrequency] = useState('Select'); // initial state of the notification frequency
  const [isModalVisible, setModalVisible] = useState(false); // Controls the visibility of the modal
  const [reminderDays, setReminderDays] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [hasEndDate, setHasEndDate] = useState(true);

  const handleCreateProject = async () => {
    if (!projectName || notificationFrequency === 'Select' || !startDate) {
      Alert.alert('Error', 'Please fill in all the required fields.');
      return;
    }
    const projectData = {
      proj_name: projectName,
      user_name: username,
      checkpointFrequency: notificationFrequency,
      duration: endDate ? `From ${startDate} to ${endDate}` : 'Indefinite',
      // reminderDays,
      startDate: startDate ? format(startDate, 'yyy-MM-dd') : '',
      // endDate: hasEndDate ? endDate : null,
    };
    // Call the backend API to save the project
    console.log('Project Created:', projectData);
    try {
      // Send POST request to create the project
      const response = await fetch(`${SERVER}/uploadProject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData), // Sending the project data as JSON
      });
  
      // Handle the response based on status code
      if (response.status === 201) {
        const result = await response.json(); // Extract the project ID from the response
        console.log('Project created successfully:', result.proj_id);
  
        // Show success message and clear the form
        Alert.alert('Success', 'Project Created!', [
          {
            text: 'OK',
            onPress: () => {
              // Clear form fields
              setProjectName('');
              setNotificationFrequency('Select');
              setReminderDays([]);
              setStartDate(null);
              setEndDate(null);
              setHasEndDate(true);
              /* Send the user back to the homepage.
               * This forces the pages to re-mount. */
              router.replace(`../(tabs)/?username=${username}`);
            },
          },
        ]);
      } else if (response.status === 400) {
        Alert.alert('Error', 'Bad Request. Please check your input.');
      } else if (response.status === 404) {
        Alert.alert('Error', 'User not found.');
      } else if (response.status === 500) {
        Alert.alert('Error', 'Server Error. Please try again later.');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      Alert.alert('Error', 'Failed to create project. Please try again.');
    }
  };

  const frequencies = [
    { label: 'Every 30 minutes', value: 'Every 30 Minutes' },
    { label: 'Hourly', value: 'Hourly' },
    { label: 'Daily', value: 'Daily' },
    { label: 'Weekly', value: 'Weekly' },
    { label: 'Biweekly', value: 'Biweekly' },
    { label: 'Monthly', value: 'Monthly' }
  ];

  const handleSelectFrequency = (value: React.SetStateAction<string>) => {
    setNotificationFrequency(value); // Set the selected value
    setModalVisible(false); // Close the modal
  };

  const toggleDay = (day: string) => {
    setReminderDays((prevDays) =>
      prevDays.includes(day) ? prevDays.filter(d => d !== day) : [...prevDays, day]
    );
  };

  const formatDate = (date: Date | null) => {
    return date ? format(date, 'MMM dd, yyyy') : 'Pick a Date';
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Project Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Project Name"
        value={projectName}
        onChangeText={setProjectName}
      />
      
      <Text style={styles.label}>Notification Frequency:</Text>
      
      {/* Display selected notification frequency */}
      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>
          {notificationFrequency ? notificationFrequency : 'Select Frequency'}
        </Text>
      </TouchableOpacity>

      {/* Modal for displaying dropdown options */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackground}
          onPress={() => setModalVisible(false)} // Close modal when tapping outside
        >
          <View style={styles.modalContent}>
            <FlatList
              data={frequencies}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleSelectFrequency(item.value)}
                >
                  <Text style={styles.modalItemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      <Text style={styles.label}>Reminder Days:</Text>
      <View style={styles.daysContainer}>
        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
          <TouchableOpacity key={day} onPress={() => toggleDay(day)}>
            <Text style={[styles.day, reminderDays.includes(day) && styles.daySelected]}>
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View>
        <Text style={styles.label}>Start Date:</Text>
        <Button
          title={startDate ? formatDate(startDate) : "Pick Start Date"}
          onPress={() => setStartDatePickerVisibility(true)}
        />
        <DateTimePickerModal
          isVisible={isStartDatePickerVisible}
          mode="date"
          onConfirm={(date) => {
            setStartDate(date);
            setStartDatePickerVisibility(false);
          }}
          onCancel={() => setStartDatePickerVisibility(false)}
        />

        <Text style={styles.label}>End Date (optional):</Text>
        <View style={styles.endDateToggle}>
          <TouchableOpacity onPress={() => setHasEndDate(!hasEndDate)}>
            <Text style={styles.toggleText}>
              {hasEndDate ? 'Switch to Infinite' : 'Set End Date'}
            </Text>
          </TouchableOpacity>
        </View>

        {hasEndDate && (
          <Button
            title={endDate ? formatDate(endDate) : "Pick End Date"}
            onPress={() => setEndDatePickerVisibility(true)}
          />
        )}

        <DateTimePickerModal
          isVisible={isEndDatePickerVisible}
          mode="date"
          onConfirm={(date) => {
            setEndDate(date);
            setEndDatePickerVisibility(false);
          }}
          onCancel={() => setEndDatePickerVisibility(false)}
        />
      </View>

      <TouchableOpacity style={styles.createButton} onPress={handleCreateProject}>
        <Text style={styles.createButtonText}>Create</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
    marginBottom: 5,
    fontSize: 16,
  },
  label: {
    marginTop: 18,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
    marginBottom: 5,
  },
  day: {
    padding: 8,
    margin: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  daySelected: {
    backgroundColor: '#87cefa',
    color: '#fff',
  },
  endDateToggle: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 1,
    marginBottom: 5,
    marginVertical: 10,
  },
  toggleText: {
    color: '#007BFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dropdownContainer: {
    width: '100%',
    marginBottom: 60,
    marginTop: 5,
  }, 
  // Added for the Notification Frequency modal:
  button: {
    padding: 15,
    backgroundColor: '#87cefa',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: 300,
    borderRadius: 8,
    padding: 20,
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalItemText: {
    fontSize: 18,
  },
});