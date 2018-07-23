import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import PageHeader from '../../components/PageHeader';

export default class EventDetailScreen extends Component {
  static navigationOptions = {
    title: 'Event Detail',
    headerTitle: 'Event Detail',
  };

  render() {
    console.log('EventDetailScreen this.props', this.props)
    return (
      <View style={styles.container}>
        <PageHeader 
          pageTitle="Események"
          isBack
          {...this.props}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text>Hello EventDetailScreen Screen</Text>
        </ScrollView>
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
