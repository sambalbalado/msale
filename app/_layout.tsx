import { Slot } from 'expo-router';
import { ListingProvider } from './store/store'; // ✅ correct
import React from 'react';

export default function RootLayout() {
  return (
    <ListingProvider>
      <Slot />
    </ListingProvider>
  );
}