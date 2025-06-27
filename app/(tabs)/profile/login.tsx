import React, { useState } from 'react';
import { StatusBar, View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import { Ionicons } from '@expo/vector-icons'; // Import an icon library for the eye icon

const login = () => {
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.subTitle}>Login to view profile</Text>
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={(values) => {
          if (values.username && values.password) {
            Alert.alert('Login Successful', `Welcome, ${values.username}!`);
          } else {
            Alert.alert('Login Failed', 'Please enter both username and password.');
          }
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <View>
            <TextInput
              style={styles.input}
              placeholder="Username"
              onChangeText={handleChange('username')}
              onBlur={handleBlur('username')}
              value={values.username}
            />
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Password"
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                secureTextEntry={!showPassword} // Toggle visibility
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)} // Toggle state
              >
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'} // Change icon based on state
                  size={22}
                  marginTop={-5} // Adjust vertical alignment
                  color="#555"
                />
              </TouchableOpacity>
            </View>
            <Button title="Login" onPress={handleSubmit as any} />
          </View>
        )}
      </Formik>
    </View>
  );
};

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
  subTitle: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  passwordContainer: {
    position: 'relative',
    width: '100%',
  },
  passwordInput: {
    paddingRight: 30, // Add padding to make space for the eye icon
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 14,
  },
});

export default login;