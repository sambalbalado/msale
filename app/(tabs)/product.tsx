import { View, Text, StyleSheet, FlatList, Image, Pressable, Alert } from 'react-native';
import { useListings } from '../store/store';
import { Ionicons } from '@expo/vector-icons';

export default function ProductScreen() {
  const { listings, removeListing } = useListings();
  const now = Date.now();

  // ✅ Filter listings less than 7 days old
  const filteredListings = listings.filter(
    (item) =>
      typeof item.createdAt === 'number' &&
      now - item.createdAt < 7 * 24 * 60 * 60 * 1000
  );

  const handleDelete = (id: number) => {
    Alert.alert('Delete Listing', 'Are you sure you want to delete this listing?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeListing(id) },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Products</Text>

      {filteredListings.length === 0 ? (
        <Text style={styles.emptyText}>You have no active listings.</Text>
      ) : (
        <FlatList
          data={filteredListings}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {Array.isArray(item.images) && item.images.length > 0 && (
                <Image source={{ uri: item.images[0] }} style={styles.image} />
              )}
              <Text style={styles.price}>RM {item.price}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <Pressable onPress={() => handleDelete(item.id)} style={styles.trash}>
                <Ionicons name="trash-outline" size={20} color="#d90429" />
              </Pressable>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 60 }}
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
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#272727',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#555',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 8,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },
  price: {
    fontWeight: 'bold',
    color: 'green',
    fontSize: 18,
  },
  description: {
    color: '#333',
    fontSize: 16,
    marginTop: 4,
  },
  trash: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});
