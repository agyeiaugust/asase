// src/components/Footer.tsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface FooterProps {
  showDashboard: () => void;
  showUpdates: () => void;
  showReports: () => void;
}

const Footer: React.FC<FooterProps> = ({ showDashboard, showUpdates, showReports }) => (
  <View style={styles.footer}>
    <TouchableOpacity style={styles.footerButton} onPress={showDashboard}>
      <Text style={styles.footerButtonText}>Home</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.footerButton} onPress={showUpdates}>
      <Text style={styles.footerButtonText}>Updates</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.footerButton} onPress={showReports}>
      <Text style={styles.footerButtonText}>Reports</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: 'white',
  },
  footerButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#2e3f4f',
    borderRadius: 5,
  },
  footerButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Footer;
