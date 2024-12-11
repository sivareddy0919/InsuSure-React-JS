import React, { useState } from 'react';
import { ScrollView, View, TextInput, StyleSheet, Dimensions, Text, TouchableOpacity, Alert, Image } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import Config from './Config';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const PatientSignup = () => {
  const [patientName, setPatientName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [reenterPassword, setReenterPassword] = useState('');
  const [imageUri, setImageUri] = useState(null);

  const navigation = useNavigation();

  const handleImagePicker = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
        includeBase64: false,
      },
      (response) => {
        if (response.didCancel) {
          Alert.alert('Image selection canceled.');
        } else if (response.errorCode) {
          Alert.alert('Error selecting image:', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          setImageUri(response.assets[0].uri);
        }
      }
    );
  };

  const handleSignup = () => {
    if (!patientName || !contactNumber || !email || !gender || !age || !username || !password || !reenterPassword) {
      Alert.alert('Please fill in all fields.');
      return;
    }

    if (password !== reenterPassword) {
      Alert.alert("Passwords do not match!");
      return;
    }

    const signupApiUrl = `${Config.API_BASE_URL}/Patientsignup.php`;

    let formData = new FormData();
    formData.append('pname', patientName);
    formData.append('mob', contactNumber);
    formData.append('mail', email);
    formData.append('gender', gender);
    formData.append('age', age);
    formData.append('username', username);
    formData.append('pass', password);
    formData.append('cpass', reenterPassword);

    if (imageUri) {
      let filename = imageUri.split('/').pop();
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;

      formData.append('image_path', { uri: imageUri, name: filename, type });
    }

    fetch(signupApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })
      .then((response) => response.text()) // Temporarily read as plain text
      .then((text) => {
        console.log('Raw Response:', text); // Log the raw response
        const data = JSON.parse(text); // Then parse as JSON
        console.log('Parsed Data:', data);
        if (data.status === 'success') {
          Alert.alert('Signup successful!', '', [
            { text: 'OK', onPress: () => navigation.navigate('Patientlogin') }
          ]);
        } else {
          Alert.alert('Signup failed. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Signup Error:', error);
        Alert.alert('Signup failed. Please try again later.');
      });
    
  }

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.heading}>Patient Signup</Text>
      </View>
      <ScrollView contentContainerStyle={styles.formContainer}>
        <TouchableOpacity onPress={handleImagePicker} style={styles.imagePicker}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="camera" size={30} color="#3a3a3a" />
              <Ionicons name="add-circle" size={25} color="#3a3a3a" style={styles.plusIcon} />
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Name"
          value={patientName}
          onChangeText={setPatientName}
          placeholderTextColor="#000000"
        />

        <TextInput
          style={styles.input}
          placeholder="Contact Number"
          value={contactNumber}
          onChangeText={setContactNumber}
          placeholderTextColor="#000000"
        />

        <TextInput
          style={styles.input}
          placeholder="E-Mail"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#000000"
        />

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={gender}
            onValueChange={(itemValue) => setGender(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Age"
          value={age}
          onChangeText={setAge}
          placeholderTextColor="#000000"
        />

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          placeholderTextColor="#000000"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#000000"
        />

        <TextInput
          style={styles.input}
          placeholder="Re-enter Password"
          secureTextEntry={true}
          value={reenterPassword}
          onChangeText={setReenterPassword}
          placeholderTextColor="#000000"
        />

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Signup</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginText} onPress={() => navigation.navigate('Patientlogin')}>
          <Text style={styles.logintext}>Already a user? Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: windowWidth * 0.0001,
    paddingTop: windowHeight * 0.0010,
  },
  topContainer: {
    paddingTop: 10,
    paddingHorizontal: 10,
    backgroundColor: '#603F83FF',
    borderBottomWidth: 0,
    borderBottomColor: 'black',
    height: windowHeight * 0.10,
    top: windowHeight * -0.01,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: windowWidth * 0.1,
    top: windowHeight * 0.05,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color:'#FFFFFF',
    marginTop:5,
  },
  formContainer: {
    flexGrow: 1,
    marginTop: 20,
    paddingBottom: 30,
  },
  input: {
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: windowHeight * 0.03,
    width: '80%',
    backgroundColor: '#F9F9F9',
    alignSelf: 'center',
  },
  pickerContainer: {
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 25,
    paddingHorizontal: 10,
    marginTop: windowHeight * 0.001,
    marginVertical: windowHeight * 0.03,
    width: '80%',
    backgroundColor: '#F9F9F9',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    alignSelf: 'center',
  },
  picker: {
    height: windowHeight * 0.07,
    width: '100%',
  },
  button: {
    alignSelf: 'center',
    width: '35%',
    backgroundColor: '#603F83FF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 3,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginText: {
    marginTop: windowHeight * 0.018,
    marginBottom: windowHeight * 0.05,
    alignItems: 'center',
  },
  logintext: {
    fontSize: 18,
    color: '#000000',
  },
  imagePicker: {
    alignItems: 'center',
    marginBottom: windowHeight * 0.03,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  plusIcon: {
    position: 'absolute',
    bottom: -5,
    right: -5,
  },
});

export default PatientSignup;
