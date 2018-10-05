import React, { Component } from 'react';
import {
  AsyncStorage,
  Alert,
  Image,
  StyleSheet,
  TextInput,
  Text,
  View,
  ScrollView,
  ToastAndroid,
  TouchableOpacity
} from 'react-native';
import {
  InputWithLabel,
  AppButton,
} from './UI';

let config = require('./config');
type Props={};
export default class loginScreen extends React.Component {
  static navigationOptions = {
    headerStyle: {
      backgroundColor: '#fff',
      opacity: 0,
    },
  };

  constructor(props) {
    super(props)

    this.state = {
      cardnumber : '',
      password: '',
      login: false,
    };

    this._readCredential = this._readCredential.bind(this);
    this._saveCredential = this._saveCredential.bind(this);
    this.login = this.login.bind(this);
  }

  componentDidMount(){
    this._readCredential();
  }

  componentDidUpdate(){
    if(this.state.login == true){
       this.login();
    }
  }

  async _readCredential(){
    newStates ={};

    try{
      let keys = await AsyncStorage.multiGet(['cardnumber','password','login'], (err,stores)=>{
        stores.map((result,i,store) =>{
          let key = store[i][0];
          let value = store[i][1];

          if(value == 'true'){
            newStates[key] = true;
          }
          else{
            newStates[key] = value;
          }
        });
        this.setState(newStates);
      })

    }catch(error){
      console.log('Error Reading', error);
    }
  }

  async _saveCredential(){
    let keys =[['cardnumber', this.state.cardnumber], ['password', this.state.password],['login', 'true']];
    try{
      await AsyncStorage.multiSet(keys);
    }catch(error){
      console.log('Error Setting Credential!',error);
    }
  }

  login(){
    let url = config.settings.serverPath + '/api/members/login';

    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cardnumber: this.state.cardnumber,
        password: this.state.password,
      }),
    })
    .then((response) => {
      if(!response.ok) {
        Alert.alert('Error', response.status.toString());
        throw Error('Error ' + response.status);
      }
      return response.json()
    })
    .then((id) => {
      console.log(id);
      if(id != null){
        this._saveCredential();
        ToastAndroid.show('Welcome', ToastAndroid.SHORT);
        this.props.navigation.navigate('Home', {
          id: id,
        })
        console.log(id);
      }
      else{
        Alert.alert('Login Failed','Wrong card number or password!',[
          {
            text: 'Ok',
            onPress: () => {this.setState({cardnumber:'',password:''})}
          }
        ]);
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render(){
    return (
      <ScrollView style={styles.container}>
      <View style={styles.logo}>
        <Image source={require('./icons/online-store-96.png')}/>
      </View>
      <View style={{borderWidth:0.6, borderRadius:4.0, borderColor:'blue'}}>
        <View style={styles.inputFrame}>
          <TextInput style={styles.input}
            placeholder={'Enter Card Number'}
            value={this.state.cardnumber}
            onChangeText={(cardnumber) => {this.setState({cardnumber})}}
            keyboardType={'numeric'}
            maxLength={12}
            />
        </View>
        <View style={styles.inputFrame}>
          <TextInput style={styles.input}
            placeholder={'Enter Pin Number'}
            value={this.state.password}
            onChangeText={(password) => {this.setState({password})}}
            keyboardType={'default'}
            secureTextEntry={true}
            />
        </View>
      </View>
      <AppButton style={styles.button}
        title={'Log in'}
        theme={'success'}
        onPress={this.login}
      />
      <View style={{flexDirection:'row',justifyContent:'center'}}>
        <Text style={{fontSize:17}}>{'Not a member? Press here to'}</Text>
        <TouchableOpacity
        onPress={ () => {
          this.props.navigation.navigate('Home', {
            id: 0,
            })
          }}
          >
          <View style={{marginLeft:3}}>
            <Text style={{fontSize:17,color:'blue',textDecorationLine: 'underline',}}>{'skip'}</Text>
          </View>
        </TouchableOpacity>
      </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    fontSize: 23,
    color: '#000099',
    marginTop: 10,
    marginBottom: 10,
    textDecorationLine: 'underline',
  },
  inputFrame:{
    marginLeft:30,
    marginRight:30,
  },
  label: {
      flex: 1,
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: 3,
      textAlignVertical: 'center',
  },
  button: {
    marginTop:10,
    marginBottom:15,
  },
  logo:{
    alignItems: 'center',
    marginBottom:30,
  }
});
