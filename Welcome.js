import React from 'react';
import { 
  View, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Dimensions, 
  Image, 
  BackHandler 
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const WelcomePage = () => {
  const navigation = useNavigation();

  const handleGetStarted = () => {
    navigation.navigate('Interphase');
  };

  const handleBackPress = () => {
    BackHandler.exitApp(); // Close the app
    return true; // Prevent default behavior
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
        <Text style={styles.heading}>Welcome to Sugar Smart</Text>
        <Image
          source={require('./assets/welcome.png')} // Replace with the actual path to your blood drop icon
          style={styles.icon}
        />
        <View style={styles.content}>
          <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#603F83FF',
  },
  innerContainer: {
    width: '90%',
    borderRadius: 15,
    backgroundColor: '#F0F0F0', // Gray background
    alignItems: 'center',
    height: '60%', // Increased height to 60%
    paddingVertical: '13%',
  },
  heading: {
    fontSize: Dimensions.get('window').height * 0.03,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: '5%',
  },
  icon: {
    width: '80%', // Relative width for better responsiveness
    height: undefined, // Maintain aspect ratio
    aspectRatio: 1, // Assuming the image is square, adjust if necessary
    marginBottom: '5%',
  },
  content: {
    alignItems: 'center', // Center align content
  },
  button: {
    backgroundColor: '#603F83FF',
    borderRadius: 30, // Fixed value for a better look
    paddingVertical: '3%',
    paddingHorizontal: '20%',
    marginTop: '5%',
  },
  buttonText: {
    fontSize: Dimensions.get('window').height * 0.03,
    color: '#FFFFFF',
    textAlign: 'center', // Center align the button text
  },
});

export default WelcomePage;