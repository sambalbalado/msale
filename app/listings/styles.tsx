import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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