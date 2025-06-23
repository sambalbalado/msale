// ✅ app/listings/add.tsx
import { View, Text, TextInput, Pressable, Alert, Image, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useListings } from '../store/store';
import React from 'react';

export default function AddListingScreen() {
  const { addListing } = useListings();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImages((prev) => [...prev, uri]);
    }
  };

  const handleSubmit = () => {
    if (!title || !price || !description) {
      Alert.alert('Missing fields', 'Please fill in all fields.');
      return;
    }

    addListing({
      id: Date.now(),
      title,
      price,
      description,
      images,
      createdAt: Date.now(), // ✅ timestamp for auto-delete logic
    });

    Alert.alert('✅ Listed!', 'Your product has been added.');
    router.back();
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.backIcon}>
        <Ionicons name="arrow-back-circle-outline" size={28} color="#d4a373" />
      </Pressable>

      <Pressable onPress={handleSubmit} style={styles.submitIcon}>
        <Ionicons name="checkmark-circle-outline" size={28} color="#d4a373" />
      </Pressable>

      <Text style={styles.title}>Add New Listing</Text>

      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Price (e.g. RM 49.00)"
        value={price}
        onChangeText={setPrice}
        keyboardType="decimal-pad"
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Pressable onPress={pickImage} style={styles.imagePicker}>
        <Ionicons name="images-outline" size={24} color="#d4a373" />
        <Text style={{ marginLeft: 8, fontWeight: '500' }}>Add Image</Text>
      </Pressable>

      <FlatList
        horizontal
        data={images}
        keyExtractor={(uri) => uri}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.previewImage} />
        )}
        contentContainerStyle={{ marginVertical: 12 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fef6e4',
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#272727',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitIcon: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 10,
  },
  backIcon: {
    position: 'absolute',
    top: 60,
    left: 24,
    zIndex: 10,
  },
  imagePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
});
