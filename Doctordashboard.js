import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  Dimensions, 
  Image, 
  TouchableOpacity, 
  Alert, 
  Animated, 
  BackHandler 
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import Config from './Config'; 

const windowWidth = Dimensions.get('window').width;



const Doctordashboard = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { username } = route.params;

  const [patientData, setPatientData] = useState([]);
  const [pendingEntries, setPendingEntries] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const menuAnimation = useState(new Animated.Value(-250))[0];
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await fetch(`${Config.API_BASE_URL}/Viewall.php`);
        const data = await response.json();
        setPatientData(data);
      } catch (error) {
        console.error('Error fetching patient data:', error);
      }
    };

    const fetchPendingEntries = async () => {
      try {
        const response = await fetch(`${Config.API_BASE_URL}/RecentPatients.php`);
        const result = await response.json();
        if (result.status === 'success' && Array.isArray(result.data)) {
          setPendingEntries(result.data);
        } else {
          console.error('Unexpected data format:', result);
        }
      } catch (error) {
        console.error('Error fetching pending entries:', error);
      }
    };

    fetchPatientData();
    fetchPendingEntries();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      handleAutoScroll();
    }, 3000);

    return () => clearInterval(interval);
  }, [currentImageIndex]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        handleSignOutIconClick();
        return true; // Prevent default back action
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  const handleProfileNavigation = () => {
    navigation.navigate('Doctorprofile');
  };

  const handleSearchIconClick = () => {
    const patientsInfo = patientData.map(patient => ({
      username: patient.username,
      gender: patient.gender,
      image_path: patient.image_path,
      age: patient.age,
      mob: patient.mob,
    }));
    navigation.navigate('DoctorSearch', { patientsInfo });
  };

  const handleViewAllClick = () => {
    const patientsInfo = patientData.map(patient => ({
      username: patient.username,
      gender: patient.gender,
      image_path: patient.image_path,
      age: patient.age,
      mob: patient.mob,
    }));
    navigation.navigate('DoctorSearch', { patientsInfo });
  };

  const handlePlusIconClick = () => {
    navigation.navigate('insulinentry');
  };

  const handleSignOutIconClick = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to Logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => navigation.navigate('Doctorlogin') },
      ],
      { cancelable: false }
    );
  };

  const handleMenuIconClick = () => {
    if (isModalVisible) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  const openMenu = () => {
    setIsModalVisible(true);
    Animated.timing(menuAnimation, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    setIsModalVisible(false);
    Animated.timing(menuAnimation, {
      toValue: -250,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const handleHomeNavigation = () => {
    navigation.navigate('Doctordashboard', { username });
    closeMenu();
  };

  const handlePatientListNavigation = () => {
    const patientsInfo = patientData.map(patient => ({
      username: patient.username,
      gender: patient.gender,
      image_path: patient.image_path,
      age: patient.age,
      mob: patient.mob,
    }));
    navigation.navigate('DoctorSearch', { patientsInfo });
  };

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / windowWidth);
    setCurrentImageIndex(index);
  };

  const handleAutoScroll = () => {
    if (scrollViewRef.current) {
      const nextIndex = (currentImageIndex + 1) % 3; // Cycle through images (0, 1, 2)
      scrollViewRef.current.scrollTo({ x: nextIndex * windowWidth, animated: true });
      setCurrentImageIndex(nextIndex);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.topContainer}>
        <TouchableOpacity style={styles.menuIconContainer} onPress={handleMenuIconClick}>
          <FontAwesome name="bars" size={34} style={styles.menuIcon} />
        </TouchableOpacity>
        <Text style={styles.heading}>{username}</Text>
        <TouchableOpacity onPress={handleProfileNavigation}>
          <FontAwesome name="user" size={30} style={styles.profileIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <View style={styles.upperContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            pagingEnabled
          >
            <Image source={require('./assets/scroll1.png')} style={styles.image} />
            <Image source={require('./assets/scroll2.png')} style={styles.image} />
            <Image source={require('./assets/scroll3.png')} style={styles.image} />
          </ScrollView>
        </View>
        <View style={styles.scrollIndicatorContainer}>
          <View style={[styles.scrollIndicator, currentImageIndex === 0 && styles.scrollIndicatorActive]} />
          <View style={[styles.scrollIndicator, currentImageIndex === 1 && styles.scrollIndicatorActive]} />
          <View style={[styles.scrollIndicator, currentImageIndex === 2 && styles.scrollIndicatorActive]} />
        </View>
        <View style={styles.grayContainer}>
          {pendingEntries.length > 0 ? (
            <ScrollView horizontal contentContainerStyle={styles.scrollContainer}>
              {pendingEntries.map((entry, index) => (
                <TouchableOpacity
                  key={entry.id || index} // Ensure a unique key for each entry
                  style={styles.pendingEntryContainer}
                  onPress={() => navigation.navigate('IndividualinsulinEntry', { 
                    username: entry.username,
                    datetime: entry.datetime,
                    sugar_concentration: entry.sugar_concentration,
                    note: entry.note,
                    unit: entry.unit,
                    session: entry.session
                  })}
                >
                  <Image source={{ uri: `${Config.API_BASE_URL}/${entry.image_path}` }} style={styles.profileImage} />
                  <Text style={styles.pendingEntryText}>User:{entry.username}</Text>
                  <Text style={styles.pendingEntryText}>{entry.sugar_concentration} {entry.unit}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.NoPendingEntriesText}>No Pending Entries</Text>
          )}
        </View>
        <View style={styles.scrollWrapper}>
          <ScrollView style={styles.newContainer}>
            {patientData.map((patient, index) => (
              <TouchableOpacity
                key={patient.id || index} // Ensure a unique key for each patient
                style={styles.patientInnerContainer}
                onPress={() => navigation.navigate('Patientdetails', {
                  patient: {
                    username: patient.username,
                    gender: patient.gender,
                    image_path: patient.image_path,
                    age: patient.age,
                    mob: patient.mob,
                  }
                })}
              >
                <Image source={{ uri: `${Config.API_BASE_URL}/${patient.image_path}`}} style={styles.patientImage} />
                <View style={styles.patientInfo}>
                  <Text style={styles.patientText}>Username: {patient.username}</Text>
                  <Text style={styles.patientText}>Gender: {patient.gender}</Text>
                </View>
                <Text style={styles.detailsButtonText}>Details</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View style={styles.additionalGrayContainer}>
          <FontAwesome name="home" size={35} style={styles.homeIcon} onPress={handleHomeNavigation} />
          <FontAwesome name="search" size={32} style={styles.searchIcon} onPress={handleSearchIconClick} />
          <FontAwesome name="plus" size={35} style={styles.plusIcon} onPress={handlePlusIconClick} />
          <FontAwesome name="sign-out" size={35} style={styles.signOutIcon} onPress={handleSignOutIconClick} />
        </View>
        </View>
      {isModalVisible && (
        <Animated.View style={[styles.modalContainer, { transform: [{ translateX: menuAnimation }] }]}>
          <TouchableOpacity onPress={handleHomeNavigation} style={styles.menuItem}>
            <FontAwesome name="home" size={24} style={styles.menuIcon} />
            <Text style={styles.menuText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePlusIconClick} style={styles.menuItem}>
            <FontAwesome name="plus" size={24} style={styles.menuIcon} />
            <Text style={styles.menuText}>Insulin Entry</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleProfileNavigation} style={styles.menuItem}>
            <FontAwesome name="user" size={24} style={styles.menuIcon} />
            <Text style={styles.menuText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePatientListNavigation} style={styles.menuItem}>
            <FontAwesome name="users" size={24} style={styles.menuIcon} />
            <Text style={styles.menuText}>Patient List</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSignOutIconClick} style={styles.menuItem}>
            <FontAwesome name="sign-out" size={24} style={styles.menuIcon} />
            <Text style={styles.menuText}>Sign Out</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
      <TouchableOpacity style={styles.floatingButton} onPress={handleViewAllClick}>
     <Text style={styles.floatingButtonText}>View All</Text>
   </TouchableOpacity>
      </View>
  );
};

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topContainer: {
    paddingTop: windowHeight * 0.05,
    paddingHorizontal: windowWidth * 0.05,
    backgroundColor: '#603F83FF',
    height: windowHeight * 0.10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuIconContainer: {
    marginLeft: 10,
  },
  menuIcon: {
    color: '#DFDFDF',
    marginTop: windowHeight * -0.04,
  },
  heading: {
    fontSize: 24,
    marginTop: windowHeight * -0.04,
    fontWeight: 'bold',
    color: '#DFDFDF',
  },
  modalContainer: {
    position: 'absolute',
    top: 107,
    left: 0,
    width: '90%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  profileIcon: {
    color: '#DFDFDF',
    right: windowWidth * 0.05,
    marginTop: windowHeight * -0.04,
  },
  container: {
    flex: 1,
    backgroundColor:'#FFFFFF'
  },
  upperContainer: {
    marginTop: windowHeight * 0.01,
  },
  scrollContainer: {
    flexDirection: 'row',
  },
  image: {
    width: windowWidth * 0.9,
    height: windowHeight * 0.2,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  scrollIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:windowHeight *0.01,
    marginBottom: windowHeight * 0.03,
  },
  scrollIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#DFDFDF',
    marginHorizontal: 7,
  },
  scrollIndicatorActive: {
    backgroundColor: '#603F83FF',
  },
  grayContainer: {
    backgroundColor: '#DFDFDF',
    borderRadius: 10,
    width:windowWidth * 0.9,
    height:windowHeight *0.14,
    paddingVertical: windowHeight * 0.01,
    marginBottom: windowHeight * 0.04,
    alignSelf: 'center',
    marginTop: windowHeight * -0.02,
  },
   profileImage: {
    width: 0,
    height: 0,
    borderRadius: 10,
    marginBottom: 5,
  },
  scrollContainer: {
    padding: 10,
    alignItems: 'center',
  },
  pendingEntryContainer: {
    margin: 10,
    backgroundColor: '#603F83FF', // Example background color
    padding: 10,
    borderRadius: 10,
    alignItems: 'center', // Center items horizontally
    marginRight:windowWidth *0.02,
    height:windowHeight *0.09,
  },
  pendingEntryText: {
    fontSize: 16,
    color: '#FFFFFF', // Adjust text color for better readability
  },
  NoPendingEntriesText: {
    fontSize: 18,
    color: '#000000', // Adjust text color for better readability
    marginTop:windowHeight* 0.05,
    marginLeft:windowHeight* 0.1,
  },

  scrollWrapper: {
    backgroundColor: '#DFDFDF',
    borderRadius: 15,
    width: '90%',
    height: windowHeight * 0.3,
    marginBottom: windowHeight * 0.02,
    marginTop: windowHeight * 0.01,
    alignSelf: 'center',
  },
  newContainer:{
    backgroundColor:'#DFDFDF',
    marginTop: windowWidth *-0.08,
    borderRadius:10,
  },
  patientInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#603F83FF',
    padding: 9,
    borderRadius: 10,
    marginTop: windowWidth *0.03,
    marginBottom: windowHeight * 0.01,
    width: '90%',
    alignSelf: 'center',
  },
  patientImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  patientInfo: {
    flex: 1,
  },
  patientText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  detailsButtonText: { 
    color: '#FFFFFF',
    marginTop: windowHeight * 0.04,
  },
  additionalGrayContainer: {
    backgroundColor: '#603F83FF',
    borderRadius: 25,
    width: '90%', // Adjust width to ensure it stays within screen bounds
    paddingVertical: windowHeight * 0.022,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '10%', // Adjusted to percentage to better fit different screen sizes
    marginTop: windowHeight * 0.00, // Slightly increased margin for better spacing
    alignSelf: 'center',
    position: 'absolute', // Use position absolute to fix it at the bottom
    bottom: windowHeight * -0.13, // Slightly above the bottom edge to prevent overlap
  },
  homeIcon: {
    color: '#DFDFDF',
  },
  searchIcon: {
    color: '#DFDFDF',
  },
  plusIcon: {
    color: '#DFDFDF',
  },
  signOutIcon: {
    color: '#DFDFDF',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    marginTop:windowHeight*0.02,
  },
  menuText: {
    marginLeft: 14,
   top : windowHeight * -0.02,
    fontSize: 18,
    color: '#000',
  },
  closeButton: {
    alignSelf: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: '#603F83FF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    position: 'absolute',
    top: 78,
    left: 0,
    width: '65%',
    height: '100%',
    backgroundColor:'#FFFFFF',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  floatingButton: {
    bottom: 20,
    right: windowWidth * -0.76,
    backgroundColor: '#DFDFDF',
    width: windowWidth *0.18,
    height: windowHeight * 0.03,
    marginBottom : windowHeight * 0.13,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
  },
  floatingButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    textDecorationLine: 'underline',
  
  }
});

export default Doctordashboard;
