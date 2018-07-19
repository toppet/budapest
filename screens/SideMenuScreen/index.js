import React, { Component } from 'react';
import {
  View,
  Text,
  Button,
  Modal,
  TouchableHighlight
} from 'react-native';

export default class SideMenuScreen extends Component {
  state = {
    impressumModalVisible: false,
  }
  
  setImpressumModalVisible(visible) {
    this.setState({impressumModalVisible: visible});
  }

  render() {
    console.log('SideMenuScreen.props', this.props);
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#999999'}}>

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.impressumModalVisible}
          onRequestClose={() => {
            alert('Modal has been closed.');
          }}>
          <View style={{marginTop: 22}}>
            <View>
              <Text>Hello World!</Text>

              <TouchableHighlight
                onPress={() => {
                  this.setImpressumModalVisible(!this.state.impressumModalVisible);
                }}>
                <Text>Hide Modal</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>

        <Button
          title="Beállítások"
          onPress={() => this.props.showSettingsDialog()}         
        />
        <Button
          title="Kapcsolat"
          onPress={() => this.props.showContactDialog()}           
        />
        <Button
          title="Impresszum"
          onPress={() => this.setImpressumModalVisible(true)}          
        />
        
      </View>
    )
  }
}
