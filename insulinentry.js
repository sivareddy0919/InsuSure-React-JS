import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Alert, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Config from './Config'; 

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

const InsulinEntry = ({ navigation }) => {
  const [pendingData, setPendingData] = useState([]);
  const [completedData, setCompletedData] = useState([]);
  const [insulinIntakes, setInsulinIntakes] = useState({});
  const [showPending, setShowPending] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${Config.API_BASE_URL}/insulinlevel.php`);
      if (response.data.status === 'success') {
        const data = response.data.data;
        setPendingData(data.filter(item => item.status !== 'completed'));
        setCompletedData(data.filter(item => item.status === 'completed'));
      } else {
        console.error('Failed to fetch data:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleUpdateInsulinIntake = async (id) => {
    try {
      const insulinIntake = insulinIntakes[id] || '';
      const intakeValue = parseFloat(insulinIntake);

      if (isNaN(intakeValue) || intakeValue < 0 || intakeValue > 30) {
        Alert.alert('Invalid Value', 'Insulin intake should be between 0 and 30 units.');
        return;
      }

      const response = await axios.put(`${Config.API_BASE_URL}/insulinentry.php`, {
        id: id,
        insulinintake: insulinIntake
      });

      if (response.data.status === 'success') {
        const updatedItem = pendingData.find(item => item.id === id);
        updatedItem.insulinintake = insulinIntake;
        updatedItem.status = 'completed';
        
        setPendingData(pendingData.filter(item => item.id !== id));
        setCompletedData([...completedData, updatedItem]);
        
        setInsulinIntakes(prev => ({ ...prev, [id]: '' }));

        Alert.alert('Success', 'Insulin intake updated successfully');
      } else {
        Alert.alert('Error', 'Failed to update insulin intake');
      }
    } catch (error) {
      console.error('Error updating insulin intake:', error);
      Alert.alert('Error', 'Failed to update insulin intake');
    }
  };

  const handleInsulinIntakeChange = (id, value) => {
    setInsulinIntakes(prev => ({ ...prev, [id]: value }));
  };

  const navigateToGraphScreen = (item) => {
    navigation.navigate('CheckGraph', { 
      username: item.username, 
      date: item.datetime,
      sugar_concentration: item.sugar_concentration,
      insulinintake: item.insulinintake
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>Username: {item.username}</Text>
      <Text style={styles.itemText}>Date: {item.datetime}</Text>
      <Text style={styles.itemText}>Note: {item.note}</Text>
      <Text style={styles.itemText}>Session: {item.session}</Text>
      <Text style={styles.itemText}>Sugar Concentration: {item.sugar_concentration}  {item.unit}</Text>
      <Text style={styles.itemText}>Insulin Intake: {item.insulinintake}</Text>

      {showPending && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter Insulin Intake Value in Units"
            placeholderTextColor="#000000"
            value={insulinIntakes[item.id] || ''}
            onChangeText={text => handleInsulinIntakeChange(item.id, text)}
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.addButtonContainer}
              onPress={() => handleUpdateInsulinIntake(item.id)}
            >
              <Text style={styles.addButtonText}>Add Insulin Intake</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.viewGraphButton}
              onPress={() => navigateToGraphScreen(item)}
            >
              <Text style={styles.viewGraphButtonText}>View Graph</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={windowWidth * 0.07} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.topText}>Insulin Entry</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.pendingButton, showPending && styles.selectedButton]}
          onPress={() => setShowPending(true)}
        >
          <Text style={styles.buttonText}>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.completedButton, !showPending && styles.selectedButton]}
          onPress={() => navigation.navigate('completedScreen')}
        >
          <Text style={styles.buttonText}>Completed</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.listContainer}>
        <FlatList
          data={showPending ? pendingData : completedData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topContainer: {
    padding: windowWidth * 0.025,
    backgroundColor: '#603F83FF',
    alignItems: 'center',
    height: windowHeight * 0.08,
  },
  topText: {
    fontSize: windowWidth * 0.060,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: windowHeight * 0.01,
    marginLeft: windowWidth * 0.05,
  },
  backButton: {
    position: 'absolute',
    left: windowWidth * 0.09,
    top: windowHeight * 0.03,
  },
  buttonContainer: {
    flexDirection: 'row',
    width:'90%',
    justifyContent: 'space-between',
    marginVertical: windowHeight * 0.015,
    marginLeft: windowWidth * 0.05,
  },
  pendingButton: {
    width: '45%',
    backgroundColor: '#603F83FF',
    alignItems: 'center',
    paddingVertical: windowHeight * 0.014,
    borderRadius: windowWidth * 0.05,
    marginLeft: windowWidth * 0.02,
    marginTop: windowHeight * 0.01,
  },
  completedButton: {
    width: '45%',
    backgroundColor: '#603F83FF',
    alignItems: 'center',
    paddingVertical: windowHeight * 0.015,
    borderRadius: windowWidth * 0.05,
    marginRight: windowWidth * 0.05,
    marginTop: windowHeight * 0.01,
    marginLeft: windowWidth * 0.05,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: windowWidth * 0.042,
  },
  listContainer: {
    flex: 1,
    padding: windowWidth * 0.02,
    width:'90%',
    left:windowWidth*0.05,
  },
  itemContainer: {
    marginBottom: windowHeight * 0.01,
    backgroundColor: '#603F83FF',
    borderRadius: windowWidth * 0.025,
    padding: windowWidth * 0.04,
    height: windowWidth * 0.75, // Adjust height to accommodate the new button
    marginBottom: windowHeight *0.02,
  },
  itemText: {
    fontSize: windowWidth * 0.041,
    marginBottom: windowHeight * 0.005,
    color: '#FFFFFF',
  },
  input: {
    height: windowHeight * 0.05,
    borderColor: '#FFFFFF',
    marginBottom: windowHeight * 0.01,
    width: '100%',
    backgroundColor: '#FFFFFF',
    color: '#000000',
    borderRadius: 8,
    marginTop:windowHeight *0.005,
    paddingHorizontal: windowWidth * 0.025,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: windowHeight * 0.01,
  },
  addButtonContainer: {
    width: '55%',
    marginRight: windowWidth * 0.02,
    borderRadius: 20,
    backgroundColor: '#FFFFFF', // Change to desired color
    padding: windowHeight * 0.011, // Adjust padding to increase button height
    alignItems: 'center',
  },
  addButtonText: {
    color: '#000000',
    fontSize: windowWidth * 0.04, // Adjust font size
    fontWeight: 'bold',
  },
  viewGraphButton: {
    width: '40%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: windowWidth * 0.02,
    alignItems: 'center',
    marginLeft:windowWidth*0.0,
  },
  viewGraphButtonText: {
    color: '#000000',
    fontSize: windowWidth * 0.038,
    fontWeight: 'bold',
  },
});

export default InsulinEntry;