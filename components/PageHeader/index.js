import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';


export default class PageHeader extends Component {
  render() {
    let leftIcon;
    const { pageTitle, isBack } = this.props;
    
    if(isBack) {
      leftIcon = (
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.props.navigation.goBack()}
        >
          <Icon name='keyboard-backspace' size={20}/>
        </TouchableOpacity>
      )
    } else {
      leftIcon = (
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.props.screenProps.openMenu()}
        >
          <Image source={require('../../assets/images/icMenu.png')} />
        </TouchableOpacity>
      )
    }
    return (
      <View style={styles.header}>
        {leftIcon}
        <Text style={styles.pageTitle}>{pageTitle ? pageTitle : 'JewPS'}</Text>
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


