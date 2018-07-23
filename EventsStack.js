import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation';

import EventsScreen from './screens/EventsScreen';
import EventDetailScreen from './screens/EventDetailScreen';

export default createStackNavigator(
  {
    Events: {
      screen: props => <EventsScreen {...props} />,
    },
    EventDetail: {
      screen: props => <EventDetailScreen {...props} />,
    },
  },
  {
    headerMode: 'none',
  }
);
