import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Button, ScrollView, Animated, Alert } from 'react-native';
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
  const [notificationCount, setNotificationCount] = useState(0);  // State for notification count

  const animation = useState(new Animated.Value(-250))[0];

  // Predefined list of medication options
  const medicationOptions = [
    'Aspirin',
    'Ibuprofen',
    'Paracetamol',
    'Metformin',
    'Omeprazole',
    'Simvastatin',
  ];

  // Predefined dosage options
  const dosageOptions = ['10mg', '20mg', '50mg', '100mg'];

  // Predefined frequency options
  const frequencyOptions = ['Once a day', 'Twice a day', 'Three times a day'];

  useEffect(() => {
    const loadMedications = async () => {
      try {
        const storedMedications = await AsyncStorage.getItem('medications');
        if (storedMedications) {
          setMedications(JSON.parse(storedMedications));
          updateNotificationCount(JSON.parse(storedMedications));
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

  const updateNotificationCount = (medications: any) => {
    const totalCount = Object.values(medications).reduce(
      (total, timeSlot) => total + timeSlot.length,
      0
    );
    setNotificationCount(totalCount);
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

    setMedications((prevMedications) => {
      const updatedMedications = { ...prevMedications };
      updatedMedications[timeToTake].push(newMedication);
      updateNotificationCount(updatedMedications);  // Update notification count
      return updatedMedications;
    });

    Alert.alert('Success', `${medicationName} added to ${timeToTake}`);
    setModalVisible(false);
    setMedicationName('');
    setDosage('');
    setTimeToTake('');
    setFrequency('');
  };

  const renderDashboardContent = () => (
    <View style={styles.grid}>
      {['Morning', 'Afternoon', 'Evening', 'Night'].map((time) => (
        <View key={time} style={styles.gridItem}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => setSelectedTime(time)} 
          >
            <Text style={styles.cardText}>{time} Medications</Text>
            {medications[time].length > 0 ? (
              medications[time].map((med, index) => (
                <View key={index} style={styles.medicationItem}>
                  <Text
                    style={[styles.medicationText, med.taken && { textDecorationLine: 'line-through', color: 'gray' }]}
                  >
                    {med.name} - {med.dosage} - {med.timeToTake} - {med.frequency}
                  </Text>
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

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topbar}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.iconButton}>
          <Ionicons name="person-circle-outline" size={50} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Medisafe</Text>
        <View style={styles.iconGroup}>
          <TouchableOpacity onPress={toggleSidebar} style={styles.iconButton}>
            <Ionicons name={sidebarVisible ? 'close' : 'menu'} size={30} color="white" />
          </TouchableOpacity>
          {/* Notification Icon */}
          <TouchableOpacity onPress={() => console.log("Notification clicked")} style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={30} color="white" />
            {notificationCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>{notificationCount}</Text>
              </View>
            )}
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
        <TouchableOpacity style={styles.sidebarItem} onPress={() => setCurrentPage('pillManagement')}>
          <Text style={styles.sidebarText}>Pill Management</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sidebarItem} onPress={() => setCurrentPage('reports')}>
          <Text style={styles.sidebarText}>Reports</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Modal for Adding/Editing Medication */}
      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add Medication</Text>

          {/* Medication Name Picker */}
          <Text style={styles.inputLabel}>Medication Name</Text>
          <Picker selectedValue={medicationName} style={styles.picker} onValueChange={(itemValue) => setMedicationName(itemValue)}>
            {medicationOptions.map((medication, index) => (
              <Picker.Item label={medication} value={medication} key={index} />
            ))}
          </Picker>

          {/* Dosage Picker */}
          <Text style={styles.inputLabel}>Dosage</Text>
          <Picker selectedValue={dosage} onValueChange={(itemValue) => setDosage(itemValue)} style={styles.picker}>
            {dosageOptions.map((dosageOption, index) => (
              <Picker.Item label={dosageOption} value={dosageOption} key={index} />
            ))}
          </Picker>

          {/* Time to Take Picker */}
          <Text style={styles.inputLabel}>Time to Take</Text>
          <Picker selectedValue={timeToTake} onValueChange={(itemValue) => setTimeToTake(itemValue)} style={styles.picker}>
            <Picker.Item label="Morning" value="Morning" />
            <Picker.Item label="Afternoon" value="Afternoon" />
            <Picker.Item label="Evening" value="Evening" />
            <Picker.Item label="Night" value="Night" />
          </Picker>

          {/* Frequency Picker */}
          <Text style={styles.inputLabel}>Frequency</Text>
          <Picker selectedValue={frequency} onValueChange={(itemValue) => setFrequency(itemValue)} style={styles.picker}>
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
    paddingHorizontal: 15,
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
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
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
    backgroundColor: '#3b5998',
    paddingVertical: 10,
  },
  footerButton: {
    padding: 10,
  },
  footerButtonText: {
    color: 'white',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  picker: {
    width: '100%',
    marginBottom: 15,
  },
});

