import { Slot } from 'expo-router';
import { ListingProvider } from './store/store'; // ✅ correct

export default function RootLayout() {
  return (
    <ListingProvider>
      <Slot />
    </ListingProvider>
  );
}