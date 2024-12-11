import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  Alert, 
  Image, 
  BackHandler 
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Correct import
import Config from './Config'; 

const DoctorLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = () => {
    // Perform the login logic here
    const loginApiUrl = `${Config.API_BASE_URL}/Doctorlogin.php?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;

    fetch(loginApiUrl, {
      method: 'GET', // Use GET method as per the PHP code
      headers: {
        'Content-Type': 'application/json',
      },
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
          setUsername(''); // Clear username
          setPassword(''); // Clear password
          navigation.navigate('Doctordashboard', { username }); // Pass username to dashboard screen
        } else {
          Alert.alert('Invalid username or password. Please try again.');
        }
      })
      .catch(error => {
        console.error('Login Error:', error);
        Alert.alert('Login failed. Please try again later.');
      });
  };

  const handleBackPress = () => {
    navigation.navigate('Interphase'); // Navigate explicitly to InterphaseScreen
    return true; // Prevent default back action
  };

  useFocusEffect(
    React.useCallback(() => {
      // Add event listener for the back button
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);

      return () => {
        // Remove event listener when screen is unfocused
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      };
    }, [])
  );



return (
  <View style={styles.mainContainer}>
    <View style={styles.topContainer}>
      <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
        <Ionicons name="arrow-back" size={windowWidth * 0.08} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={styles.heading}>Doctor Login</Text>
    </View>
    <Image source={require('./assets/scroll2.png')} style={styles.icon} />
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  topContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
    backgroundColor: '#603F83FF',
    paddingTop: windowHeight * 0.05,
    paddingHorizontal: windowWidth * 0.05,
    borderBottomWidth: 0,
    borderBottomColor: 'black',
    height: windowHeight * 0.10,
    flexDirection: 'row', // Add this to arrange the back button and title in a row
    alignItems: 'center',
    justifyContent: 'center', // Center the items
    zIndex: 1,
  },
  backButton: {
    position: 'absolute',
    left: windowWidth * 0.10,
    top: windowHeight * 0.035,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: windowHeight * -0.04,
    marginLeft: windowHeight * 0.03,
  },
  backgroundContainer: {
    backgroundColor: '#F0F0F0', // Background color for the container
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%', // Adjust width as needed
    height: windowHeight * 0.35, // Set to 40% of screen height
    borderRadius: windowWidth * 0.06,
    marginTop: windowHeight * 0.25,
    paddingHorizontal: windowWidth * 0.05,
    paddingBottom: windowHeight * 0.1,
    zIndex: 0,
  },
  container: {
    width: '100%',
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
    width: windowWidth * 0.9,
    height: windowWidth * 0.5,
    resizeMode: 'contain',
    top: windowHeight * 0.18,
    borderRadius: 10,
  },
  inputContainer: {
    width: '95%',
    marginBottom: windowHeight * 0.02,
  },
  input: {
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: windowHeight * 0.02,
    width: '100%',
    backgroundColor: '#F9F9F9',
    shadowRadius: 2,
  },
  button: {
    backgroundColor: '#603F83FF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: windowWidth * 0.1,
    marginBottom: windowHeight * -0.1,
    marginTop: windowHeight * 0.00,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default DoctorLogin;
