// ✅ app/(tabs)/product.tsx
import { View, Text, StyleSheet, FlatList, Image, Alert, Pressable } from 'react-native';
import { useListings } from '../store/store';

export default function ProductScreen() {
  const { listings, removeListing } = useListings();
  const now = Date.now();

  // Filter only listings from the last 7 days
  const filteredListings = listings.filter(
    (item) => now - item.createdAt < 7 * 24 * 60 * 60 * 1000
  );

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
              <Text style={styles.productName}>{item.title}</Text>
              <Text style={styles.price}>RM {item.price}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fef6e4',
    paddingTop: 80,
    paddingHorizontal: 24,
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
});