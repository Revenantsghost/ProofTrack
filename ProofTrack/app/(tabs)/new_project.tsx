import React, { useContext, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, TextInput, ScrollView, SafeAreaView } from 'react-native';
import { UserContext } from './_layout';
import { User } from '../types';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Picker } from '@react-native-picker/picker';
import { format } from 'date-fns';


export default function Index() {
  const user: User = useContext(UserContext);
  const [projectName, setProjectName] = useState('');
  const [open, setOpen] = useState(false);
  const [notificationFrequency, setNotificationFrequency] = useState('null');
  const [reminderDays, setReminderDays] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [hasEndDate, setHasEndDate] = useState(true);

  const handleCreateProject = () => {
    const projectData = {
      projectName,
      notificationFrequency,
      reminderDays,
      startDate,
      endDate: hasEndDate ? endDate : null,
    };
    // Call the backend API to save the project
    console.log('Project Created:', projectData);
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
      
      <View style={styles.dropdownContainer}>
        <Text style={styles.label}>Notification Frequency:</Text>
        <Picker
          selectedValue={notificationFrequency}
          onValueChange={(itemValue) => setNotificationFrequency(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Every 30 minutes" value="30min" />
          <Picker.Item label="Hourly" value="hourly" />
          <Picker.Item label="Daily" value="daily" />
          <Picker.Item label="Weekly" value="weekly" />
          <Picker.Item label="Biweekly" value="biweekly" />
          <Picker.Item label="Monthly" value="monthly" />
        </Picker>
      </View> 

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
    marginTop: 7,
    fontSize: 18,
    fontWeight: "bold",
  },
  picker: {
    height: 100,
    width: '100%',
    marginBottom: 35,
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
});