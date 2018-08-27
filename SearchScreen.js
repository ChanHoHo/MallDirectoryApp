import React, { Component } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  TextInput,
  Text,
  View,
  ScrollView,
  FlatList,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import {
  List,
  ListItem,
  SearchBar,
} from "react-native-elements";
import {
  TextWithLabel,
  InputWithLabel,
} from './UI';
import{
  images,
  maps,
}from './ImagesPath';
import{
  getImages,
  contains,
}from './Search';
import _ from "lodash";

export default class ViewScreen extends Component<Props>{
  static navigationOptions = {
    title: 'Search',
  };

  constructor(props) {
    super(props)

    this.state = {
      loading: false,
      data: [],
      error: null,
      query: "",
      fullData: [],
    };
  }

  componentDidMount() {
    this.makeRemoteRequest();
  }

  makeRemoteRequest = _.debounce (() => {
    this.setState({ loading: true });

    getImages(20, this.state.query)
        .then(images => {
          this.setState({
            loading: false,
            data: images,
            fullData: images,
          });
        })
        .catch(error => {
          this.setState({ error, loading: false });
    });
  }, 250);

  handleSearch = text=>{
    const formatQuery = text.toLowerCase();
    const data = _.filter(this.state.fullData, image =>{
      return contains(image, formatQuery);
    });
    this.setState({ query: formatQuery, data}, ()=>this.makeRemoteRequest());
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "86%",
          backgroundColor: "#CED0CE",
          marginLeft: "14%"
        }}
      />
    );
  };

  renderHeader = () => {
   return <SearchBar
   placeholder="Type Here..."
   lightTheme
   round
   onChangeText={this.handleSearch}
   />;
 };

 renderFooter = () => {
    if (!this.state.loading) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE"
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  render() {
   return (
     <SafeAreaView>
       <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
         <FlatList
           data={this.state.data}
           renderItem={({ item }) => (
             <ListItem
               roundAvatar
               title={item.name}
               onPress={ () => {
                 this.props.navigation.navigate('View', {
                   title: item.name,
                 })
               }}
               containerStyle={{ borderBottomWidth: 0 }}
             />
           )}
           ItemSeparatorComponent={this.renderSeparator}
           ListHeaderComponent={this.renderHeader}
           ListFooterComponent={this.renderFooter}
         />
       </List>
     </SafeAreaView>
   );
 }
}
