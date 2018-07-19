import React, { Component } from 'react';
import {
    View,
    Text,
} from 'react-native';

export default class EventsScreen extends Component {
    static navigationOptions = {
        title: 'EventsScreen',
    }
    render() {
        return (
            <View>
                <Text>Hello Events Screen</Text>
            </View>
        )
    }
}