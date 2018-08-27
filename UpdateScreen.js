import React, { Component } from 'react';
import{
  Alert,
  StyleSheet,
  ScrollView,
  View,
} from 'react-native';
import{
  InputWithLabel,
  AppButton,
} from './UI';

let config = require('./config');

Date.prototype.formatted = function() {
  let day = this.getDay();
  let date = this.getDate();
  let month = this.getMonth();
  let year = this.getFullYear();
  let daysText = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  let monthsText = [
    'Jan','Feb','Mar','Apr','May','Jun',
    'Jul','Aug','Sep','Oct','Nov','Dec'
  ];

  return `${daysText[day]}, ${monthsText[month]} ${date}, ${year}`;
}

type Props={};
export default class UpdateScreen extends Component<Props>{
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Edit'
    };
  };

  constructor(props){
    super(props)

    this.state={
      id: this.props.navigation.getParam('id'),
      password:'',
      cardnumber:'',
      contactNumber:'',
      name:'',
      membership:'',
      rewardpoint:'',
    };

    this._load = this._load.bind(this);
    this._update= this._update.bind(this);
  }

  componentDidMount(){
    if(this.state.id > 0){
    this._load();
    }
  }

  _load(){
    let url = config.settings.serverPath + '/api/members/' + this.state.id;

    fetch(url)
    .then((response) => {
      if(!response.ok){
        Alert.alert('Error', response.status.toString());
        throw Error('Error' + response.status);
      }

      return response.json()
    })
    .then((member) =>{
      this.setState({
      password:member.password,
      name:member.name,
      contactNumber: member.contactnumber,
      cardnumber:member.cardnumber,
      rewardpoint:member.rewardpoint,
      membership: new Date(member.membership).formatted(),
      });
    })

    .catch((error) =>{
      console.error(error);
    });
  }

  _update(){
    let url = config.settings.serverPath + '/api/members/' + this.state.id;

    fetch(url,{
      method:'PUT',
      headers:{
        Accept: 'application/json',
        'Content-Type':'application/json',
      },
      body:JSON.stringify({
        id: this.state.id,
        password:this.state.password,
        contactnumber:this.state.contactNumber,
        cardnumber:this.state.cardnumber,
        rewardpoint:this.state.rewardpoint,
        membership: this.state.membership,
        name:this.state.name,
      }),
    })
    .then((response) => {
      if(!response.ok) {
        Alert.alert('Error', response.status.toString());
        throw Error('Error ' + response.status);
      }

      return response.json()
    })
    .then((responseJson) =>{
      if(responseJson.affected > 0){
        Alert.alert('Profile updated')
      }
      else{
        Alert.alert('Unable to update profile')
      }

    this.props.navigation.getParam('refresh')();
    this.props.navigation.goBack();
    })
    .catch((error) =>{
      console.error(error);
    });
  }

  render(){
    return(
      <ScrollView stye={styles.container}>
        <InputWithLabel style={styles.output}
        label={'Name'}
        value={this.state.name}
        editable={false}
        orientation={'vertical'}
        />
        <InputWithLabel style={styles.output}
        label={'Card Number'}
        value={this.state.cardnumber}
        editable={false}
        orientation={'vertical'}
        />
        <InputWithLabel style={styles.input}
        label={'Password'}
        value={this.state.password}
        onChangeText={(password) => {this.setState({password})}}
        orientation={'vertical'}
        />
        <InputWithLabel style={styles.input}
        label={'Contact Number'}
        value={this.state.contactNumber}
        keyboardType={'phone-pad'}
        onChangeText={(contactNumber) => {this.setState({contactNumber})}}
        orientation={'vertical'}
        />
        <InputWithLabel style={styles.output}
        label={'Reward Point'}
        value={this.state.rewardpoint.toString()}
        editable={false}
        orientation={'vertical'}
        />
        <InputWithLabel style={styles.output}
        label={'Membership'}
        value={this.state.membership}
        editable={false}
        orientation={'vertical'}
        />
        <AppButton style={styles.button}
        title={'Save'}
        theme={'primary'}
        onPress={this._update}
        />
        </ScrollView>
    );
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
    color: 'grey',
    marginTop: 10,
    marginBottom: 10,
  },
  input: {
    fontSize: 24,
    color: 'black',
    marginTop: 10,
    marginBottom: 10,

  },
  button: {
    marginTop: 10,
    marginBottom: 50,
  },
});
