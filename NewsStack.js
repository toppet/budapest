import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation';

import NewsScreen from './screens/NewsScreen';
import NewsDetailScreen from './screens/NewsDetailScreen';

export default createStackNavigator(
  {
    News: {
      screen: props => <NewsScreen {...props} />,
    },
    NewsDetail: {
      screen: props => <NewsDetailScreen {...props} />,
    },
  },
  {
    headerMode: 'none',
  }
);
