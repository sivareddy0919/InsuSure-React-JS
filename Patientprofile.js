import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Config from './Config'; 

const UserDetails = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { username } = route.params;
    const [userDetails, setUserDetails] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (username) {
            fetchUserDetails(username);
        }
    }, [username]);

    const fetchUserDetails = (username) => {
        axios.get(`${Config.API_BASE_URL}/patientprofile.php`, {
            params: { username }
        })
        .then(response => {
            console.log('API Response:', response.data);
            if (response.data.status === 'success') {
                setUserDetails(response.data.data);
                setError('');
            } else {
                setError(response.data.message);
                setUserDetails(null);
            }
        })
        .catch(error => {
            console.error('API Error:', error);
            setError('An error occurred. Please try again.');
            setUserDetails(null);
        });
    };

    return (
        <ScrollView contentContainerStyle={[styles.container, { height: windowHeight, width: windowWidth }]}>
            <View style={styles.topContainer}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={windowWidth*0.08} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.screenTitle}>User Details</Text>
            </View>
            <View style={styles.gradient}>
                <View style={styles.header}>
                    {userDetails && userDetails.image_path && (
                        <Image
                            source={{ uri: `${Config.API_BASE_URL}/${userDetails.image_path}` }}
                            style={styles.profileImage}
                        />
                    )}
                    {userDetails && (
                        <Text style={styles.name}>{userDetails.pname}</Text>
                        
                    )}
                </View>
                {error ? <Text style={styles.error}>{error}</Text> : null}
                {userDetails ? (
                    <View style={styles.detailsContainer}>
                        <View style={styles.details}>
                            <Text style={styles.label}>Username</Text>
                            <TextInput
                                style={styles.input}
                                value={userDetails.username}
                                editable={false}
                                placeholder="Username"
                                placeholderTextColor="#FFFFFF"
                            />
                            <Text style={styles.label}>Mobile</Text>
                            <TextInput
                                style={styles.input}
                                value={userDetails.mob}
                                editable={false}
                                placeholder="Mobile"
                                placeholderTextColor="#FFFFFF"
                            />
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.input}
                                value={userDetails.mail}
                                editable={false}
                                placeholder="Email"
                                placeholderTextColor="#FFFFFF"
                            />
                            <Text style={styles.label}>Gender</Text>
                            <TextInput
                                style={styles.input}
                                value={userDetails.gender}
                                editable={false}
                                placeholder="Gender"
                                placeholderTextColor="#FFFFFF"
                            />
                            <Text style={styles.label}>Age</Text>
                            <TextInput
                                style={styles.input}
                                value={userDetails.age.toString()}
                                editable={false}
                                placeholder="Age"
                                placeholderTextColor="#FFFFFF"
                            />
                        </View>
                    </View>
                ) : null}
            </View>
        </ScrollView>
    );
};
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#FFFFFF',
    },
    topContainer: {
        width: '100%',
        height: '10%',
        backgroundColor: '#603F83FF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    backButton: {
    position: 'absolute',
    left: windowWidth * 0.10,
    top: windowHeight * 0.03,
 },
    screenTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
        left: windowWidth * 0.38,
        top: windowHeight * 0.001,
    },
    gradient: {
        flex: 1,
        padding: 16,
        backgroundColor: '#E9E4F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: -10,
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 90,
        marginBottom: -100,
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000000',
        top: 110,
    },
    detailsContainer: {
        width: '100%',
        padding: 15,
        marginTop: 130,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        height: '70%',
    },
    details: {
        marginTop: 0,
    },
    label: {
        fontSize: 16,
        color: '#000000',
        marginBottom: 5,
        marginTop: 10,
        marginLeft: 5,
    },
    input: {
        backgroundColor: '#603F83FF',
        borderRadius: 8,
        padding: 10,
        marginTop: -2,
        fontSize: 18,
        color: '#FFFFFF',
    },
    error: {
        color: 'red',
        fontSize: 16,
        marginVertical: 10,
    },
});

export default UserDetails;
