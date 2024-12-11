import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Config from './Config'; 

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

const IndividualinsulinEntry = ({ navigation }) => {
  const route = useRoute();
  const { username, datetime, sugar_concentration, note, unit, session, insulinintake } = route.params;

  const [insulinIntake, setInsulinIntake] = useState(insulinintake || '');

  const handleUpdateInsulinIntake = async () => {
    if (!insulinIntake.trim()) {
      Alert.alert('Error', 'Please enter the insulin intake value.');
      return;
    }

    try {
      const params = {
        username: username,
        datetime: datetime,
        sugar_concentration: sugar_concentration,
        note: note,
        unit: unit,
        session: session,
        insulinintake: insulinIntake
      };

      console.log('Sending parameters:', params); // Log the parameters

      const response = await axios.post(`${Config.API_BASE_URL}/IndividualinsulinEntry.php`, params);

      console.log('API response:', response.data); // Log the response to inspect its structure

      if (response.data && response.data.status === "success") {
        Alert.alert('Success', response.data.message);
        navigation.goBack();
      } else {
        Alert.alert('Error', response.data ? response.data.message : 'Unexpected response structure');
      }
    } catch (error) {
      console.error('Error updating insulin intake:', error);
      Alert.alert('Error', `Failed to update insulin intake: ${error.message}`);
    }
  };

  const navigateToGraphScreen = () => {
    navigation.navigate('CheckGraph', { 
      username: username, 
      date: datetime,
      sugar_concentration: sugar_concentration,
      insulinintake: insulinIntake
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={windowWidth * 0.07} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.heading}>Insulin Entry Details</Text>
      </View>
      <View style={styles.dataContainer}>
        <Text style={styles.valueText}>Username: {username}</Text>
        <Text style={styles.valueText}>Date: {datetime}</Text>
        <Text style={styles.valueText}>Note: {note}</Text>
        <Text style={styles.valueText}>Session: {session}</Text>
        <Text style={styles.valueText}>Sugar Concentration: {`${sugar_concentration} ${unit}`}</Text>
        <Text style={styles.valueText}>Insulin Intake:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter the Insulin intake value in Units"
          placeholderTextColor='#603F83FF'
          value={insulinIntake}
          onChangeText={setInsulinIntake}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleUpdateInsulinIntake}>
            <Text style={styles.buttonText}>Add Insulin Level</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={navigateToGraphScreen}>
            <Text style={styles.buttonText}>View Graph</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: windowWidth * 0.05,
    backgroundColor: '#fff',
  },
  topContainer: {
    marginBottom: windowHeight * 0.02,
    backgroundColor: '#603F83FF',
    padding: windowHeight * 0.00,
    height: windowHeight * 0.10,
    width: '120%',
    marginTop: windowHeight * -0.026,
    right: windowWidth * 0.1,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',  // Align items in the center vertically
  },
  backButton: {
    left: windowWidth * 0.15,
    marginTop: windowHeight * 0.01, 
     // Adjust left margin as needed
  },
  dataContainer: {
    backgroundColor: '#603F83FF',
    padding: windowHeight * 0.02,
    borderRadius: 10,
    height: windowWidth * 0.85,  // Adjust height as needed
    width: windowWidth * 0.9,  // Adjust width as needed
    alignSelf: 'center',  // Center the container horizontally
  },
  heading: {
    fontSize: windowWidth * 0.06,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
    marginLeft: windowWidth * 0.22,  // Adjust to align with the back button
    marginTop: windowHeight * 0.01, 
  },
  valueText: {
    fontSize: windowWidth * 0.04,
    marginLeft: windowWidth * 0.03,
    color: '#FFFFFF',
    marginBottom: windowHeight * 0.009,
  },
  input: {
    marginTop: windowHeight * 0.01,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: windowWidth * 0.03,
    paddingVertical: windowHeight * 0.01,
    backgroundColor: '#FFFFFF',  // Added background color
    color: '#603F83FF',  // Text color inside the input
    fontSize: windowWidth * 0.04,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: windowHeight * 0.02,
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: windowHeight * 0.015,
    paddingHorizontal: windowWidth * 0.04,
    borderRadius: 10,
    alignItems: 'center',
    width: '48%',  // Adjust width as needed
  },
  buttonText: {
    color: '#603F83FF',
    fontSize: windowWidth * 0.035,
    fontWeight: 'bold',
  },
});

export default IndividualinsulinEntry;
