import React from 'react';
import { 
  View, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Image, 
  Dimensions, 
  BackHandler 
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const Interphase = () => {
  const navigation = useNavigation();

  const handleDoctorLogin = () => {
    navigation.navigate('Doctorlogin');
  };

  const handlePatientLogin = () => {
    navigation.navigate('Patientlogin');
  };

  const handleBackPress = () => {
    navigation.navigate('Welcome'); // Navigate to the WelcomePage
    return true; // Prevent the default back button behavior
  };

  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      };
    }, [])
  );

  return (
    <View style={styles.outerContainer}>
      <View style={styles.innerContainer}>
        <Image source={require('./assets/Doct.png')} style={styles.image} />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleDoctorLogin}>
            <Text style={styles.buttonText}>Doctor Login</Text>
          </TouchableOpacity>
          <Image source={require('./assets/pat4.png')} style={styles.patientImage} />
          <TouchableOpacity style={styles.button} onPress={handlePatientLogin}>
            <Text style={styles.buttonText}>Patient Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#603F83FF',
  },
  innerContainer: {
    width: windowWidth * 0.9,
    padding: 10,
    borderRadius: 15,
    backgroundColor: '#F0F0F0', // Gray background
    alignItems: 'center',
    width:'80%',
    top:windowHeight*0.02,
  },
  image: {
    width: 130, // Adjust width as needed
    height: 150, // Adjust height as needed
    marginTop: windowHeight * 0.02, // Adjust margin top as needed
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20, // Adjust margin top as needed
  },
  button: {
    backgroundColor: '#603F83FF',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 30,
    width: '90%',
    marginBottom: 20, // Adjust margin bottom as needed
    alignItems: 'center',
    justifyContent: 'center',
   
  },
  buttonText: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: 'bold', // Adding bold text
  },
  patientImage: {
    width: 170, // Adjust width as needed
    height: 160, // Adjust height as needed
    marginVertical: 20, // Adjust vertical margin as needed
    left:windowWidth*0.06,
    bottom:windowHeight*0.001
  },
});

export default Interphase;
