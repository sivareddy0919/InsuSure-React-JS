import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';


const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

const SugarTrackingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());

  const handleFromDateChange = (event, selectedDate) => {
    setShowFromDatePicker(false);
    setFromDate(selectedDate || fromDate);
  };

  const handleToDateChange = (event, selectedDate) => {
    setShowToDatePicker(false);
    setToDate(selectedDate || toDate);
  };

  const showFromDatepicker = () => {
    setShowFromDatePicker(true);
  };

  const showToDatepicker = () => {
    setShowToDatePicker(true);
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: () => navigation.navigate('Patientlogin')
        }
      ],
      { cancelable: false }
    );
  };

  const { username } = route.params || {}; // Receive the username from route params

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={windowWidth*0.08} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.heading}>Patient Record</Text>
      </View>
      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text style={styles.label}>From</Text>
        <TouchableOpacity style={styles.dateInputContainer} onPress={showFromDatepicker}>
          <FontAwesome name="calendar" size={windowHeight * 0.025} style={styles.calendarIcon} />
          <Text style={styles.dateInput}>{fromDate.toDateString()}</Text>
        </TouchableOpacity>
        {showFromDatePicker && (
          <DateTimePicker
            testID="fromDateTimePicker"
            value={fromDate}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={handleFromDateChange}
          />
        )}

        <Text style={styles.label}>To</Text>
        <TouchableOpacity style={styles.dateInputContainer} onPress={showToDatepicker}>
          <FontAwesome name="calendar" size={windowHeight * 0.025} style={styles.calendarIcon} />
          <Text style={styles.dateInput}>{toDate.toDateString()}</Text>
        </TouchableOpacity>
        {showToDatePicker && (
          <DateTimePicker
            testID="toDateTimePicker"
            value={toDate}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={handleToDateChange}
          />
        )}

        <View style={styles.iconsContainer}>
          <TouchableOpacity
            style={styles.circleContainer}
            onPress={() => navigation.navigate('PatientRecord', { 
              username, 
              startDate: fromDate.toISOString(), // Convert to string
              endDate: toDate.toISOString(), // Convert to string
            })}
          >
            <FontAwesome name="file-pdf-o" size={windowHeight * 0.037} style={styles.icon} />
            <Text style={styles.iconText}>View</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.circleContainer}
            onPress={() => navigation.navigate('PatientGraph', {
              username,
              startDate: fromDate.toISOString(), // Convert to ISO string
              endDate: toDate.toISOString(),     // Convert to ISO string
            })}
          >
            <FontAwesome name="line-chart" size={windowHeight * 0.037} style={styles.icon} />
            <Text style={styles.iconText}>View In Graph</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.additionalGrayContainer}>
          <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Patientdashboard', { username })}>
            <FontAwesome name="home" size={windowHeight * 0.048} style={styles.homeIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconContainer}>
            <FontAwesome name="bell" size={windowHeight * 0.041} style={styles.bellIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconContainer} onPress={handleLogout}>
            <FontAwesome name="sign-out" size={windowHeight * 0.048} style={styles.signOutIcon} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: windowHeight * 0.05,
  },
  topContainer: {
    paddingTop: windowHeight * 0.03,
    backgroundColor: '#603F83FF',
    borderBottomWidth: 0,
    borderBottomColor: 'black',
    height: windowHeight * 0.10,
    width: windowWidth * 1.5,
    left: windowWidth * -0.1,
    justifyContent: 'center',
    alignItems: 'center',
    top: windowHeight * -0.051,
  },
  backButton: {
    position: 'absolute',
    left: windowWidth * 0.18,
    top: windowHeight * 0.04,
  },
  heading: {
    fontSize: windowHeight * 0.03,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: windowHeight * -0.01,
    marginRight: windowWidth * 0.3,
  },
  formContainer: {
    flexGrow: 1,
    marginTop: windowHeight * -0.01,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#CCCCCC',
    borderRadius: windowHeight * 0.031,
    paddingHorizontal: windowWidth * 0.038,
    paddingVertical: windowHeight * 0.020,
    marginBottom: windowHeight * 0.02,
    width: '80%',
    backgroundColor: '#F9F9F9',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    left: windowWidth * 0.09,
  },
  calendarIcon: {
    marginLeft: windowWidth * 0.025,
    color: '#000000',
  },
  dateInput: {
    fontSize: windowHeight * 0.023,
    marginLeft: windowWidth * 0.035,
    color: '#000000',
  },
  label: {
    fontSize: windowHeight * 0.027,
    marginLeft: windowWidth * 0.1,
    marginBottom: windowHeight * 0.013,
    color: '#000000'
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Adjust spacing as needed
    marginTop: windowHeight * 0.05,
    marginLeft: windowWidth * 0.13,
    width:windowWidth*0.7,
  },
  circleContainer: {
    width: windowHeight * 0.13,  // Adjust width if necessary
    height: windowHeight * 0.10, // Adjust height if necessary
    borderRadius: windowHeight * 0.015, // Adjust border radius if necessary
    backgroundColor: '#DFDFDF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: windowHeight * -0.04,
    marginHorizontal: 400 * 0.0, // 2.16 pixels// Adjust horizontal margin to reduce space between circles
  },
  icon: {
    color: '#603F83FF',
  },
  iconText: {
    color: '#603F83FF',
    fontSize: windowHeight * 0.015,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: windowHeight * 0.005,
  },
  additionalGrayContainer: {
    backgroundColor: '#603F83FF',
    borderRadius: windowHeight * 0.025,
    width: '87%',
    paddingVertical: windowHeight * 0.0,
    paddingHorizontal: windowWidth * 0.0,
    marginTop:windowHeight *0.06,
    top: windowHeight * 0.25,
    height: windowHeight * 0.09,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 25,
  },
  iconContainer: {
    alignItems: 'center',
  },
  homeIcon: {
    color: '#DFDFDF',
  },
  bellIcon: {
    color: '#DFDFDF',
  },
  signOutIcon: {
    color: '#DFDFDF',
  },
});

export default SugarTrackingScreen;
