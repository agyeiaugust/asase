// src/components/TopBar.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TopBarProps {
  toggleSidebar: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ toggleSidebar }) => (
  <View style={styles.topbar}>
    <TouchableOpacity onPress={toggleSidebar} style={styles.iconButton}>
      <Ionicons name="person-circle-outline" size={50} color="white" />
    </TouchableOpacity>
    <Text style={styles.title}>Medisafe</Text>
    <View style={styles.iconGroup}>
      <TouchableOpacity onPress={toggleSidebar} style={styles.iconButton}>
        <Ionicons name="menu" size={30} color="white" />
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
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
  iconGroup: {
    flexDirection: 'row',
  },
});

export default TopBar;
