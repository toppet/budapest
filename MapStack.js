import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation';

import MapDetailScreen from './screens/MapDetailScreen';
import MapScreen from './screens/MapScreen';

export default createStackNavigator(
  {
    Map: {
      screen: props => <MapScreen {...props} />,
    },
    MapDetail: {
      screen: props => <MapDetailScreen {...props} />,
    },
  },
  {
    headerMode: 'none',
  }
);
