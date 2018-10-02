
import React, { Component, PureComponent } from 'react';
import {
  Alert,
  AsyncStorage,
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  ScrollView,
  FlatList,
  Button,
  DrawerLayoutAndroid,
  TouchableOpacity,
  BackHandler,
  ToastAndroid,
} from 'react-native';

import ExpanableList from 'react-native-expandable-section-flatlist';

class Menu extends React.Component {
  render() {
    return (
      <View style={{flex:1, flexDirection:'row', }}>
      <Text style={styles.title}>{'Awesome Mall Directory'}</Text>
      </View>
    );
  }
}

let frame= [
  {
    header: 'Beauty & Wellness',
    category:[],
  },
  {
    header: 'Fashion',
    category:[],
  },
  {
    header: 'Food & Beverage',
    category:[],
  },
  {
    header: 'IT Gadget',
    category:[],
  },
]

let SQLite = require('react-native-sqlite-storage');

type Props = {};
export default class HomeScreen extends Component<Props> {
  static navigationOptions = {
    headerTitle: <Menu />,
    headerLeft: null,
    drawerLabel:'Home',
    drawerIcon: ({ tintColor }) => (
      <Image
        source={require('./icons/baseline_home_black_36dp.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
  };

  constructor(props) {
    super(props)

    this.state = {
      backButtonPress:false,
      shops:[],
      shopstest:[],
      isHidden:false,
      show:true,
      id: this.props.navigation.getParam('id'),
    };


    this.loadShops = this.loadShops.bind(this);
    this._query = this._query.bind(this);
    this.logout = this.logout.bind(this);
    this._renderSection = this._renderSection.bind(this);
    this._renderRow = this._renderRow.bind(this);
    this.buttonOnPress = this.buttonOnPress.bind(this);
    this._removeCredential = this._removeCredential.bind(this);

    this.db = SQLite.openDatabase({
      name: 'adb',
      createFromLocation : '~adb.sqlite'
    }, this.openDb, this.errorDb);
  }

  handleBackButton = () => {
    if(this.state.backButtonPress == true){
      BackHandler.exitApp();
    }
    else{
      this.setState({backButtonPress:true})
      ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
      setTimeout(() => {this.setState({backButtonPress : false})}, 2000);

    }
  return true;
}

  componentDidMount(){
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    this._query();
    console.log("mounted!");
  }

  componentWillUnmount(){
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    console.log("unmounted!");
  }

  logout(){
    Alert.alert('Log Out', '', [
      {
        text: 'Ok',
        onPress: ()=> {this._removeCredential(), this.props.navigation.goBack()}
      },
      {
        text: 'Cancel',
        onPress: () => {}
      }
    ]);
  }

  async _removeCredential(){
    try{
       await AsyncStorage.multiRemove(['cardnumber','password','login']);
    }catch(error){
      console.log('Error removing credential!',error);
    }
  }

  _query() {
    this.db.transaction((tx) => {
      tx.executeSql('SELECT * FROM shops', [], (tx, results) => {
        this.setState({
          shops: results.rows.raw(),
        })
      })
    });
  }

  openDb() {
      console.log('Database opened');
  }

  errorDb(err) {
      console.log('SQL Error: ' + err);
  }

  buttonOnPress(){
    this.setState({isHidden: !this.state.isHidden})
    if(this.state.show){
      this.loadShops();
      this.setState({show:false})
    }
  }

  loadShops(){
      for(var i =0; i< this.state.shops.length; i++){
        switch(this.state.shops[i].category){
          case 'beauty':{
            frame[0].category.push(this.state.shops[i]);
            break;
          }
          case 'fashion':{
            frame[1].category.push(this.state.shops[i]);
            break;
          }
          case 'foodbeverage':{
            frame[2].category.push(this.state.shops[i]);
            break;
          }
          case 'gadget':{
            frame[3].category.push(this.state.shops[i]);
            break;
          }
          default:{
            break;
          }
        }
    }
      var shopstestCopy = Object.assign({}, this.state.shopstest);
      shopstestCopy = frame;
      this.setState({shopstest: shopstestCopy})
  }

  _renderSection = (section, sectionId)  => <Text style={styles.section}>{section}</Text>;
  _renderRow = (rowItem, rowId, sectionId) =>
  <TouchableHighlight
    underlayColor={'#cccccc'}
    onPress={ () => {
      this.props.navigation.navigate('View', {
        title: rowItem.name,
        id: rowItem.id,
      })
    }}
  >
    <View style={styles.container}>
        <View style={{flex:0.9}}>
          <Text style={styles.name}>{ rowItem.name }</Text>
        </View>
        <View style={{flex:0.1,borderWidth:0.7,height: 35,margin:3,borderRadius:4}}>
          <Text style={styles.floor}>{ rowItem.floor }</Text>
        </View>
    </View>
  </TouchableHighlight>

  render() {
    return (
      <ScrollView >
        <ScrollView style={{flex:1}}>
          <View style={styles.headerIcon}>

            <TouchableOpacity
              onPress={ () => {this.props.navigation.navigate('Profile',{id: this.state.id, headerTitle:'Profile', refresh: this._load} )}}
            >
              <View>
              <Image style={styles.icon} source={require('./icons/baseline_account_circle_black_36dp.png')}/>

              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={ () => {this.props.navigation.navigate('FloorPlan',{id: this.state.id, headerTitle:'Floor Plan', refresh: this._load} )}}
            >
              <View>
              <Image style={styles.icon} source={require('./icons/baseline_shopping_cart_black_36dp.png')}/>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={ () => {this.props.navigation.navigate('Search',{id: this.state.id, headerTitle:'Search', refresh: this._load} )}}
            >
              <View>
              <Image style={styles.icon} source={require('./icons/baseline_search_black_36dp.png')}/>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={ () => {this.props.navigation.navigate('MapLocation')}}
            >
              <View>
              <Image style={styles.icon} source={require('./icons/baseline_near_me_black_36dp.png')}/>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.logout}
            >
              <View>
              <Image style={styles.icon} source={require('./icons/baseline_exit_to_app_black_36dp.png')}/>
              </View>
            </TouchableOpacity>
            </View>
            <View style={{ borderBottomWidth:0.7}}>
            <TouchableOpacity style={{flex:0.75}}
              onPress={this.buttonOnPress}
              >
              <View>
                <Text style={styles.list}>{this.state.isHidden ? "Hide List" : "Show List"}</Text>
              </View>
            </TouchableOpacity>

          </View>
          {this.state.isHidden ? <ExpanableList
            dataSource={this.state.shopstest}
            headerKey="header"
            memberKey="category"
            renderRow={this._renderRow}
            renderSectionHeaderX={this._renderSection}
            /> : null}
            </ScrollView>

      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  menu:{
    width: 40,
    height: 30,
    margin: 10,
    marginBottom:5,
  },
  headerIcon:{

    flexDirection:'row',
  },
  icon:{
    width: 30,
    height: 30,
    margin: 10,
    marginLeft:37,
    marginBottom:5,

  },

  title:{
    flex:0.9,
    margin:10,
    fontSize: 20,
    color:'white',
    fontWeight:'bold',

  },
  container: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    marginLeft:10,
    marginRight:10,
  },
  section: {
    flex: 1,
    flexDirection: 'row',
    color: 'black',
    fontSize:20,
    margin: 3,
    marginTop: 8,
    marginBottom: 5,
    borderBottomWidth: 1.0,
    fontWeight:'bold',
  },
  name:{
    fontSize:17,
    margin:8,
    paddingBottom:5,
  },
  floor:{
    fontSize:16,
    margin:8,
    paddingBottom:5,
    textAlign:'right',
    color:'blue',
  },
  list:{
    margin:10,
    marginBottom:5,
    fontSize: 20,
    fontWeight:'bold',
    color:'black',
    textAlign:'center',
  }
});
