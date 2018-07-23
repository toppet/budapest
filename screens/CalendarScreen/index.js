import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import PageHeader from '../../components/PageHeader';

export default class CalendarScreen extends Component {
    render() {
        return (
            <View style={styles.container}>
              <PageHeader { ...this.props } />
                <Text>Hello Calendar Screen</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
});
