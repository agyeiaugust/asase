import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Sidebar = ({ sidebarVisible, toggleSidebar, showDashboard, showPillManagement, showReports }) => {
  return (
    <View style={[styles.sidebar, { display: sidebarVisible ? 'flex' : 'none' }]}>
      <TouchableOpacity style={styles.sidebarItem} onPress={showDashboard}>
        <Text style={styles.sidebarText}>Dashboard</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem} onPress={showPillManagement}>
        <Text style={styles.sidebarText}>Pill Management</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem} onPress={showReports}>
        <Text style={styles.sidebarText}>Reports</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 250,
    height: '100%',
    backgroundColor: '#2e3f4f',
    paddingVertical: 20,
    zIndex: 1000,
  },
  sidebarItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  sidebarText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Sidebar;
