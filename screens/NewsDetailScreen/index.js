import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import PageHeader from '../../components/PageHeader';

export default class NewsDetailScreen extends Component {
  static navigationOptions = {
    title: 'News Detail',
    headerTitle: 'News Detail',
  };

  render() {
    console.log('NewsDetailScreen this.props', this.props)
    return (
      <View style={styles.container}>
        <PageHeader 
          {...this.props}
          pageTitle="Hírek"
          isBack
        />
        <Text>Hello NewsDetailScreen Screen</Text>
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
