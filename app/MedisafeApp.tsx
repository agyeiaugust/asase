import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Button, ScrollView, Animated, Alert, Image } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker'; // Picker import

const MedisafeApp: React.FC = ({ navigation }) => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  const [medicationName, setMedicationName] = useState('');
  const [dosage, setDosage] = useState('');
  const [timeToTake, setTimeToTake] = useState('');
  const [frequency, setFrequency] = useState('');
  const [medications, setMedications] = useState({
    
    Morning: [],
    Afternoon: [],
    Evening: [],
    Night: [],
  });

  const animation = useState(new Animated.Value(-250))[0];
  const [notificationCount, setNotificationCount] = useState(0);


  // Predefined list of medication options
  const medicationOptions = [
    'Select Medcine',
    'Aspirin',

    'Ibuprofen',
    'Paracetamol',
    'Metformin',
    'Omeprazole',
    'Simvastatin',
  ];

  
  // Sample data for medicine products with local images
  const medicines = [
    {
      name: 'Aspirin',
      description: 'Used to reduce fever, pain, and inflammation.',
      dosage: '500 mg',
      imageUrl: require('./assets/medicines/aspirin.jpg'), // Local image
    },
    {
      name: 'Paracetamol',
      description: 'Pain reliever and a treatment for fever.',
      dosage: '650 mg',
      imageUrl: require('./assets/medicines/paracetamol.jpg'), // Local image
    },
    {
      name: 'Ibuprofen',
      description: 'Anti-inflammatory and pain relief.',
      dosage: '200 mg',
      imageUrl: require('./assets/medicines/ibuprofen.jpg'), // Local image
    },
    // Add more medicines as needed
  ];



  // Predefined dosage options
  const dosageOptions = ['choose dosage', '10mg', '20mg', '50mg', '100mg'];

  // Predefined frequency options
  const frequencyOptions = ['choose frequency', 'Once a day', 'Twice a day', 'Three times a day'];

  useEffect(() => {
    const loadMedications = async () => {
      try {
        const storedMedications = await AsyncStorage.getItem('medications');
        if (storedMedications) {
          setMedications(JSON.parse(storedMedications));
        }
      } catch (error) {
        console.error('Failed to load medications', error);
      }
    };
    loadMedications();
  }, []);

  useEffect(() => {
    const saveMedications = async () => {
      try {
        await AsyncStorage.setItem('medications', JSON.stringify(medications));
      } catch (error) {
        console.error('Failed to save medications', error);
      }
    };
    saveMedications();
  }, [medications]);

  const toggleSidebar = () => {
    Animated.timing(animation, {
      toValue: sidebarVisible ? -250 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setSidebarVisible(!sidebarVisible);
  };

  const handleAddMedication = () => {
    if (!medicationName || !dosage || !timeToTake || !frequency) {
      Alert.alert('Error', 'Please fill out all fields');
      return;
    }
  
    const validTimes = ['Morning', 'Afternoon', 'Evening', 'Night'];
    if (!validTimes.includes(timeToTake)) {
      Alert.alert('Error', 'Invalid time to take');
      return;
    }
  
    const newMedication = {
      name: medicationName,
      dosage,
      timeToTake,
      frequency,
      taken: false,
      takenAt: null,
    };
  
    // Add medication to the correct time slot (based on timeToTake)
    setMedications((prevMedications) => {
      const updatedMedications = { ...prevMedications };
      updatedMedications[timeToTake].push(newMedication);
      return updatedMedications;
    });
  
    // Increment notification count
    setNotificationCount((prevCount) => prevCount + 1);
  
    Alert.alert('Success', `${medicationName} added to ${timeToTake}`);
    setModalVisible(false);
    setMedicationName('');
    setDosage('');
    setTimeToTake('');
    setFrequency('');
  };
  
  const handleEditMedication = (index: number, time: string) => {
    const medicationToEdit = medications[time][index];
    setMedicationName(medicationToEdit.name);
    setDosage(medicationToEdit.dosage);
    setTimeToTake(medicationToEdit.timeToTake);
    setFrequency(medicationToEdit.frequency);
    setModalVisible(true); // Open the modal to edit the medication
  };

  const handleDeleteMedication = (index: number, time: string) => {
    const updatedMedications = { ...medications };
    updatedMedications[time].splice(index, 1); // Remove the medication
    setMedications(updatedMedications);
    Alert.alert('Success', 'Medication deleted');
  };

  const handleMarkAsTaken = (index: number, time: string) => {
    const updatedMedications = { ...medications };
    const selectedMedication = updatedMedications[time][index];
    selectedMedication.taken = !selectedMedication.taken;
    updatedMedications[time][index] = selectedMedication;
    setMedications(updatedMedications);
  };

  const renderDashboardContent = () => (
    <View style={styles.grid}>
      {['Morning', 'Afternoon', 'Evening', 'Night'].map((time) => (
        <View key={time} style={styles.gridItem}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => setSelectedTime(time)} // Set the time when the box is clicked to add medication
          >
            <Text style={styles.cardText}>{time} Medications</Text>
            {medications[time].length > 0 ? (
              medications[time].map((med, index) => (
                <View key={index} style={styles.medicationItem}>
                  <Text
                    style={[
                      styles.medicationText,
                      med.taken && { textDecorationLine: 'line-through', color: 'gray' }, // Strike-through for taken meds
                    ]}
                  >
                    {med.name} - {med.dosage} - {med.timeToTake} - {med.frequency}
                  </Text>
                  <View style={styles.medicationActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleEditMedication(index, time)}
                    >
                      <Ionicons name="pencil" size={20} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleDeleteMedication(index, time)}
                    >
                      <Ionicons name="trash" size={20} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        med.taken ? { backgroundColor: 'green' } : { backgroundColor: 'orange' },
                      ]}
                      onPress={() => handleMarkAsTaken(index, time)}
                    >
                      <FontAwesome name="check" size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.medicationText}>No medications added</Text>
            )}
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  const renderUpdatesContent = () => (
    <ScrollView contentContainerStyle={styles.updatesContainer}>
      {medicines.map((med, index) => (
        <View key={index} style={styles.medicationCard}>
          <Image source={med.imageUrl} style={styles.medicationImage} />
          <Text style={styles.medicationName}>{med.name}</Text>
          <Text style={styles.medicationDescription}>{med.description}</Text>
          <Text style={styles.medicationDosage}>Dosage: {med.dosage}</Text>
          <TouchableOpacity style={styles.learnMoreButton}>
            <Text style={styles.learnMoreText}>Learn More</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );

  const renderReportsContent = () => (
    <View>
      <Text>Reports Page</Text>
      {/* Add your reports content here */}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topbar}>
  <TouchableOpacity onPress={toggleSidebar} style={styles.iconButton}>
    <Ionicons name="person-circle-outline" size={50} color="white" />
  </TouchableOpacity>
  <Text style={styles.title}>EasyMedTrack</Text>
  <View style={styles.iconGroup}>
    <TouchableOpacity onPress={toggleSidebar} style={styles.iconButton}>
      <Ionicons name={sidebarVisible ? 'close' : 'menu'} size={30} color="white" />
    </TouchableOpacity>
    
    {/* Notification Button */}
    <TouchableOpacity onPress={() => console.log('Notifications Clicked')} style={styles.iconButton}>
      <View style={styles.notificationIconContainer}>
        <Ionicons name="notifications" size={30} color="white" />
        {notificationCount > 0 && (
          <View style={styles.notificationCountContainer}>
            <Text style={styles.notificationCountText}>{notificationCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>

    <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.iconButton}>
      <Ionicons name="add-circle-outline" size={30} color="white" />
    </TouchableOpacity>
  </View>
</View>

      {/* Animated Sidebar */}
      <Animated.View style={[styles.sidebar, { transform: [{ translateX: animation }] }]}>
        <TouchableOpacity style={styles.sidebarItem} onPress={() => setCurrentPage('dashboard')}>
          <Text style={styles.sidebarText}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sidebarItem} onPress={() => setCurrentPage('profileManagement')}>
          <Text style={styles.sidebarText}>Profile Management</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sidebarItem} onPress={() => setCurrentPage('logouts')}>
          <Text style={styles.sidebarText}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Modal for Adding/Editing Medication */}
      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add Medication</Text>

          {/* Medication Name Picker */}
          <Text style={styles.inputLabel}>Medication Name</Text>
          <Picker
            selectedValue={medicationName}
            style={styles.picker}
            onValueChange={(itemValue) => setMedicationName(itemValue)}
          >
            {medicationOptions.map((medication, index) => (
              <Picker.Item label={medication} value={medication} key={index} />
            ))}
          </Picker>

          {/* Dosage Picker */}
          <Text style={styles.inputLabel}>Dosage</Text>
          <Picker
            selectedValue={dosage}
            onValueChange={(itemValue) => setDosage(itemValue)}
            style={styles.picker}
          >
            {dosageOptions.map((dosageOption, index) => (
              <Picker.Item label={dosageOption} value={dosageOption} key={index} />
            ))}
          </Picker>

          {/* Time to Take Picker */}
          <Text style={styles.inputLabel}>Time to Take</Text>
          <Picker
            selectedValue={timeToTake}
            onValueChange={(itemValue) => setTimeToTake(itemValue)}
            style={styles.picker}
          >
            
            <Picker.Item label="Morning" value="Morning" />
            <Picker.Item label="Afternoon" value="Afternoon" />
            <Picker.Item label="Evening" value="Evening" />
            <Picker.Item label="Night" value="Night" />
          </Picker>

          {/* Frequency Picker */}
          <Text style={styles.inputLabel}>Frequency</Text>
          <Picker
            selectedValue={frequency}
            onValueChange={(itemValue) => setFrequency(itemValue)}
            style={styles.picker}
          >
            {frequencyOptions.map((frequencyOption, index) => (
              <Picker.Item label={frequencyOption} value={frequencyOption} key={index} />
            ))}
          </Picker>

          <Button title="Add Medication" onPress={handleAddMedication} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {currentPage === 'dashboard' && renderDashboardContent()}
        {currentPage === 'updates' && renderUpdatesContent()}
        {currentPage === 'reports' && renderReportsContent()}
      </ScrollView>

      {/* Footer with Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={() => setCurrentPage('dashboard')}>
          <Text style={styles.footerButtonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => setCurrentPage('updates')}>
          <Text style={styles.footerButtonText}>Updates</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => setCurrentPage('reports')}>
          <Text style={styles.footerButtonText}>Reports</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MedisafeApp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  topbar: {
    backgroundColor: '#3b5998',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 1,
    elevation: 3,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  iconButton: {
    marginLeft: 10,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#3b5998',
    width: 250,
    height: '100%',
    paddingTop: 60,
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderColor: '#ccc',
    zIndex: 10, 
  
  
  },
  sidebarItem: {
    padding: 15,
    marginVertical: 5,
  },
  sidebarText: {
    color: 'white',
    fontSize: 18,
  },
  contentContainer: {
    padding: 15,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
  },
  footerButton: {
    padding: 10,
  },
  footerButtonText: {
    color: 'blue',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridItem: {
    width: '45%',
    marginBottom: 20,
  },
  medicationItem: {
    marginBottom: 10,
  },
  medicationText: {
    fontSize: 16,
  },
  medicationActions: {
    flexDirection: 'row',
    marginTop: 5,
  },
  actionButton: {
    backgroundColor: '#3b5998',
    padding: 5,
    borderRadius: 5,
    marginRight: 5,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 20,
    marginBottom: 5,
  },
  picker: {
    marginBottom: 20,
  },

  updatesContainer: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  medicationCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  medicationImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  medicationName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  medicationDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  medicationDosage: {
    fontSize: 14,
    marginBottom: 10,
  },
  learnMoreButton: {
    backgroundColor: '#3b5998',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  learnMoreText: {
    color: 'white',
    fontSize: 16,
  },
  
  
  iconGroup: {
    flexDirection: 'row',  // Ensure the icons are placed horizontally
    alignItems: 'center',  // Align them vertically centered
  },

  notificationIconContainer: {
    position: 'relative',
    marginRight: 7,
    flexDirection: 'row',
  },
  notificationCountContainer: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 8,
    height: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  

});
