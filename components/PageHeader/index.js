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
    let rightIcon = <View style={styles.rightIconPlaceholder}></View>;
    const { pageTitle, isBack, noRightIcon } = this.props;
    
    if(isBack) {
      leftIcon = (
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => this.props.navigation.goBack()}
        >
          <Icon name='keyboard-backspace' size={30} style={styles.backArrow}/>
        </TouchableOpacity>
      )
    } else {
      leftIcon = (
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => this.props.screenProps.openMenu()}
        >
          <Image source={require('../../assets/images/icMenu.png')} />
        </TouchableOpacity>
      );

      rightIcon = (
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => this.props.navigation.goBack()}
        >
          <Image style={styles.button} source={require('../../assets/images/icKereses.png')} />
        </TouchableOpacity>
      );
    }

    // if (noRightIcon) {
    //   rightIcon = (
    //     <View style={styles.rightIconPlaceholder}>

    //     </View>
    //   );
    // }


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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    backgroundColor: "#fff",
  },
  menuButton: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center', 
  },
  pageTitle: {
    fontSize: 20,
    fontFamily: "YoungSerif-Regular",
  },
  rightIconPlaceholder: {
    width: 50,
    height: 50,
  },

});


