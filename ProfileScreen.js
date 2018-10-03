import React, { Component } from 'react';
import{
  Alert,
  StyleSheet,
  Image,
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  TouchableNativeFeedback,
} from 'react-native';
import{
  InputWithLabel
} from './UI';
import{
  FloatingAction
} from 'react-native-floating-action';
import Mailer from 'react-native-mail';

const actions=[{
  text:'Edit',
  icon: require('./icons/baseline_edit_white_18dp.png'),
  name:'edit',
  positon: 1
}];

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

type Props ={};
export default class ProfileScreen extends Component<Props>{
  static navigationOptions = {
    title: 'Profile',
    headerStyle: {
         backgroundColor: 'royalblue'
      }
  };

  constructor(props){
    super(props)

    this.state={
      id:this.props.navigation.getParam('id'),
      member:null,
    };

    this.handleEmail = this.handleEmail.bind(this);
    this._load = this._load.bind(this);
  }

  componentDidMount(){
    this._load();
  }

  _load(){
    let url= config.settings.serverPath + '/api/members/' + this.state.id;

    fetch(url)
    .then((response)=>{
      if(!response.ok){
        Alert.alert('Error', response.status.toString());
        throw Error('Error' + response.status);
      }
      return response.json()
    })
    .then((member)=>{
      this.setState({member:member});
    })
    .catch((error)=>{
      console.error(error);
    });
  }

  handleEmail = () => {
    Mailer.mail({
      subject: 'Enter Subject Here',
      recipients: ['support@awesomemall.com'],
      body: 'Enter Description Here',
      isHTML: true,
    }, (error, event) => {
      Alert.alert(
        error,
        event,
        [
          {text: 'Ok', onPress: () => console.log('OK: Email Error Response')},
          {text: 'Cancel', onPress: () => console.log('CANCEL: Email Error Response')}
        ],
        { cancelable: true }
      )
    });
  }

  render(){
    let member = this.state.member;

    return(
      <View style={styles.container}>
        <ScrollView>
        <Image style={styles.profilepic} source={require('./icons/twotone_account_circle_black_48dp.png')}/>
        <InputWithLabel style={styles.output}
        label={'Card Number'}
        value={member ? member.cardnumber:''}
        orientation={'vertical'}
        editable={false}
        />
        <InputWithLabel style={styles.output}
        label={'Name'}
        value={member ? member.name:''}
        orientation={'vertical'}
        editable={false}
        />
        <InputWithLabel style={styles.output}
        label={'Contact Number'}
        value={member ? member.contactnumber:''}
        orientation={'vertical'}
        editable={false}
        />
        <InputWithLabel style={styles.output}
        label={'Reward Point'}
        value={member ? member.rewardpoint.toString():''}
        orientation={'vertical'}
        editable={false}
        />
        <InputWithLabel style={styles.output}
        label={'Membership'}
        value={member ? new Date(member.membership).formatted() : ''}
        orientation={'vertical'}
        editable={false}
        />
        </ScrollView>
        <TouchableOpacity
          onPress={ () => {this.handleEmail()}}
        >
          <View>
          <Image style={styles.icon} source={require('./icons/baseline_email_black_36dp.png')}/>
          <Text>Send Enquiry</Text>
          </View>
        </TouchableOpacity>
        <FloatingAction
        actions={actions}
        overrideWithAction={true}
        color={'#0abab5'}
        onPressItem={(name)=>{
          this.props.navigation.navigate('Update', {
                  id: member ? member.id : 0,
                  headerTitle: member ? member.name : '',
                  refresh: this._load,
                });
        }
      }
      />
      </View>
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
    color: '#000099',
    marginTop: 10,
    marginBottom: 10,
  },
  profilepic:{
    width:100,
    height:100,
    alignSelf:'center'
  },
  icon:{
    marginLeft:10,
    marginRight:5,
    width: 60,
    height: 60,
  },
});
