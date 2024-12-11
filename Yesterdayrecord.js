import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native'; // Import useNavigation
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Config from './Config'; 

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Todayrecord = () => {
  const route = useRoute();
  const navigation = useNavigation(); // Get the navigation object
  const { username } = route.params;
  const [record, setRecord] = useState({
    beforeBreakfast: { sugar_concentration: '', unit: '', insulinintake: '' },
    beforeLunch: { sugar_concentration: '', unit: '', insulinintake: '' },
    beforeDinner: { sugar_concentration: '', unit: '', insulinintake: '' },
  });

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const today = new Date();
        let yesterday;
        
        if (today.getDate() === 1) {
          yesterday = new Date(today.getFullYear(), today.getMonth(), 0);
        } else {
          yesterday = new Date(today);
          yesterday.setDate(today.getDate() - 1);
        }
        
        const yesterdayDate = yesterday.toISOString().split('T')[0];

        const response = await axios.get(`${Config.API_BASE_URL}/Todayrecord.php?username=${username}&date=${yesterdayDate}`);
        console.log('Response data:', response.data); // Log the response to see the structure
        const data = response.data;

        if (Array.isArray(data)) {
          const beforeBreakfast = data.find(item => item.session === 'Before Breakfast') || {};
          const beforeLunch = data.find(item => item.session === 'Before Lunch') || {};
          const beforeDinner = data.find(item => item.session === 'Before Dinner') || {};

          setRecord({
            beforeBreakfast: {
              sugar_concentration: beforeBreakfast.sugar_concentration || '',
              unit: beforeBreakfast.unit || '',
              insulinintake: beforeBreakfast.insulinintake || '',
            },
            beforeLunch: {
              sugar_concentration: beforeLunch.sugar_concentration || '',
              unit: beforeLunch.unit || '',
              insulinintake: beforeLunch.insulinintake || '',
            },
            beforeDinner: {
              sugar_concentration: beforeDinner.sugar_concentration || '',
              unit: beforeDinner.unit || '',
              insulinintake: beforeDinner.insulinintake || '',
            },
          });

          console.log('Updated record state:', {
            beforeBreakfast,
            beforeLunch,
            beforeDinner,
          });
        } else {
          console.error('Expected an array but got:', data);
        }
      } catch (error) {
        console.error("Error fetching yesterday's record:", error);
      }
    };

    fetchRecord();
  }, [username]);

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={windowWidth*0.08} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.heading}>Yesterday Record</Text>
      </View>
      <View style={styles.recordSection}>
        <View style={styles.headingContainer}>
          <Text style={styles.labelText}>Before Breakfast</Text>
        </View>
        <View style={styles.dataContainer}>
          <Text style={styles.dataText}>Sugar Concentration: {record.beforeBreakfast.sugar_concentration} {record.beforeBreakfast.unit}</Text>
          <Text style={styles.dataText}>Insulin Intake: {record.beforeBreakfast.insulinintake}</Text>
        </View>
      </View>
      <View style={styles.recordSection}>
        <View style={styles.headingContainer}>
          <Text style={styles.labelText}>Before Lunch</Text>
        </View>
        <View style={styles.dataContainer}>
          <Text style={styles.dataText}>Sugar Concentration: {record.beforeLunch.sugar_concentration} {record.beforeLunch.unit}</Text>
          <Text style={styles.dataText}>Insulin Intake: {record.beforeLunch.insulinintake}</Text>
        </View>
      </View>
      <View style={styles.recordSection}>
        <View style={styles.headingContainer}>
          <Text style={styles.labelText}>Before Dinner</Text>
        </View>
        <View style={styles.dataContainer}>
          <Text style={styles.dataText}>Sugar Concentration: {record.beforeDinner.sugar_concentration} {record.beforeDinner.unit}</Text>
          <Text style={styles.dataText}>Insulin Intake: {record.beforeDinner.insulinintake}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: windowWidth * 0.05,
    paddingTop: windowHeight * 0.02,
  },
  topContainer: {
    // paddingVertical: windowHeight * 0.02,
    // paddingHorizontal: windowWidth * 0.08,
    backgroundColor: '#603F83FF',
    borderBottomColor: 'black',
    height: windowHeight * 0.10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '115%',
    marginTop: -windowHeight * 0.02,
    marginLeft: windowHeight * -0.03,
    flexDirection: 'row',
  },
  backButton: {
    position: 'absolute',
    left: windowWidth * 0.12,
    top: windowHeight * 0.04,
  },
  heading: {
    fontSize: windowWidth * 0.06,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: windowHeight * 0.01,
  },
  recordSection: {
    backgroundColor: '#D3D3D3',
    borderRadius: windowHeight * 0.03,
    width: windowWidth * 0.9,
    marginTop: windowHeight * 0.05,
    marginBottom: windowHeight * 0.02,
    padding: windowWidth * 0.03,
  },
  headingContainer: {
    padding: windowWidth * 0.02,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    marginBottom: windowHeight * 0.01,
  },
  labelText: {
    fontSize: windowWidth * 0.05,
    fontWeight: 'bold',
    color: '#000000',
  },
  dataContainer: {
    padding: windowWidth * 0.02,
  },
  dataText: {
    fontSize: windowWidth * 0.04,
    color: '#000000',
  },
});

export default Todayrecord;
