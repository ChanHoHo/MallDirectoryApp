import React, { Component } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableHighlight,
  AppState,
  Image,
} from 'react-native';

type Props = {};
export default class FloorPlanScreen extends Component{
  static navigationOptions = {
    title: 'Floor Plan',
    headerStyle: {
         backgroundColor: '#204D02'
      }
  };

  render(){
    return(
      <ScrollView style={styles.container}>
        <Text style={styles.text}>{'Level 3'}</Text>
        <Image source={require('./maps/level3.jpg')} style={styles.image}/>
        <Text style={styles.text}>{'Level 2'}</Text>
        <Image source={require('./maps/level2.jpg')} style={styles.image}/>
        <Text style={styles.text} >{'Level 1'}</Text>
        <Image source={require('./maps/level1.jpg')} style={styles.image}/>
        <Text style={styles.text}>{'Level G'}</Text>
        <Image source={require('./maps/level_g.jpg')} style={styles.image}/>
        <Text style={styles.text}>{'Level LG'}</Text>
        <Image source={require('./maps/level_lg.jpg')} style={styles.image}/>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  output: {
    fontSize: 24,
    color: '#000099',
    marginTop: 10,
    marginBottom: 10,
  },
  image:{
    flex: 1,
        alignSelf: 'stretch',
        width: '100%',
        height:160,
  },
  text:{
    textAlign:'center',
    color:'black',
    fontSize: 20,
  }
});
