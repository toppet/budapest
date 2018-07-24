import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icomoonConfig from '../../selection.json';
const CustomIcon = createIconSetFromIcoMoon(icomoonConfig);

export default class PageHeader extends Component {
  render() {
    let leftIcon;
    let rightIcon;
    const { pageTitle, isBack } = this.props;
    
    if(isBack) {
      leftIcon = (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => this.props.navigation.goBack()}
        >
          <Icon name='keyboard-backspace' size={30}/>
        </TouchableOpacity>
      )
      rightIcon = (
        <TouchableOpacity
          style={styles.shareButton}
          onPress={() => console.log('share this')}
        >
          <CustomIcon name="ic_share" size={20} />
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
      );

      rightIcon = (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => this.props.navigation.goBack()}
        >
          <Image style={styles.button} source={require('../../assets/images/icKereses.png')} />
        </TouchableOpacity>
      );
    }


    return (
      <View style={styles.header}>
        {leftIcon}
        <Text style={styles.pageTitle}>{pageTitle ? pageTitle : 'JewPS'}</Text>
        {rightIcon}
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
    // width: 20,
    // height: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  backButton: {
    // width: 30,
    // height: 30,
    // borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  shareButton: {
    width: 30,
    height: 30,
    // borderWidth: 2,
    paddingTop: 5,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  pageTitle: {
    fontSize: 20,
    fontFamily: "YoungSerif-Regular",
  },
});


