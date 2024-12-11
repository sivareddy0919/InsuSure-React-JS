import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, TextInput } from 'react-native';
import axios from 'axios';
import Config from './Config'; // Import the Config file
import RNFS from 'react-native-fs'; // Import the react-native-fs library

function DownloadCSV() {
  const [data, setData] = useState([]); // State to store fetched data
  const [fileName, setFileName] = useState('data.csv'); // State to store file name input by the user

  // Function to convert JSON data to CSV
  const convertToCSV = (data) => {
    const headers = Object.keys(data[0]).join(','); // Get the column headers
    const rows = data.map((row) =>
      Object.values(row).map((value) => `"${value}"`).join(',') // Map each row to a CSV string
    );
    return [headers, ...rows].join('\n'); // Combine headers and rows with newline
  };

  // Function to fetch data and set it to the state
  const fetchData = async () => {
    try {
      const response = await axios.get(`${Config.API_BASE_URL}/Download.php`, {
        responseType: 'json',
      });

      const fetchedData = response.data;

      if (fetchedData.length === 0) {
        Alert.alert('No data found.');
        return;
      }

      setData(fetchedData); // Store data in the state
      Alert.alert('Data fetched successfully!');
    } catch (error) {
      console.error('Error fetching the data:', error);
      Alert.alert('Failed to fetch data. Please try again.');
    }
  };

  // Function to handle the download and save to the Download folder
  const handleDownload = async () => {
    if (data.length === 0) {
      Alert.alert('No data available to download. Please fetch the data first.');
      return;
    }

    // Convert data to CSV format
    const csvContent = convertToCSV(data);

    try {
      // Get the path to the device's Download folder
      const downloadFolderPath = RNFS.DownloadDirectoryPath; // This points to the Download folder on Android

      const customFileName = fileName || 'data.csv'; // Use the file name from the user input
      const filePath = `${downloadFolderPath}/${customFileName}`; // Define the file path in the Download folder

      // Write CSV data to the Download folder
      await RNFS.writeFile(filePath, csvContent, 'utf8');

      // Alert to indicate the file is saved
      Alert.alert('File saved successfully!', `File path: ${filePath}`);
    } catch (error) {
      console.error('Error saving the file:', error);
      Alert.alert('Failed to save the file. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={fetchData}>
        <Text style={styles.buttonText}>Fetch Data</Text>
      </TouchableOpacity>
      {data.length > 0 && (
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              {Object.entries(item).map(([key, value]) => (
                <Text key={key} style={styles.itemText}>
                  {key}: {value}
                </Text>
              ))}
            </View>
          )}
        />
      )}

      {/* Input for custom file name */}
      <TextInput
        style={styles.input}
        value={fileName}
        onChangeText={setFileName}
        placeholder="Enter custom file name"
      />
      
      <TouchableOpacity style={styles.button} onPress={handleDownload}>
        <Text style={styles.buttonText}>Download CSV</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    elevation: 2,
  },
  itemText: {
    fontSize: 14,
    color: '#333',
  },
  input: {
    borderColor: '#007BFF',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
});

export default DownloadCSV;
