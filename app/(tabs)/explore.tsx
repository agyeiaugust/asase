// /app/(tabs)/explore.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Explore: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Explore Page</Text>
      {/* Add your explore content here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default Explore;
