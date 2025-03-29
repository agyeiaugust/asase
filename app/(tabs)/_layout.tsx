// /app/(tabs)/_layout.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, Animated, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Sidebar from '../../components/Sidebar'; // Import Sidebar component

const Layout: React.FC = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('Dashboard');
  const animation = new Animated.Value(-250);

  const toggleSidebar = () => {
    Animated.timing(animation, {
      toValue: sidebarVisible ? -250 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setSidebarVisible(!sidebarVisible);
  };

  const onNavigate = (screen: string) => {
    setCurrentScreen(screen);
    setSidebarVisible(false); // Close the sidebar when navigating
  };

  useEffect(() => {
    setCurrentScreen('Dashboard'); // Default screen
  }, []);

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topbar}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.iconButton}>
          <Ionicons name="menu" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Medisafe</Text>
      </View>

      {/* Animated Sidebar */}
      {sidebarVisible && (
        <Animated.View
          style={[styles.sidebar, { transform: [{ translateX: animation }] }]}
        >
          <Sidebar onClose={toggleSidebar} onNavigate={onNavigate} />
        </Animated.View>
      )}

      {/* Main Content */}
      <View style={styles.content}>
        {currentScreen === 'Dashboard' && <Text>Dashboard Content</Text>}
        {currentScreen === 'Explore' && <Text>Explore Content</Text>}
        {/* Add more screens as needed */}
      </View>
    </View>
  );
};

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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Layout;
