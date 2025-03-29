import React from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';

interface AddMedicationModalProps {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  medicationName: string;
  setMedicationName: React.Dispatch<React.SetStateAction<string>>;
  dosage: string;
  setDosage: React.Dispatch<React.SetStateAction<string>>;
  timeToTake: string;
  setTimeToTake: React.Dispatch<React.SetStateAction<string>>;
  frequency: string;
  setFrequency: React.Dispatch<React.SetStateAction<string>>;
  handleAddMedication: () => void;
  medicationList: string[];
  dosageOptions: string[];
  timeOptions: string[];
  frequencyOptions: string[];
}

const AddMedicationModal: React.FC<AddMedicationModalProps> = ({
  modalVisible,
  setModalVisible,
  medicationName,
  setMedicationName,
  dosage,
  setDosage,
  timeToTake,
  setTimeToTake,
  frequency,
  setFrequency,
  handleAddMedication,
  medicationList,
  dosageOptions,
  timeOptions,
  frequencyOptions,
}) => {
  return (
    <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Add Medication</Text>

        {/* Medication Name Picker */}
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Medication Name</Text>
          <RNPickerSelect
            onValueChange={(value) => setMedicationName(value)}
            items={medicationList.map((item) => ({ label: item, value: item }))}
            style={pickerSelectStyles}
            placeholder={{ label: "Select Medication", value: null }}
            useNativeAndroidPickerStyle={false}
          />
          <Ionicons name="ios-arrow-down" size={20} color="gray" style={styles.arrowIcon} />
        </View>

        {/* Dosage Picker */}
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Dosage</Text>
          <RNPickerSelect
            onValueChange={(value) => setDosage(value)}
            items={dosageOptions.map((item) => ({ label: item, value: item }))}
            style={pickerSelectStyles}
            placeholder={{ label: "Select Dosage", value: null }}
            useNativeAndroidPickerStyle={false}
          />
          <Ionicons name="ios-arrow-down" size={20} color="gray" style={styles.arrowIcon} />
        </View>

        {/* Time to Take Picker */}
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Time to Take</Text>
          <RNPickerSelect
            onValueChange={(value) => setTimeToTake(value)}
            items={timeOptions.map((item) => ({ label: item, value: item }))}
            style={pickerSelectStyles}
            placeholder={{ label: "Select Time", value: null }}
            useNativeAndroidPickerStyle={false}
          />
          <Ionicons name="ios-arrow-down" size={20} color="gray" style={styles.arrowIcon} />
        </View>

        {/* Frequency Picker */}
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Frequency</Text>
          <RNPickerSelect
            onValueChange={(value) => setFrequency(value)}
            items={frequencyOptions.map((item) => ({ label: item, value: item }))}
            style={pickerSelectStyles}
            placeholder={{ label: "Select Frequency", value: null }}
            useNativeAndroidPickerStyle={false}
          />
          <Ionicons name="ios-arrow-down" size={20} color="gray" style={styles.arrowIcon} />
        </View>

        <Button title="Add Medication" onPress={handleAddMedication} />
        <Button title="Cancel" onPress={() => setModalVisible(false)} />
      </View>
    </Modal>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 50,
    width: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    fontSize: 16,
    color: '#333',
  },
  inputAndroid: {
    height: 50,
    width: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    fontSize: 16,
    color: '#333',
  },
});

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  pickerContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  arrowIcon: {
    position: 'absolute',
    right: 10,
    top: 20,
  },
});

export default AddMedicationModal;
