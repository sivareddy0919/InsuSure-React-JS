import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TextInput, Alert, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import axios from 'axios';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome
import Config from './Config';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

const Insulinentry = ({ navigation }) => {
  const route = useRoute();
  const { username } = route.params || {}; // Fallback to prevent crashes if username is missing

  const [pendingData, setPendingData] = useState([]);
  const [completedData, setCompletedData] = useState([]);
  const [insulinIntakes, setInsulinIntakes] = useState({});
  const [showPending, setShowPending] = useState(true);

  useEffect(() => {
    if (!username) {
      console.error('Error: Username is missing in route parameters');
      return;
    }
    console.log("Username passed to Insulinentry:", username);
    fetchData();
  }, [username]);

  useFocusEffect(
    useCallback(() => {
      setShowPending(true); // Ensure pending data is shown when screen is focused
      if (username) {
        fetchData();
      }
    }, [username])
  );

  const fetchData = async () => {
    try {
      const response = await axios.get(`${Config.API_BASE_URL}/PatientGlucosepending.php`, {
        params: { username }
      });
      console.log("API Response:", response.data);
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

  const handleCompletedNavigation = () => {
    setShowPending(false);
    navigation.navigate('Patientcompletedentries', { username });
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>Username: {item.username}</Text>
      <Text style={styles.itemText}>Date: {item.datetime}</Text>
      <Text style={styles.itemText}>Note: {item.note}</Text>
      <Text style={styles.itemText}>Session: {item.session}</Text>
      <View style={styles.row}>
        <Text style={styles.itemText}>
          Sugar Concentration: {item.sugar_concentration} {item.unit}
        </Text>
      </View>
      <Text style={styles.itemText}>Insulin Intake: {item.insulinintake} Pending</Text>
      {showPending && (
        <TextInput
          style={styles.input}
          placeholder="Enter insulin intake"
          placeholderTextColor="#888"
          value={insulinIntakes[item.id] || ''}
          onChangeText={text => handleInsulinIntakeChange(item.id, text)}
        />
      )}
    </View>
  );

  if (!username) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>No username provided. Please navigate properly.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Patientdashboard', {username})}
         style={styles.backArrow}>
          <Icon name="arrow-left" size={windowWidth * 0.06} color="#FFFFFF" />
        </TouchableOpacity>
        
        <Text style={styles.topText}>Patient Sugar Level</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, showPending && styles.buttonActive]}
          onPress={() => setShowPending(true)}
        >
          <Text style={[styles.buttonText, showPending && styles.buttonActiveText]}>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, !showPending && styles.buttonActive]}
          onPress={handleCompletedNavigation}
        >
          <Text style={[styles.buttonText, !showPending && styles.buttonActiveText]}>Completed</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.listContainer}>
        {showPending ? (
          pendingData.length === 0 ? (
            <Text style={styles.noDataText}>Data Not Found</Text>
          ) : (
            <FlatList
              data={pendingData}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
            />
          )
        ) : (
          completedData.length === 0 ? (
            <Text style={styles.noDataText}>Data Not Found</Text>
          ) : (
            <FlatList
              data={completedData}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
            />
          )
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: windowWidth * 0.025,
  },
  topContainer: {
    padding: windowWidth * 0.00,
    backgroundColor: '#603F83FF',
    alignItems: 'center',
    marginBottom: windowHeight * 0.0125,
    height: windowHeight * 0.1000,
    width: windowWidth * 1.09,
    right: windowWidth * 0.025,
    marginTop: -windowHeight * 0.0125,
  },
  backArrow: {
    position: 'absolute',
    left: windowWidth * 0.1,
    top: windowHeight * 0.04,
  },
  topText: {
    fontSize: windowWidth * 0.055,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: windowHeight * 0.035,
    marginRight: windowWidth * 0.03,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: windowWidth * 0.05,
    marginTop: windowHeight * 0.03,
    marginBottom: windowHeight * 0.01,
    backgroundColor: '#FFFFFF',
    height: windowHeight * 0.05,
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#603F83FF',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: windowHeight * 0.005,
  },
  buttonText: {
    color: '#603F83FF',
    fontWeight: 'bold',
    fontSize: windowWidth * 0.04,
  },
  buttonActive: {
    backgroundColor: '#603F83FF',
  },
  buttonActiveText: {
    color: '#FFFFFF',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: windowHeight * 0.1,
    fontSize: windowWidth * 0.045,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: windowHeight * 0.3,
    fontSize: windowWidth * 0.05,
  },
  itemContainer: {
    marginBottom: windowHeight * 0.0125,
    backgroundColor: '#603F83FF',
    borderRadius: 10,
    padding: windowWidth * 0.05,
    paddingVertical: windowHeight * 0.02,
    width: '94%',
    marginLeft: windowWidth * 0.03,
    height: windowHeight * 0.24,
  },
  itemText: {
    fontSize: windowWidth * 0.04,
    marginBottom: windowHeight * 0.00625,
    color: '#FFFFFF',
  },
});

export default Insulinentry;
