import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity, Alert, Modal, Image, Animated, TouchableWithoutFeedback } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useRoute } from '@react-navigation/native';
 

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const Page1 = () => (
  <View style={[styles.pageContainer, { backgroundColor: '#BBB7B7' }]}>
    <Image source={require('./assets/scroll1.png')} style={styles.image} />
    <Text>Page 1 Content</Text>
  </View>
);

const Page2 = () => (
  <View style={[styles.pageContainer, { backgroundColor: '#DDD' }]}>
    <Image source={require('./assets/scroll2.png')} style={styles.image} />
    <Text>Page 2 Content</Text>
  </View>
);

const Page3 = () => (
  <View style={[styles.pageContainer, { backgroundColor: '#AAA' }]}>
    <Image source={require('./assets/scroll3.png')} style={styles.image} />
    <Text>Page 3 Content</Text>
  </View>
);

const PatientDashboard = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { username } = route.params;
  const [glucoseEntries, setGlucoseEntries] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // State to track current page index
  const scrollViewRef = React.useRef();
  const [currentScrollPos, setCurrentScrollPos] = useState(0);
  const menuAnimation = useState(new Animated.Value(-250))[0];

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollViewRef.current) {
        const nextIndex = (currentImageIndex + 1) % 3; // Assuming 3 pages
        scrollViewRef.current.scrollTo({ x: nextIndex * windowWidth, animated: true });
        setCurrentImageIndex(nextIndex);
        setCurrentScrollPos(nextIndex * windowWidth);
      }
    }, 3000); // Adjust the time interval as needed

    return () => clearInterval(interval);
  }, [currentImageIndex]);

  const handleViewGlucoseEntry = () => {
    navigation.navigate('GlucoseEntry', { username });
  };

  const handleViewTodayButton = () => {
    navigation.navigate('Todayrecord', { username });
  };

  const handleViewYesterdayButton = () => {
    navigation.navigate('Yesterdayrecord', { username });
  };

  const handleGlucoseTracker = () => {
    navigation.navigate('GlucoseTracker', { username });
  };

  const handlesignOutIconClick = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Logout cancelled"),
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: () => navigation.navigate('Patientlogin')
        }
      ],
      { cancelable: false }
    );
  };

  const handleplusIconClick = () => {
    navigation.navigate('Glucosepending', { username });
  };

  const handleDateButton = () => {
    navigation.navigate('DateScreen', { username });
  };

  const handleMenuIconClick = () => {
    if (isModalVisible) {
      Animated.timing(menuAnimation, {
        toValue: -250,
        duration: 300,
        useNativeDriver: true
      }).start(() => setIsModalVisible(false));
    } else {
      setIsModalVisible(true);
      Animated.timing(menuAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start();
    }
  };

  const handleBellIconClick = () => {
    navigation.navigate('PatientNotification');
  };

  const handleProfileNavigation = () => {
    navigation.navigate('Patientprofile', { username });
  };

  const closeMenu = () => {
    Animated.timing(menuAnimation, {
      toValue: -250,
      duration: 300,
      useNativeDriver: true
    }).start(() => setIsModalVisible(false));
  };

  const handleScreenTap = () => {
    if (isModalVisible) {
      closeMenu();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleScreenTap}>
      <View style={styles.mainContainer}>
        <View style={styles.topContainer}>
          <TouchableOpacity onPress={handleMenuIconClick}>
            <FontAwesome name="bars" size={35} style={styles.menuIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleProfileNavigation}>
            <FontAwesome name="user" size={30} style={styles.profileIcon} />
          </TouchableOpacity>
          <Text style={styles.heading}>{username}</Text>
        </View>
        <View style={styles.container}>
          <View style={styles.upperContainer}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              ref={scrollViewRef}
              onScroll={(event) => {
                const contentOffsetX = event.nativeEvent.contentOffset.x;
                const index = Math.round(contentOffsetX / Dimensions.get('window').width);
                setCurrentImageIndex(index);
                setCurrentScrollPos(contentOffsetX);
              }}>
              <Page1 />
              <Page2 />
              <Page3 />
            </ScrollView>
          </View>
          {/* Scroll Indicator Container */}
          <View style={styles.scrollIndicatorContainer}>
            <View style={[styles.scrollIndicator, currentImageIndex === 0 && styles.scrollIndicatorActive]} />
            <View style={[styles.scrollIndicator, currentImageIndex === 1 && styles.scrollIndicatorActive]} />
            <View style={[styles.scrollIndicator, currentImageIndex === 2 && styles.scrollIndicatorActive]} />
          </View>
          <View style={styles.grayContainer}>
            <View style={styles.circleButtonContainer}>
              <TouchableOpacity style={[styles.circleButton, { backgroundColor: '#603F83FF', width: 80, height: 80, borderRadius: 10 }]} onPress={handleViewTodayButton}>
                <Text style={[styles.buttonText, { color: '#FFFFFF' }, { fontSize: 15 }]}>Today</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.circleButton, { backgroundColor: '#603F83FF', width: 80, height: 80, borderRadius: 10 }]} onPress={handleViewYesterdayButton}>
                <Text style={[styles.buttonText, { color: '#FFFFFF' }, { fontSize: 15 }]}>Yesterday</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.circleButton, { backgroundColor: '#603F83FF', width: 80, height: 80, borderRadius: 10 }]} onPress={handleDateButton}>
                <Text style={[styles.buttonText, { color: '#FFFFFF' }, { fontSize: 15 }]}>Date</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.additionalGrayContainer}>
            <FontAwesome name="home" size={35} style={styles.homeIcon} />
            <FontAwesome name="plus" size={30} style={styles.plusIcon} onPress={handleplusIconClick} />
            <FontAwesome name="sign-out" size={35} style={styles.signOutIcon} onPress={handlesignOutIconClick} />
          </View>
          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={handleViewGlucoseEntry} style={styles.iconButton}>
              <View style={styles.iconButton}>
                <FontAwesome name="edit" size={65} style={styles.icon} />
              </View>
              <Text style={styles.iconText}> Glucose Entry</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleGlucoseTracker} style={styles.iconButton}>
              <View style={styles.iconButton}>
                <FontAwesome name="clipboard" size={65} style={styles.icon} />
              </View>
              <Text style={styles.iconText}> Record</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.scrollView}>
            {glucoseEntries.map(entry => (
              <Text key={entry.id} style={styles.entryText}>
                {entry.timestamp}: {entry.level} mg/dL
              </Text>
            ))}
          </ScrollView>
        </View>
        {isModalVisible && (
          <TouchableWithoutFeedback onPress={handleScreenTap}>
            <Animated.View style={[styles.modalContainer, { transform: [{ translateX: menuAnimation }] }]}>
              <TouchableOpacity style={styles.menuItem}>
                <FontAwesome name="home" size={24} style={styles.menuIcon} />
                <Text style={styles.menuText}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleViewGlucoseEntry} style={styles.menuItem}>
                <FontAwesome name="edit" size={24} style={styles.menuIcon} />
                <Text style={styles.menuText}>Glucose Entry</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleBellIconClick} style={styles.menuItem}>
                <FontAwesome name="bell" size={24} style={styles.menuIcon} />
                <Text style={styles.menuText}>Notifications</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleViewTodayButton} style={styles.menuItem}>
                <FontAwesome name="calendar" size={24} style={styles.menuIcon} />
                <Text style={styles.menuText}>Today's Record</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleViewYesterdayButton} style={styles.menuItem}>
                <FontAwesome name="calendar" size={24} style={styles.menuIcon} />
                <Text style={styles.menuText}>Yesterday's Record</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleGlucoseTracker} style={styles.menuItem}>
                <FontAwesome name="clipboard" size={24} style={styles.menuIcon} />
                <Text style={styles.menuText}>Glucose Tracker</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleProfileNavigation} style={styles.menuItem}>
                <FontAwesome name="user" size={24} style={styles.menuIcon} />
                <Text style={styles.menuText}>Profile</Text>
              </TouchableOpacity>
            </Animated.View>
          </TouchableWithoutFeedback>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topContainer: {
    paddingTop: windowHeight * 0.01,
    paddingHorizontal: windowWidth * 0.05,
    backgroundColor: '#603F83FF',
    borderBottomWidth: 0,
    borderBottomColor: '#FFFFFF',
    height: windowHeight * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    paddingHorizontal: windowWidth * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
  },
  upperContainer: {
    marginBottom: windowHeight * 0.10,
    borderRadius: 0,
    width: '90%',
    height: windowHeight * 0.2,
    top: windowHeight * 0.04,
  },
  scrollView: {
    flex: 1,
    marginBottom: windowHeight * 0.02,
  },
  entryText: {
    fontSize: windowHeight * 0.030,
    marginBottom: windowHeight * 0.01,
  },
  additionalGrayContainer: {
    backgroundColor: '#603F83FF',
    borderRadius: 25,
    width:'95%',
    paddingVertical: windowHeight * -0.00,
    paddingHorizontal: windowWidth * 0.40,
    marginBottom: windowHeight * 0.025,
    top: windowWidth * 0.50,
    height: windowHeight * 0.09,
  },
  grayContainer: {
    backgroundColor: '#DFDFDF',
    width: '90%',
    borderRadius: 10,
    paddingVertical: windowHeight * -0.1,
    height: windowHeight * 0.17,
    marginBottom: windowHeight * 0.01,
  },
  circleButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: windowHeight * 0.033,
   
  },
  circleButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  profileIcon: {
    color: '#DFDFDF',
    marginLeft:windowWidth * 0.7,
  },
  homeIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
    color: '#DFDFDF',
    right: windowWidth * 0.3,
    top: windowHeight * 0.025,
  },
  plusIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
    color: '#DFDFDF',
    top: windowHeight * -0.022,
    right: windowWidth * 0.015,
  },
  signOutIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
    color: '#DFDFDF',
    left: windowWidth * 0.25,
    top: windowHeight * -0.077,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    left: windowWidth * -0.5,
    color: '#DFDFDF',
  },
  menuIcon: {
    color: '#DFDFDF',
    marginLeft: windowWidth * 0.03,
  },
  menu: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    color:'red',
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
  },
  menuText: {
    fontSize: 18,
    marginLeft: 15,
    color: '#333',
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#000000',
    fontSize: 18,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '70%',
    marginTop: windowHeight * -0.07,
    left: '5%',
    backgroundColor:'#FFFFFF'
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor:'#FFFFFF',
    marginLeft: windowHeight *0.025,
  },
  icon: {
    color: '#603F83FF',
    marginBottom: windowHeight * -0.01,
    right:'50%',
  },
  iconText: {
    color: '#603F83FF',
    fontSize: windowHeight * 0.025,
    fontWeight: 'bold',
    top: '20%',
    left: '-40%',
  },
  // Scroll Indicator Styles
  scrollIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -30,
  },
  scrollIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#AAA',
    marginHorizontal: 5,
    marginBottom: '10%',
  },
  scrollIndicatorActive: {
    backgroundColor: '#603F83FF',
  },
  pageContainer: {
    width: Dimensions.get('window').width,
    height: '120%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    position: 'absolute',
    top: 77,
    left: 0,
    width: '70%',
    height: '90%',
    backgroundColor:'#FFFFFF',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
  },
  menuText: {
    fontSize: 18,
    marginLeft: 15,
    color: '#000000',
  },
  closeButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#000000',
    fontSize: 18,
  },
  image: {
    width: '120%',
    height: '90%', // Adjust height as per your design
    resizeMode: 'cover',
    marginBottom: 20,
    borderRadius:10,
  },
});

export default PatientDashboard;
