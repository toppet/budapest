import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import moment from 'moment';
require('moment/locale/hu');

export default class HomeScreen extends Component {
  state = {
    fadeAnim: new Animated.Value(0),
    menuOpened: false,  // Initial value for opacity: 0
  }

  render() {
    const { height, width } = Dimensions.get('window');
    console.log('this.props', this.props);
    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <Animated.View style={{flex: 1, alignItems: 'stretch', justifyContent: 'flex-start', paddingTop: 20, left: this.state.fadeAnim}}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.props.screenProps.openMenu()}
            >
              <Image source={require('../../assets/images/icMenu.png')} />
            </TouchableOpacity>
            <Text style={styles.pageTitle}>JewPS</Text>
            <Image style={styles.button} source={require('../../assets/images/icKereses.png')} />
          </View>
          <View style={{flex: 1, padding: 15}}>
            <ScrollView>
              <Text style={styles.title}>Üdvözöljük!</Text>
              <Text style={styles.date}>{moment().format('MMMM DD., dddd')}</Text>
            </ScrollView>
          </View>
        </Animated.View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    // flex: 1,
    height: 50,
    padding: 15,
    paddingTop: 0,
    paddingBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    backgroundColor: "#ffffff"
  },
  pageTitle: {
    fontSize: 20,
    fontFamily: "YoungSerif-Regular",
  },
  title: {
    color: "#b7a99b",
    fontSize: 35,
    fontFamily: "YoungSerif-Regular",
  },
  date: {
    fontFamily: "Montserrat-Black",
    fontSize: 14,
  },
  button: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
});

