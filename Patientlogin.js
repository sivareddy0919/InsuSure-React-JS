import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import Ionicons from 'react-native-vector-icons/Ionicons'; // Correct import
import Config from './Config'; // Correct import for default export

const PatientLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation(); // Initialize navigation hook

  const handleLogin = () => {
    const loginApiUrl = `${Config.API_BASE_URL}/patientlogin.php`;

    fetch(loginApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Login Response:', data);
        if (data.status === 'success') {
          Alert.alert('Login successful!');
          setUsername('');
          setPassword('');
          // Replace the current screen with Patientdashboard
          navigation.replace('Patientdashboard', { username });
        } else {
          Alert.alert('Invalid username or password. Please try again.');
        }
      })
      .catch(error => {
        console.error('Fetch Error:', error);
        Alert.alert('Login failed. Please try again later.');
      });
  };

  const handleSignup = () => {
    // Navigate to PatientSignup screen
    navigation.navigate('Patientsignup');
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.topContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Interphase')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={30} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.heading}>Patient Login</Text>
      </View>
      <Image source={require('./assets/scroll3.png')} style={styles.Image} />
      <View style={styles.backgroundContainer}>
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={text => setUsername(text)}
              placeholderTextColor="#000000"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry={true}
              value={password}
              onChangeText={text => setPassword(text)}
              placeholderTextColor="#000000"
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSignup}>
            <Text style={styles.signupText}>
              Don't have an account? <Text style={styles.signupLink}>Sign up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topContainer: {
    paddingTop: windowHeight * 0.02,
    paddingHorizontal: windowWidth * 0.05,
    backgroundColor: '#603F83FF',
    height: windowHeight * 0.10, // Adjust height as needed
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row', // Align items horizontally
  },
  backButton: {
    position: 'absolute',
    left: windowWidth * 0.08, // Adjust the left margin
    top: windowHeight * 0.04,
  },
  backgroundContainer: {
    backgroundColor: '#F0F0F0', // Background color for the container
    justifyContent: 'center',
    width: '90%', // Adjust width as needed
    height: windowHeight * 0.4, // Set to 70% of screen height
    bottom:'-33%',
    borderRadius:windowWidth*0.06,
    left:windowWidth*0.05,
    top:windowHeight *0.00,
  },
  container: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: windowHeight * 0.001,
    marginTop: windowHeight * 0.01,
    left:windowWidth*0.09,
  },
  input: {
    fontSize: 18, // Adjust the font size as needed
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: windowHeight * 0.03,
    width: '100%',
    backgroundColor: '#F9F9F9', // Light grey background color
  },
  button: {
    backgroundColor: '#603F83FF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: windowWidth * 0.1,
    marginBottom: windowHeight * 0.03,
    left:windowWidth*0.07,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  signupText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight:'bold',
    left:windowWidth*0.09,
  },
  signupLink: {
    color: '#000000',
    textDecorationLine: 'underline',
  },
  heading: {
    fontSize: 24, // Adjust the font size as needed
    fontWeight: 'bold',
    color:'#FFFFFF',
    left:windowWidth*0.03,
    marginTop: windowHeight * -0.01,
  },
  Image: {
    width: windowWidth * 0.9,
    height: windowHeight * 0.3,
    resizeMode: 'contain', // Adjust the image size and aspect ratio
    alignSelf: 'center',
    marginTop: windowHeight * 0.02,
    marginBottom: windowHeight * 0.02, // Adjust margin as needed
  },
});

export default PatientLogin;
