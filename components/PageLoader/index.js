import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  Platform,
} from 'react-native';

export default class PageLoader extends Component {
  render() {
    let loader = <ActivityIndicator size="large" color="#B7A99B" animating={true}/>;

    // if(Platform.OS === 'android') {
    //   loader = <Image style={{width: 200, height: 200}} source={{uri: 'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif'}} />;
    // }
    return (
      <View style={styles.loadingContainer}>
        {loader}
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
