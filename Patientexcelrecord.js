import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useRoute } from '@react-navigation/native';
// import Config from './Config'; 

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

const PatientExcelRecord = () => {
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
          onPress: () => navigation.navigate('Doctorlogin')
        }
      ],
      { cancelable: false }
    );
  };

  const { username } = route.params || {}; // Receive the username from route params

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={windowWidth * 0.07} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.heading}>Patient Insulin Record</Text>
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
            style={styles.circlePdf}
            onPress={() => navigation.navigate('Record', { 
              username, 
              startDate: fromDate.toISOString(), // Convert to string
              endDate: toDate.toISOString(), // Convert to string
            })}
          >
            <FontAwesome name="file-pdf-o" size={windowHeight * 0.037} style={styles.icon} />
            <Text style={styles.iconText}>View</Text>
          </TouchableOpacity>

        </View>

        <View style={styles.additionalGrayContainer}>
          <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Doctordashboard', { username })}>
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
    backgroundColor: '#603F83FF',
    borderBottomWidth: 0,
    borderBottomColor: 'black',
    height: windowHeight * 0.10,
    width: windowWidth * 1.5,
    left: windowWidth * -0.1,
    justifyContent: 'center',
    alignItems: 'center',
    top: windowHeight * -0.051,
    flexDirection: 'row', // Align items in a row
  },
  backButton: {
    position: 'absolute',
    left: windowWidth * 0.16,
    top: windowHeight * 0.04,
  },
  heading: {
    fontSize: windowHeight * 0.03,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop:windowHeight *0.01,
    marginRight:windowWidth *0.24,
  },
  formContainer: {
    flexGrow: 1,
    marginTop: windowHeight * 0.025,
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
    marginTop: windowHeight * 0.062,
    marginLeft: windowWidth * 0.15,
  },
  icon: {
    color: '#603F83FF',
    textAlign: 'center',
  },
  iconText: {
    color: '#603F83FF',
    fontSize: windowHeight * 0.017,
    fontWeight: 'bold',
    marginTop: windowHeight * 0.006,
    textAlign: 'center'
  },
  additionalGrayContainer: {
    backgroundColor: '#603F83FF',
    borderRadius: windowHeight * 0.025,
    width: '85%',
    paddingVertical: windowHeight * 0.0,
    paddingHorizontal: windowWidth * 0.0,
    marginBottom: windowHeight * 0.031,
    top: windowHeight * 0.25,
    height: windowHeight * 0.09,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius:25,
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
  circlePdf: {
    width: windowHeight * 0.150,
    height: windowHeight * 0.110,
    borderRadius: windowHeight * 0.019,
    top: windowHeight * -0.025,
    backgroundColor: '#DFDFDF',
    justifyContent: 'center',
    alignItems: 'center',
    right: windowWidth * -0.17,
  },
});

export default PatientExcelRecord;