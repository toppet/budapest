import React from 'react';
import {
  Image
} from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';

import HomeScreen from './screens/HomeScreen';
import CalendarScreen from './screens/CalendarScreen';

import NewsStack from './NewsStack';
import EventsStack from './EventsStack';
import MapStack from './MapStack';

export default createBottomTabNavigator(
  {
    Home: {
      screen: props => <HomeScreen {...props}/>
    },
    MapStack: MapStack,
    EventsStack: EventsStack,
    NewsStack: NewsStack,
    Calendar: CalendarScreen,
  },
  {
    navigationOptions: ({ navigation }) => ({
      initialRouteName: "Events",
      tabBarIcon: () => {
        const { routeName } = navigation.state;
        let icon;

        if (routeName === 'Home') {
          icon = <Image source={require('./assets/images/home.png')} />;
        } else if (routeName === 'MapStack') {
          icon = <Image source={require('./assets/images/map.png')} />;
        } else if (routeName === 'EventsStack') {
          icon = <Image source={require('./assets/images/explore.png')} />;
        } else if (routeName === 'NewsStack') {
          icon = <Image source={require('./assets/images/news.png')} />;
        } else if (routeName === 'Calendar') {
          icon = <Image source={require('./assets/images/calendar.png')} />;
        }

        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return icon;
      },
      tabBarOptions: {
        showLabel: false,
        activeBackgroundColor: "#ffffff",
        style: {
          backgroundColor: '#EDEDED',
          borderTopWidth: 1,
          borderTopColor: "#b7a99b",
          shadowColor: '#000',
          shadowOffset: { width: 1, height: 5 },
          shadowOpacity: 1,
          shadowRadius: 2,
          elevation: 1,
        },
      }
    }),
  }
);
