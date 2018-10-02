import React, { Component } from 'react';
import {
  Text,
  View,
} from 'react-native';

type Props={};
export default class loginScreen extends React.Component {
  static navigationOptions = {
    title: 'Map Location',
  };

  constructor(props) {
    super(props)

  }

  render(){
    return (
      <View>
      <Text>This page is under construction!</Text>
      </View>
    );
  }
}
