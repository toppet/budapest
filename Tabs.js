import React, { Component } from 'react';
import {
  Image
} from 'react-native';
import { createBottomTabNavigator, BottomTabBar } from 'react-navigation';

import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';
import ExploreScreen from './screens/ExploreScreen';
import EventsScreen from './screens/EventsScreen';
import CalendarScreen from './screens/CalendarScreen';

export default createBottomTabNavigator(
  {
    Home: {
      screen: props => <HomeScreen {...props}/>

    },
    Map: MapScreen,
    Explore: ExploreScreen,
    Events: EventsScreen,
    Calendar: CalendarScreen,
  },
  {
    navigationOptions: ({ navigation }) => ({
      initialRouteName: "Home",
      tabBarIcon: () => {
        const { routeName } = navigation.state;
        let icon;

        if (routeName === 'Home') {
          icon = <Image source={require('./assets/images/home.png')} />;
        } else if (routeName === 'Map') {
          icon = <Image source={require('./assets/images/map.png')} />;
        } else if (routeName === 'Explore') {
          icon = <Image source={require('./assets/images/explore.png')} />;
        } else if (routeName === 'Events') {
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
          // elevation: 1,
        },
      }
    }),
  }
);
