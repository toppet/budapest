import React, { Component } from 'react';
import {
  View,
  Text,
  Button,
  ImageBackground,
  Modal,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
      <View style={{flex: 1}}>
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

        <ImageBackground source={require('../../assets/images/menu_bg.png')} style={{width: '100%', height: '100%', position: 'relative'}}>
          <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'flex-end'}}>
            <View style={{opacity: 0.3, borderRadius: 6, height: '90%', width: 40, backgroundColor: "#b7a99b", position: 'absolute', right: -10}}></View>
            <View style={{opacity: 0.45,  borderRadius: 6, height: '95%', width: 30, right: -15, backgroundColor: "#b7a99b", position: 'absolute', }}></View>
          </View>

          <View style={{flex: 4, marginTop: 120, justifyContent: 'flex-start', alignItems: 'center', backgroundColor: 'transparent'}}>
            <Icon.Button style={styles.button} size={22} name="settings" color="#c49565" backgroundColor="#ffffff00" onPress={() => this.props.showSettingsDialog()}>
              <Text style={styles.buttonText}>Beállítások</Text>
            </Icon.Button>
            <Icon.Button style={styles.button} size={20} name="chat-bubble" color="#c49565" backgroundColor="#ffffff00" onPress={() => this.props.showContactDialog()}>
              <Text style={styles.buttonText}>Kapcsolat</Text>
            </Icon.Button>
            <Icon.Button style={styles.button} size={20} name="insert-drive-file" color="#c49565" backgroundColor="#ffffff00" onPress={() => this.setImpressumModalVisible(true)}>
              <Text style={styles.buttonText}>Impresszum</Text>
            </Icon.Button>
          </View>
          <View style={{flex: 2, alignItems: 'flex-start', justifyContent: 'flex-end', marginLeft: "auto", marginRight: "auto"}}>
            <Text style={styles.addressL}>Dohány utcai </Text>
            <Text style={styles.addressL}>Zsinagóga</Text>
            <Text style={[styles.addressS, {marginTop: 10}]}>Budapest,</Text>
            <Text style={styles.addressS}>Dohány u. 2,</Text> 
            <Text style={styles.addressS}>1074</Text>
          </View>
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 10}}>
            <Text style={{fontFamily: "Montserrat", fontSize: 11, fontWeight: "bold",}}>Verzio beta-0.1</Text>
          </View>

          
        </ImageBackground>
        
      </View>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    width: 165,
  },
  buttonText: {
    fontFamily: "Montserrat", 
    fontSize: 18, 
    fontWeight: "600",
    color: "#434656",
  },
  addressL: {
    fontFamily: "Montserrat",
    fontSize: 18,
    fontWeight: "bold",
  },
  addressS: {
    fontFamily: "Montserrat",
    fontSize: 14,
  }
});
