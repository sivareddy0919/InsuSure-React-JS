import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import Config from './Config';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

const Patientcompletedscreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { username } = route.params;

  const [completedData, setCompletedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCompleted, setShowCompleted] = useState(true);

  useEffect(() => {
    fetchCompletedData();
  }, []);

  const fetchCompletedData = async () => {
    try {
      const response = await axios.get(`${Config.API_BASE_URL}/Patientcompletedentries.php`, {
        params: { username }
      });
      if (response.data.status === 'success') {
        setCompletedData(response.data.data.reverse());
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
        <TouchableOpacity
          onPress={() => navigation.navigate('Glucosepending', { username })}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={30} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.topText}>Patient Completed Entries</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, !showCompleted && styles.buttonActive]}
          onPress={() => {
            setShowCompleted(false);
            navigation.navigate('Glucosepending', { username });
          }}
        >
          <Text style={[styles.buttonText, !showCompleted && styles.buttonActiveText]}>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, showCompleted && styles.buttonActive]}
          onPress={() => setShowCompleted(true)}
        >
          <Text style={[styles.buttonText, showCompleted && styles.buttonActiveText]}>Completed</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : completedData.length === 0 ? (
        <Text style={styles.noDataText}>Data Not Found</Text>
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
    padding: windowWidth * 0.0,
    backgroundColor: '#603F83FF',
    alignItems: 'center',
    marginBottom: windowHeight * 0.0125,
    height: windowHeight * 0.1000,
    width: windowWidth * 1.09,
    right: windowWidth * 0.025,
    marginTop: -windowHeight * 0.0125,
    position: 'relative', // Ensure that the back button can be placed correctly
  },
  backButton: {
    position: 'absolute',
    left: windowWidth * 0.06,
    top: windowHeight * 0.03,
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
    marginTop: windowHeight * 0.018,
    marginBottom: windowHeight * 0.02,
    backgroundColor: '#FFFFFF',
    height: windowHeight * 0.05, // Reduced height
    borderRadius: 15, // Adjusted radius
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#603F83FF',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: windowHeight * 0.005, // Reduced padding
  },
  buttonText: {
    color: '#603F83FF',
    fontWeight: 'bold',
    fontSize: windowWidth * 0.04, // Reduced font size
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
  },
  itemText: {
    fontSize: windowWidth * 0.04,
    marginBottom: windowHeight * 0.00625,
    color: '#FFFFFF',
  },
});

export default Patientcompletedscreen;
