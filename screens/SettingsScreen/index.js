import React, { Component } from 'react';
import {
  View,
  Text,
} from 'react-native';

export default class SettingsScreen extends Component {
  render() {
    return (
      <View stlye={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>Hello Settings Screen</Text>
      </View>
    )
  }
}
