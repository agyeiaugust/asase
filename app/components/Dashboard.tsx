import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Dashboard = ({ medications, setSelectedTime }) => {
  return (
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
                  <Text style={styles.medicationText}>
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
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridItem: {
    width: '45%',
    marginVertical: 10,
  },
  card: {
    backgroundColor: '#3b5998',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  cardText: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
  },
  medicationItem: {
    marginVertical: 10,
  },
  medicationText: {
    color: 'white',
    fontSize: 14,
  },
});

export default Dashboard;
