import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation';

import NewsScreen from './screens/NewsScreen';
import NewsDetailScreen from './screens/NewsDetailScreen';

export default createStackNavigator(
  {
    News: {
      title: 'News List',
      screen: props => <NewsScreen {...props} />,
    },
    NewsDetail: {
      screen: props => <NewsDetailScreen {...props} />,
      title: 'NewsDetail',
    },
  },
  {
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#f4511e',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerBackTitle: null,
      title: 'Hírek',
    },
    headerMode: 'none',
  }
  // {
  //   // initialRouteName: "EventsHome",
  //   headerMode: 'screen',
	//   initialRoute: 'EventsHome',
  // }
);
