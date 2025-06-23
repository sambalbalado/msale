import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useListings } from '../store/store';

export default function ListingTab() {
  const router = useRouter();
  const { listings, removeListing } = useListings();

  const handleDelete = (id: number) => {
    Alert.alert('Delete Listing', 'Are you sure you want to delete this listing?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeListing(id) },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Listings</Text>

      <Pressable onPress={() => router.push('/listings/add')} style={styles.addButton}>
        <Ionicons name="add-circle-outline" size={28} color="#d4a373" />
      </Pressable>

      {listings.length === 0 ? (
        <Text style={styles.emptyMessage}>
          You have no listings at the moment.{"\n"}
          To add items, press the + button in the top-right corner.
        </Text>
      ) : (
        <FlatList
          data={listings}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {Array.isArray(item.images) && item.images.length > 0 && (
                <Image source={{ uri: item.images[0] }} style={styles.image} />
              )}
              <Text style={styles.productName}>{item.title}</Text>
              <Text style={styles.price}>RM {item.price}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <Pressable onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
                <Ionicons name="trash-outline" size={22} color="red" />
              </Pressable>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fef6e4',
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#272727',
    marginBottom: 20,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  addButton: {
    position: 'absolute',
    top: 89,
    right: 24,
    zIndex: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: 'green',
    marginBottom: 4,
  },
  description: {
    fontSize: 15,
    color: '#555',
  },
  deleteButton: {
    marginTop: 8,
    alignSelf: 'flex-end',
  },
});