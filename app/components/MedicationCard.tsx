// src/components/MedicationCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

interface MedicationCardProps {
  name: string;
  description: string;
  dosage: string;
  imageUrl: any;
}

const MedicationCard: React.FC<MedicationCardProps> = ({ name, description, dosage, imageUrl }) => (
  <View style={styles.medicationCard}>
    <Image source={imageUrl} style={styles.medicationImage} />
    <Text style={styles.medicationName}>{name}</Text>
    <Text style={styles.medicationDescription}>{description}</Text>
    <Text style={styles.medicationDosage}>Dosage: {dosage}</Text>
    <TouchableOpacity style={styles.learnMoreButton}>
      <Text style={styles.learnMoreText}>Learn More</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
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
});

export default MedicationCard;
