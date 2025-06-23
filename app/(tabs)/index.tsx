import React from 'react';
import { StyleSheet } from 'react-native';
import ProductScreen from './product'; // Import the ProductScreen component

export default function HomeScreen() {
  return (
    <ProductScreen /> // Render the ProductScreen component
  );
}

const styles = StyleSheet.create({
  // You can keep or remove these styles if they're no longer needed
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});