import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

export default class MemberScreen extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <Text
          style={styles.text}
        >{'MemberScreen'}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ff9900',
  },
  text: {
    fontSize: 48,
    color: 'black',
  },
})
