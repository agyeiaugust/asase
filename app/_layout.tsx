import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Slot, useRouter } from 'expo-router'; // Slot to render current page content

const Layout = () => {
  const router = useRouter();

  // Simulate a check for whether the user is logged in
  // In a real app, you would check user authentication status (e.g., from AsyncStorage or Context)
  const isAuthenticated = false; // Replace with your authentication check

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login'); // Redirect to login page if not authenticated
    }
  }, [isAuthenticated, router]);

  return (
    <View style={styles.container}>
      <Slot /> {/* Renders the current page content */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default Layout;
