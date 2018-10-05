import React, { Component } from 'react';
import {
  PermissionsAndroid,
  Text,
  View,
  StyleSheet,
  TouchableNativeFeedback,
  ToastAndroid,
} from 'react-native';
import openMap from 'react-native-open-maps';

async function requestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
      'title': 'Geolocation Permission Required',
      'message': 'This app needs to access your device location',
      }
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Location permission granted')
    }
    else {
      console.log('Location permission denied')
    }
      return granted;
    }
    catch (err) {
    console.warn(err)
  }
}

type Props={};
export default class loginScreen extends React.Component {
  static navigationOptions = {
    title: 'Map Location',
  };

  constructor(props) {
    super(props)

    this.state={
      granted: PermissionsAndroid.RESULTS.DENIED,
      position: null,
      destination: "3.1179,101.6778",
    }

    this.readLocation = this.readLocation.bind(this);
    this.onPress = this.onPress.bind(this);
  }

  componentDidMount() {
    let granted = requestLocationPermission();
    this.setState({
        granted: granted,
    })
    if(granted) {this.readLocation();}
    }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID)
  }

  readLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => this.setState({position}),
      (error) => console.log(error.message),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000
      }
      );

    this.watchID = navigator.geolocation.watchPosition((position) => {
    this.setState({position});
    });
  }

  onPress(){
    if(this.state.position){
      let start = this.state.position.coords.latitude.toString() + ',' + this.state.position.coords.longitude.toString();
      openMap({
        end: this.state.destination,
        start: start,
        travelType: 'drive',
      })
    }
    else{
      ToastAndroid.show('Location is unknown!', ToastAndroid.LONG);
    }
  }

  render(){
    return (
      <View>
        <Text>MidValley Megamall is used as the target destination.</Text>
        <TouchableNativeFeedback onPress={this.onPress}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>
            Navigate
            </Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  button: {
    backgroundColor: 'skyblue',
    margin: 50,
    borderWidth: 0.5,
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    padding: 20,
    textAlign: 'center',
  },
});
