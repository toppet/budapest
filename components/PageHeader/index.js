import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

export default class PageHeader extends Component {
  render() {
    return (
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
    )
  }
}

const styles = StyleSheet.create({
  header: {
    height: 50,
    padding: 15,
    paddingTop: 0,
    paddingBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    backgroundColor: "#fff"
  },
  button: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  pageTitle: {
    fontSize: 20,
    fontFamily: "YoungSerif-Regular",
  },
});
