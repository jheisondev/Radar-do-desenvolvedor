import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Main from './pages/Main';
import Profile from './pages/Profile';

const Routes = createAppContainer(
  createStackNavigator({
    Main: {
      screen: Main,
      navigationOptions: {
        title: 'Radar do Desenvolvedor'
      }
    },
    Profile: {
      screen: Profile,
      navigationOptions: {
        title: 'Profile GitHub'
      }
    },
  }, {
    defaultNavigationOptions:{
      headerTitleAlign: 'center',
      headerTintColor: '#fff',
      headerStyle: {
        backgroundColor: '#7d40e7',
      }
    },
  })
);

export default Routes;