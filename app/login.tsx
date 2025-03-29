import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ImageBackground, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

// Email Validation Regex
const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailRegex.test(email);
};

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [errorMessage, setErrorMessage] = useState(''); // Error message state
  const router = useRouter();

  // Handle login
  const handleLogin = async () => {
    setIsLoading(true);
    setErrorMessage('');
    const savedUsername = await AsyncStorage.getItem('username');
    const savedPassword = await AsyncStorage.getItem('password');

    if (username === savedUsername && password === savedPassword) {
      router.push('/MedisafeApp');
    } else {
      setErrorMessage('Invalid credentials');
    }
    setIsLoading(false);
  };

  // Handle sign-up
  const handleSignUp = async () => {
    setIsLoading(true);
    setErrorMessage('');

    // Validation checks
    if (!username || !password || !confirmPassword || !email || !fullName) {
      setErrorMessage('All fields are required');
      setIsLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords don't match");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    // Save user details in AsyncStorage
    await AsyncStorage.setItem('username', username);
    await AsyncStorage.setItem('password', password);
    await AsyncStorage.setItem('email', email);
    await AsyncStorage.setItem('fullName', fullName);

    alert('Sign up successful! You can now log in.');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setEmail('');
    setFullName('');
    setIsSignUp(false);
    setIsLoading(false); // Stop loading
  };

  return (
    <ImageBackground
      source={require('./assets/medicines/paracetamol.jpg')} // Replace with your image URL
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.heading}>{isSignUp ? 'Sign Up' : 'EasyMedTrack Login'}</Text>

        <View style={styles.inputContainer}>
          {/* Full Name Input - Only for Sign Up */}
          {isSignUp && (
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color="#555" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#555"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>
          )}

          {/* Email Input - Only for Sign Up */}
          {isSignUp && (
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color="#555" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#555"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          )}

          {/* Username Input */}
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={20} color="#555" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#555"
              value={username}
              onChangeText={setUsername}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color="#555" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              placeholderTextColor="#555"
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* Confirm Password Input - Only for Sign Up */}
          {isSignUp && (
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#555" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                secureTextEntry
                placeholderTextColor="#555"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>
          )}
        </View>

        {/* Displaying error message */}
        {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}

        {/* Loading Indicator */}
        {isLoading ? (
          <ActivityIndicator size="large" color="#28a745" />
        ) : (
          <>
            {isSignUp ? (
              <TouchableOpacity style={styles.loginButton} onPress={handleSignUp}>
                <Text style={styles.loginButtonText}>Sign Up</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        {/* Toggle between Login and Sign Up */}
        <Text style={styles.toggleText}>
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <Text
            style={styles.link}
            onPress={() => setIsSignUp(!isSignUp)} // Toggle between sign up and login
          >
            {isSignUp ? 'Login' : 'Sign Up'}
          </Text>
        </Text>

        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 16,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingLeft: 8,
  },
  icon: {
    marginRight: 10,
  },
  loginButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    width: '100%',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPassword: {
    color: '#fff',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  toggleText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 10,
  },
  link: {
    color: '#28a745',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  errorMessage: {
    color: 'red',
    fontSize: 14,
    marginTop: 10,
  },
});

export default LoginScreen;
