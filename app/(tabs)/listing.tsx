import { View, Text, StyleSheet, Pressable, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useListings } from '../store/store';

export default function ListingScreen() {
  const { listings } = useListings();
  const router = useRouter();

  const hasListings = listings.length > 0;

  return (
    <View style={styles.container}>
      {/* ✅ Top-right add icon */}
      <Pressable onPress={() => router.push('/listings/add')} style={styles.topAdd}>
        <Ionicons name="add-circle-outline" size={28} color="#d4a373" />
      </Pressable>

      <Text style={styles.title}>Listings</Text>

      {hasListings ? (
        <FlatList
          data={listings}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {item.images?.length > 0 && (
                <Image source={{ uri: item.images[0] }} style={styles.image} />
              )}
              <Text style={styles.price}>RM {item.price}</Text>
              <Text style={styles.desc}>{item.description}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.empty}>
          You have no listings at the moment.{"\n"}To add items, press the + button below.
        </Text>
      )}

      {/* ✅ Add Listing button at bottom */}
      {!hasListings && (
        <Pressable onPress={() => router.push('/listings/add')} style={styles.bottomButton}>
          <Ionicons name="add-circle" size={24} color="#fff" />
          <Text style={styles.bottomText}>Add New Listing</Text>
        </Pressable>
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
  topAdd: {
    position: 'absolute',
    top: 89,
    right: 24,
    zIndex: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#272727',
    marginBottom: 20,
  },
  empty: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 10,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2a9d8f',
  },
  desc: {
    fontSize: 14,
    color: '#555',
    marginTop: 6,
  },
  bottomButton: {
    flexDirection: 'row',
    backgroundColor: '#d4a373',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  bottomText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
});