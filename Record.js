import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Config from './Config'; 

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

const Record = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { username, startDate, endDate } = route.params;

  const [completedData, setCompletedData] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCompletedData();
  }, [username, startDate, endDate]);

  const fetchCompletedData = async () => {
    try {
      const response = await axios.get(`${Config.API_BASE_URL}/Record.php`, {
        params: { 
          username, 
          start_date: startDate, 
          end_date: endDate 
        }
      });
      if (response.data.status === 'success' && response.data.data.length > 0) {
        setCompletedData(response.data.data.reverse());
        setMessage('');
      } else {
        setMessage('No completed entries found for this username within the specified date range.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage('Failed to fetch data.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>Record Details</Text>
      <Text style={styles.itemText}>Username: <Text style={styles.itemValue}>{item.username}</Text></Text>
      <Text style={styles.itemText}>Date: <Text style={styles.itemValue}>{item.datetime}</Text></Text>
      <Text style={styles.itemText}>Note: <Text style={styles.itemValue}>{item.note}</Text></Text>
      <Text style={styles.itemText}>Session: <Text style={styles.itemValue}>{item.session}</Text></Text>
      <Text style={styles.itemText}>Sugar Concentration: <Text style={styles.itemValue}>{item.sugar_concentration} {item.unit}</Text></Text>
      <Text style={styles.itemText}>Insulin Intake: <Text style={styles.itemValue}>{item.insulinintake} Units</Text></Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
             <Ionicons name="arrow-back" size={windowWidth*0.08} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.topText}>Records</Text>
      </View>
      {message ? (
        <Text style={styles.message}>{message}</Text>
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
    backgroundColor: '#F5F5F5',
    padding: windowWidth * 0.03,
  },
  topContainer: {
    padding: windowWidth * 0.00,
    backgroundColor: '#603F83FF',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    height: windowHeight * 0.10,
    width: '110%',
    marginBottom: windowHeight * 0.02,
    marginTop: windowHeight * -0.02,
    marginLeft: windowHeight * -0.02,
    flexDirection: 'row', // Align back button and title horizontally
    justifyContent: 'flex-start', // Align items to the left
  },
  backButton: {
    marginLeft: windowWidth * 0.09, // Adjust spacing between the back button and title
    marginTop: windowHeight * 0.015,
  },
  topText: {
    fontSize: windowWidth * 0.06,
    marginTop: windowHeight * 0.02,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: windowHeight * 0.12,
  },
  message: {
    fontSize: windowWidth * 0.05,
    color: '#000000',
    textAlign: 'center',
    marginTop: windowHeight * 0.25,
  },
  itemContainer: {
    marginBottom: windowHeight * 0.02,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: windowWidth * 0.05,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    width: '100%',
  },
  itemTitle: {
    fontSize: windowWidth * 0.045,
    fontWeight: 'bold',
    color: '#3F51B5',
    marginBottom: windowHeight * 0.01,
  },
  itemText: {
    fontSize: windowWidth * 0.04,
    color: '#333333',
    marginBottom: windowHeight * 0.01,
  },
  itemValue: {
    fontWeight: '600',
    color: '#555555',
  },
});

export default Record;
