import React, { useContext, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, TextInput, ScrollView } from 'react-native';
import { UserContext } from './_layout';
import { User } from '../types';
// import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Picker } from '@react-native-picker/picker';


export default function Index() {
  const user: User = useContext(UserContext);
  const [projectName, setProjectName] = useState('');
  const [open, setOpen] = useState(false);
  const [notificationFrequency, setNotificationFrequency] = useState('null');
  const [items, setItems] = useState([
    { label: 'Every 30 minutes', value: '30min' },
    { label: 'Hourly', value: 'hourly' },
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Biweekly', value: 'biweekly' },
    { label: 'Monthly', value: 'monthly' },
  ]);
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

      {/* Notification Frequency Dropdown */}
      {/* <View style={styles.dropdownContainer}>
        <Text style={styles.label}>Notification Frequency</Text>
        <DropDownPicker
          open={open}
          value={notificationFrequency}
          items={items}
          setOpen={setOpen}
          setValue={setNotificationFrequency}
          setItems={setItems}
          style={styles.dropdown}
          placeholder="Select frequency"
          containerStyle={{ marginVertical: 10 }}
        />
      </View> */}

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

      <Text style={styles.label}>Start Date:</Text>
      <Button title="Pick Start Date" onPress={() => setStartDatePickerVisibility(true)} />
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
        <Button title="Pick End Date" onPress={() => setEndDatePickerVisibility(true)} />
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
    marginBottom: 15,
  },
  label: {
    marginTop: 10,
    fontSize: 16,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 15,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
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
    marginBottom: 10,
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdownContainer: {
    width: '100%',
  },
  dropdown: {
    borderColor: '#ccc',
    borderWidth: 1,
    color: '#D3D3D3',
  },
});