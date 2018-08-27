import React, { Component } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  TextInput,
  Text,
  View,
  ScrollView,
} from 'react-native';
import {
  TextWithLabel,
  InputWithLabel,
} from './UI';
import{
  images,
  maps,
}from './ImagesPath';

let SQLite = require('react-native-sqlite-storage');

type Props = {};

export default class ViewScreen extends Component<Props> {
  static navigationOptions = ({navigation}) => {
    return {
      title: images[navigation.getParam('title')].name,
      title: maps[navigation.getParam('title')].map,
      title: navigation.getParam('title'),
    };
  };

  constructor(props) {
    super(props)

    this.state = {
      shopName: this.props.navigation.getParam('title'),
      shop:'',
      desc:'',
      floor:'',
    };

    this._query = this._query.bind(this);

    this.db = SQLite.openDatabase({
      name: 'adb',
      createFromLocation : '~adb.sqlite'
    }, this.openDb, this.errorDb);
  }

  componentDidMount() {
    this._query();
  }

  _query() {
    this.db.transaction((tx) => {
      tx.executeSql('SELECT * FROM shops WHERE name = ?', [this.state.shopName], (tx, results) => {
        if(results.rows.length) {
          this.setState({
            shop: results.rows.item(0),
          })
        }
      })
    });
  }

  render() {

    let image = this.props.navigation.getParam('title');
    let map = this.props.navigation.getParam('title');
    let shop = this.state.shop;

    return (
      <View style={styles.container}>
        <ScrollView>
          <Image style={styles.imageContainer}
                 source={images[image].path}/>
                 <ScrollView horizontal={true}>
                    <Image style={styles.mapContainer}
                           source={maps[map].path}/>
                 </ScrollView>
          <TextWithLabel style={styles.name}
            name ={shop.name}
          />
          <TextWithLabel style={styles.detail}
            detail ={shop.desc}
          />
          <InputWithLabel style={styles.output}
            label={'Floor : '}
            value={shop ? shop.floor: ''}
            orientation={'vertical'}
            editable={false}
          />
          <InputWithLabel style={styles.output}
            label={'Category : '}
            value={shop ? shop.category: ''}
            orientation={'vertical'}
            editable={false}
          />
        </ScrollView>
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
    fontSize: 25,
    fontWeight: 'bold',
    color: 'tomato',
  },
  imageContainer: {
    width:300,
    height:300,
    alignSelf: 'center',
  },
  mapContainer: {
    width:600,
    height:300,
    alignSelf: 'center',
  },
});
