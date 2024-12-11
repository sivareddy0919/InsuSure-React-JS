import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Dimensions, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Config from './Config'; 
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';


const { width } = Dimensions.get('window');

const GlucoseEntry = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { username } = route.params;

  const [sugarConcentration, setSugarConcentration] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSugarConcentrationChange = (text) => {
    setSugarConcentration(text);
  };

  const handleNoteChange = (text) => {
    setNote(text);
  };

  const classifyTime = (time) => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const totalMinutes = hours * 60 + minutes;

    if (totalMinutes >= 420 && totalMinutes <= 600) {
      return 'Before Breakfast';
    } else if (totalMinutes >= 720 && totalMinutes <= 900) {
      return 'Before Lunch';
    } else if (totalMinutes >= 1140 && totalMinutes <= 1320) {
      return 'Before Dinner';
    } else {
      return 'Other';
    }
  };

  const formatDate = (date) => {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  const handleSubmit = async () => {
    // Check if sugar concentration is empty
    if (!sugarConcentration) {
      Alert.alert('Error', 'Please enter a sugar concentration value');
      return;
    }

    const currentTime = new Date();
    const time = currentTime.toTimeString().split(' ')[0];
    const session = classifyTime(currentTime);

    const sugarConcentrationValue = parseFloat(sugarConcentration);
    if (sugarConcentrationValue < 30 || sugarConcentrationValue > 700) {
      Alert.alert('Error', 'Sugar concentration must be between 30 and 700 mg/dL');
      return;
    }

    const validSessionTimes = ['Before Breakfast', 'Before Lunch', 'Before Dinner'];
    if (!validSessionTimes.includes(session)) {
      Alert.alert('Error', 'You can only submit during the designated times for your session');
      return;
    }

    const data = {
      date: date,
      time: time,
      sugarConcentration: sugarConcentrationValue,
      note: note,
      unit: 'mg/dL',
      session: session,
      username: username,
      insulinintake: null,
      status: 'pending'
    };

    try {
      const response = await fetch(`${Config.API_BASE_URL}/GlucoseEntry.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', result.message);
        setSugarConcentration('');
        setNote('');
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to submit data');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: "Cancel",
          onPress: () => console.log("Logout cancelled"),
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

  const handleHomePress = () => {
    navigation.navigate('Patientdashboard', { username });
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={windowWidth* 0.08} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.heading}>Glucose Entry</Text>
      </View>
      <View style={styles.iconContainer}>
        <View style={styles.iconWithLabel}>
          <Text style={styles.iconLabel}>Before Breakfast</Text>
          <FontAwesome name="coffee" size={45} style={styles.icon} />
          <Text style={styles.iconLabel}>7AM - 10AM</Text>
        </View>
        <View style={styles.iconWithLabel}>
          <Text style={styles.iconLabel}>Before Lunch</Text>
          <FontAwesome name="cutlery" size={44.5} style={styles.icon} />
          <Text style={styles.iconLabel}>12PM - 3PM </Text>
        </View>
        <View style={styles.iconWithLabel}>
          <Text style={styles.iconLabel}>Before Dinner</Text>
          <FontAwesome name="moon-o" size={45} style={styles.icon} />
          <Text style={styles.iconLabel}>7PM - 10PM</Text>
        </View>
      </View>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Date (YYYY-MM-DD)"
          value={formatDate(date)}
          placeholderTextColor="#000000"
          editable={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Time (HH:MM:SS)"
          value={new Date().toTimeString().split(' ')[0]}
          placeholderTextColor="#000000"
          editable={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter the Sugar Value in (mg/dL)"
          value={sugarConcentration}
          onChangeText={handleSugarConcentrationChange}
          placeholderTextColor="#000000"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.textarea}
          placeholder="Note"
          multiline={true}
          numberOfLines={4}
          value={note}
          onChangeText={handleNoteChange}
          placeholderTextColor="#000000"
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.additionalGrayContainer}>
          <FontAwesome name="home" size={35} style={styles.homeIcon} onPress={handleHomePress} />
          <FontAwesome name="bell" size={30} style={styles.bellIcon} />
          <FontAwesome name="sign-out" size={35} style={styles.signOutIcon} onPress={handleLogout} />
        </TouchableOpacity>
      </View>
    </View>
  );
};


const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: width * 0.01,
    paddingTop: windowHeight * 0.05,
  },
  topContainer: {
    backgroundColor: '#603F83FF',
    borderBottomWidth: 0,
    borderBottomColor: 'black',
    height: windowHeight * 0.10,
    width: '150%',
    left: windowHeight * -0.1,
    justifyContent: 'center',
    alignItems: 'center',
    top: windowHeight * -0.051,
  },
  heading: {
    fontSize: windowWidth * 0.06,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: windowHeight * 0.01,
  },
  backButton: {
    zIndex: 1,
    padding: 5,
    position: 'absolute',
    left: 100,
    top: 25,
  },
  formContainer: {
    flexGrow: 1,
    marginTop: 0,
  },
  dateInput: {
    fontSize: 17,
    borderColor: '#CCCCCC',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: windowHeight * 0.09,
    marginBottom: windowHeight * -0.06,
    width: '90%',
    backgroundColor: '#F9F9F9',
    left: windowHeight * 0.025,
  },
  iconContainer: {
    flexDirection: 'row',
    backgroundColor: '#DFDFDF',
    justifyContent: 'space-around',
    width: '104%',
    borderRadius: 0,
    marginVertical: windowHeight * -0.051,
    paddingVertical: 10,
    left: windowHeight * -0.01,
  },
  iconWithLabel: {
    alignItems: 'center',
    color: '#603F83FF',
  },
  icon: {
    marginBottom: 5,
    color: '#603F83FF',
  },
  iconLabel: {
    fontSize: 12,
    textAlign: 'center',
    color: '#000000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: windowHeight * 0.09,
    width: '80%'
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 13,
    marginTop: windowHeight * 0.09,
    marginBottom: windowHeight * -0.06,
    width: '90%',
    backgroundColor: '#F9F9F9',
    shadowColor: '#000',
    left: windowHeight * 0.027,
    color: '#000000',
  },
  textarea: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: windowHeight * 0.05,
    marginTop: windowHeight * 0.09,
    width: '90%',
    height: windowHeight * 0.15,
    backgroundColor: '#F9F9F9',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    textAlignVertical: 'top',
    left: windowHeight * 0.027,
    color: '#000000',
  },
  button: {
    backgroundColor: '#603F83FF',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: windowHeight * -0.02,
    width: '80%',
    shadowColor: '#000',
    shadowRadius: 2,
    left: 37,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
  },
  additionalGrayContainer: {
    flexDirection: 'row',
    backgroundColor: '#603F83FF',
    justifyContent: 'space-around',
    width: '90%',
    borderRadius: 25,
    paddingVertical: 15,
    left: windowHeight * 0.025,
    height: windowHeight * 0.085,
    marginTop: windowHeight * 0.06,
  },
  homeIcon: {
    color: '#DFDFDF'
  },
  bellIcon: {
    color: '#DFDFDF'
  },
  signOutIcon: {
    color: '#DFDFDF'
  }
});

export default GlucoseEntry;
