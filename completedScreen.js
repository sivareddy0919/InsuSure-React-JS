import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Correct import
import Config from './Config'; 


const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

const CompletedScreen = ({ navigation }) => {
  const [completedData, setCompletedData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${Config.API_BASE_URL}/completedScreen.php`);
      if (response.data.status === 'success') {
        const data = response.data.data;
        // Filter and sort data by date in descending order
        const sortedData = data
          .filter(item => item.status === 'completed')
          .sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
        setCompletedData(sortedData);
      } else {
        console.error('Failed to fetch data:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>Username: {item.username}</Text>
      <Text style={styles.itemText}>Date: {item.datetime}</Text>
      <Text style={styles.itemText}>Note: {item.note}</Text>
      <Text style={styles.itemText}>Session: {item.session}</Text>
      <Text style={styles.itemText}>Sugar Concentration: {item.sugar_concentration} {item.unit}</Text>
      <Text style={styles.itemText}>Insulin Intake: {item.insulinintake} Units</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={windowWidth * 0.07} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Insulin Record</Text>
        <TouchableOpacity style={styles.pendingButton} onPress={() => navigation.navigate('insulinentry')}>
          <Text style={styles.buttonText}>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.completedButton}>
          <Text style={styles.buttonText}>Completed</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.listContainer}>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : completedData.length === 0 ? (
          <Text style={styles.noDataText}>Data not found</Text>
        ) : (
          <FlatList
            data={completedData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topContainer: {
    backgroundColor: '#603F83FF',
    padding: windowHeight * 0.00,
    alignItems: 'center',
    height: windowHeight * 0.10,
  },
  backButton: {
    position: 'absolute',
    left: windowWidth * 0.09,
    top: windowHeight * 0.045,
  },
  headerText: {
    fontSize: windowWidth * 0.06,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: windowHeight * 0.04,
  },
  listContainer: {
    padding: windowWidth * 0.03,
    flex: 1,
    marginTop: windowHeight * 0.1,
  },
  itemContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    width: windowWidth * 0.9,
    alignSelf: 'center',
    padding: windowWidth * 0.04,
    marginBottom: windowHeight * 0.02,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: '#603F83FF',
  },
  itemText: {
    fontSize: windowWidth * 0.039,
    color: '#333',
    marginBottom: windowHeight * 0.01,
  },
  pendingButton: {
    backgroundColor: '#603F83FF',
    top: windowHeight * 0.1,
    borderRadius: 20,
    left: windowWidth * -0.25,
    marginBottom: windowHeight * 0.3,
    width: windowWidth * 0.4,
    height: windowHeight * 0.06,
    top: windowHeight * 0.04,
  },
  completedButton: {
    backgroundColor: '#603F83FF',
    borderRadius: 20,
    marginLeft: windowWidth * 0.50,
    width: windowWidth * 0.4,
    height: windowHeight * 0.06,
    top: windowHeight * -0.32,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: windowWidth * 0.045,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: windowHeight * 0.015,
  },
  loadingText: {
    fontSize: windowWidth * 0.05,
    textAlign: 'center',
    marginTop: windowHeight * 0.2,
  },
  noDataText: {
    fontSize: windowWidth * 0.05,
    textAlign: 'center',
    marginTop: windowHeight * 0.2,
  },
});

export default CompletedScreen;
