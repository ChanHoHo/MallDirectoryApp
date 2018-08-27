import {
  createStackNavigator,
} from 'react-navigation';
import LoginScreen from './LoginScreen';
import HomeScreen from './HomeScreen';
import ViewScreen from './ViewScreen';
import SearchScreen from './SearchScreen';
import FloorPlanScreen from './FloorPlanScreen';
import ProfileScreen from './ProfileScreen';
import UpdateScreen from './UpdateScreen';

export default createStackNavigator({
  Login:{
    screen: LoginScreen,
  },
  Home: {
    screen: HomeScreen,
  },
  View:{
    screen:ViewScreen,
  },
  Search:{
    screen:SearchScreen,
  },
  FloorPlan:{
    screen:FloorPlanScreen,
  },
  Profile:{
    screen:ProfileScreen,
  },
  Update:{
    screen:UpdateScreen,
  },
}, {
  drawerPosition:'right',
  drawerWidth: 300,
  initialRouteName: 'Login',
  navigationOptions: {
    headerStyle: {
      backgroundColor: '#a80000',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  },
});

console.disableYellowBox = true;
