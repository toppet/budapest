import React, { Component } from 'react';
import _ from 'lodash';
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

  constructor (props) {
    super(props);
    this.state = {
      isOpen: false,
      settingsPopUpVisible: false,
    }
  }
  
  openMenu() {
    setTimeout(() => this.setState({ isOpen: !this.state.isOpen }), 0);
  }

  updateMenuState(isOpen) {
    setTimeout(() => this.setState({ isOpen: isOpen }), 0);
  }
  

  render() {
    const menu = <SideMenuScreen {...this.props} />;
    console.log('probascreenprops', this.props);
    return (
      <SideMenu 
        menu={menu} 
        isOpen={this.state.isOpen}
        edgeHitWidth={20}
        onChange={(isOpen) => this.updateMenuState(isOpen)}
      >
        <Tabs screenProps={{openMenu: () => this.openMenu(), settingsEng: this.props.settingsEng}} />
      </SideMenu>
    )
  }
}
