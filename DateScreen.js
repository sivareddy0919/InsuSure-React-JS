import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Config from './Config'; 

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const DateScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { username } = route.params;
  const [record, setRecord] = useState({
    beforeBreakfast: { sugar_concentration: '', unit: '', insulinintake: '' },
    beforeLunch: { sugar_concentration: '', unit: '', insulinintake: '' },
    beforeDinner: { sugar_concentration: '', unit: '', insulinintake: '' },
  });
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = () => {
    setShow(true);
  };

  const fetchRecord = async (selectedDate) => {
    try {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const response = await axios.get(`${Config.API_BASE_URL}/Todayrecord.php?username=${username}&date=${formattedDate}`);
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
      } else {
        console.error('Expected an array but got:', data);
      }
    } catch (error) {
      console.error("Error fetching record:", error);
    }
  };

  useEffect(() => {
    fetchRecord(date);
  }, [date, username]);

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={windowWidth *0.08} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.heading}>Selected Date</Text>
      </View>
      <TouchableOpacity style={styles.dateButton} onPress={showMode}>
        <Icon name="calendar" size={20} color="#FFFFFF" style={styles.icon} />
        <Text style={styles.buttonText}>Pick a Date</Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
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
  dateButton: {
    backgroundColor: '#603F83FF',
    paddingVertical: windowHeight * 0.015,
    paddingHorizontal: windowWidth * 0.1,
    borderRadius: windowHeight * 0.02,
    marginVertical: windowHeight * 0.02,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: windowWidth * 0.04,
    fontWeight: 'bold',
    marginLeft: windowWidth * 0.02,
  },
  icon: {
    marginRight: windowWidth * 0.02,
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

export default DateScreen;
