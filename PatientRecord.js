import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Config from './Config'; 


const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
const Patientcompletedscreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { username, startDate, endDate } = route.params;

  const [completedData, setCompletedData] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    fetchCompletedData();
  }, [username, startDate, endDate]);

  const fetchCompletedData = async () => {
    try {
      const response = await axios.get(`${Config.API_BASE_URL}/PatientRecord.php`, {
        params: { 
          username, 
          start_date: startDate, 
          end_date: endDate 
        }
      });
      if (response.data.status === 'success') {
        setCompletedData(response.data.data.reverse());
        setErrorMessage(null);
      } else {
        setErrorMessage('No completed entries found for this username.');
      }
    } catch (error) {
      setErrorMessage('No completed entries found for this username.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>Username: {item.username}</Text>
      <Text style={styles.itemText}>Date: {item.datetime}</Text>
      <Text style={styles.itemText}>Note: {item.note}</Text>
      <Text style={styles.itemText}>Session: {item.session}</Text>
      <Text style={styles.itemText}>Sugar Concentration: {item.sugar_concentration} {item.unit}</Text>
      <Text style={styles.itemText}>Insulin Intake: {item.insulinintake}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={windowWidth * 0.08} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.topText}>Record</Text>
      </View>
      {errorMessage ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{errorMessage}</Text>
        </View>
      ) : (
        <FlatList
          data={completedData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}
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
    padding: windowWidth * 0.025,
    backgroundColor: '#603F83FF',
    alignItems: 'center',
    marginBottom: windowHeight * 0.0125,
    height: windowHeight * 0.1000,
    width: windowWidth * 1.09,
    right: windowWidth * 0.025,
    marginTop: -windowHeight * 0.0125,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  backButton: {
    marginLeft: windowWidth * 0.07,
    marginTop: windowHeight * 0.02,
  },
  topText: {
    fontSize: windowWidth * 0.065,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: windowHeight * 0.012,
    marginLeft: windowWidth * 0.25,
  },
  itemContainer: {
    marginBottom: windowHeight * 0.0125,
    backgroundColor: '#603F83FF',
    borderRadius: 10,
    padding: windowWidth * 0.05,
    paddingVertical: windowHeight * 0.02,
    width: '94%',
    marginLeft: windowWidth * 0.03,
  },
  itemText: {
    fontSize: windowWidth * 0.04,
    marginBottom: windowHeight * 0.00625,
    color: '#FFFFFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: windowWidth * 0.05,
    color: '#000000',
    marginBottom: windowHeight * 0.35,
  },
});

export default Patientcompletedscreen;
