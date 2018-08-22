import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

export default class PageLoader extends Component {
  render() {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#B7A99B" />
        <Text style={styles.loaderText}>{this.props.textContent.loadingTitle}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    backgroundColor: '#fff',
  },
  loaderText: {
    fontSize: 20, 
    fontFamily: 'YoungSerif-Regular', 
    color: "#434656", 
    marginTop: 15,
  }
});
