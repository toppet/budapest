import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Button
} from 'react-native';
import SideMenu from 'react-native-side-menu';
import Tabs from './Tabs';
import SideMenuScreen from './screens/SideMenuScreen';

export default class ProbaScreen extends Component {
  state = {
    isOpen: false,
    settingsPopUpVisible: false,
  }
  
  openMenu() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  updateMenuState(isOpen) {
    this.setState({ isOpen: isOpen });
  }

  render() {
    const menu = <SideMenuScreen {...this.props} />;

    return (
      <SideMenu 
        menu={menu} 
        isOpen={this.state.isOpen} 
        onChange={(isOpen) => this.updateMenuState(isOpen)}
      >
        <Tabs screenProps={{openMenu: () => this.openMenu()}} />
      </SideMenu>
    )
  }
}
