import React, { useEffect, useState } from 'react';
import { View, Dimensions, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Config from './Config'; 

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

const LineGraphExample = ({ route }) => {
    const { username } = route.params || {};
    const navigation = useNavigation();

    const [sugarConcentration, setSugarConcentration] = useState([]);
    const [insulinIntake, setInsulinIntake] = useState([]);
    const [labels, setLabels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${Config.API_BASE_URL}/GraphScreen.php`, {
                    params: { username },
                });

                if (!response.data || response.data.status !== "success" || !Array.isArray(response.data.data)) {
                    throw new Error("Invalid response format");
                }

                const fetchedData = response.data.data;

                if (fetchedData.length === 0) {
                    // No data case: clear previous error and set empty arrays
                    setError(null);
                    setSugarConcentration([]);
                    setInsulinIntake([]);
                    setLabels([]);
                    setLoading(false);
                    return;
                }

                // Extracting and validating data
                const fetchedSugarConcentration = fetchedData.map(item => parseFloat(item.sugar_concentration) || 0);
                const fetchedInsulinIntake = fetchedData.map(item =>
                    item.insulinintake ? `${parseFloat(item.insulinintake)} units` : "N/A"
                );
                const fetchedLabels = fetchedData.map(item => {
                    const date = new Date(item.datetime);
                    const hours = date.getHours();
                    const session = hours < 12 ? 'M' : hours < 18 ? 'A' : 'N';
                    return `${session}\n${date.getDate()}/${date.getMonth() + 1}`;
                });

                setSugarConcentration(fetchedSugarConcentration);
                setInsulinIntake(fetchedInsulinIntake);
                setLabels(fetchedLabels);
                setError(null); // Clear any previous error
            } catch (error) {
                console.error("Fetch data error:", error.message);
                setError("An error occurred while fetching the data.");
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            fetchData();
        }
    }, [username]);

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (error || sugarConcentration.length === 0 || insulinIntake.length === 0) {
        return (
            <View style={styles.container}>
                <Text>{error ? `Error: ${error}` : 'Data Not Found'}</Text>
            </View>
        );
    }

    return (
        <View style={styles.outerContainer}>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <View style={styles.topContainer}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={windowHeight * 0.03} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text style={styles.topTitle}>Doctor Graph</Text>
                </View>
                <View style={styles.chartContainer}>
                    <View style={styles.chartWrapper}>
                        <View style={styles.yAxisContainer}>
                            {[700, 650, 600, 550, 500, 450, 400, 350, 300, 250, 200, 150, 100, 50, 0].map((value, index) => (
                                <Text key={index} style={styles.yAxisLabel}>
                                    {value}
                                </Text>
                            ))}
                        </View>
                        <ScrollView horizontal contentContainerStyle={styles.chartScrollContainer}>
                            <View style={styles.chartInnerContainer}>
                                <LineChart
                                    data={{
                                        labels: labels,
                                        datasets: [
                                            {
                                                data: sugarConcentration,
                                                color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                                                strokeWidth: 0.8,
                                            },
                                        ],
                                        legend: ["Sugar Concentration"]
                                    }}
                                    width={Math.max(windowWidth - 35, labels.length * 50)}
                                    height={windowHeight * 0.75}
                                    yAxisSuffix=""
                                    yAxisInterval={1}
                                    fromZero={true}
                                    yAxisLabel=""
                                    chartConfig={{
                                        backgroundColor: '#DFDFDF',
                                        backgroundGradientFrom: '#603F83FF',
                                        backgroundGradientTo: '#DFDFDF',
                                        decimalPlaces: 0,
                                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                        style: {
                                            borderRadius: 16,
                                        },
                                        propsForDots: {
                                            r: '4',
                                            strokeWidth: '0.2',
                                            stroke: '#007AFF',
                                        },
                                        propsForBackgroundLines: {
                                            strokeDasharray: '',
                                        },
                                        fillShadowGradient: '#007AFF',
                                        fillShadowGradientOpacity: 0.1,
                                        propsForLabels: {
                                            fontSize: 10,
                                            fontWeight: 'normal',
                                        },
                                    }}
                                    yLabelsOffset={9}
                                    bezier
                                    segments={14}
                                    style={styles.chart}
                                    renderDotContent={({ x, y, index }) => (
                                        <View
                                            key={index}
                                            style={{
                                                position: 'absolute',
                                                left: x - 2,
                                                top: y - 68,
                                            }}
                                        >
                                            <Text style={styles.dotLabel}>
                                                {insulinIntake[index]}
                                            </Text>
                                        </View>
                                    )}
                                />
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};



const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollViewContainer: {
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
    topContainer: {
        padding: 20,
        backgroundColor: '#603F83FF',
        height: windowHeight * 0.10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginLeft: windowWidth * -0.03,
        marginTop: windowHeight * -0.03,
        width: '120%',
    },
    backButton: {
            position: 'absolute',
            left: windowWidth * 0.1,
            top: windowHeight * 0.040,
          },
    topTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFFFFF',
        position: 'absolute',
        left: windowWidth * 0.35,
        top: windowHeight * 0.035,
    },
    chartContainer: {
        marginTop: windowHeight * 0.01,
        position: 'relative',
    },
    chartWrapper: {
        flexDirection: 'row',
    },
    chartScrollContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    chartInnerContainer: {
        paddingHorizontal: 20,
    },
    xAxisContainer: {
        position: 'absolute',
        bottom: 0,
        left: 10,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 10,
        backgroundColor: 'transparent',
    },
    xAxisLabel: {
        fontSize: 10,
        textAlign: 'center',
    },
    chart: {
        borderRadius: 10,
        height: windowHeight * 0.85,
    },
    yAxisContainer: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginRight: 14,  // Space between the chart and the labels
        paddingVertical: 0,
        marginTop: windowHeight * -0.026,
    },
    yAxisLabel: {
        fontSize: 10,
        textAlign: 'center',
        marginVertical: 8.3,  // Space between each label
    },
    dotLabel: {
        fontSize: 7,
        color: 'black',
        textAlign: 'center',
    },
   container:{
    marginTop: windowHeight * 0.4,
    marginLeft: windowHeight * 0.18,
    fontSize: 30, // Larger font size
    fontWeight: 'bold', // Bold text
    color: '#FF4C4C', // Red color for emphasis
    textAlign: 'center',
    
   }
});

export default LineGraphExample;
