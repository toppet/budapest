/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Button,
  Modal,
  Switch,
  TouchableHighlight,
  TouchableOpacity,
  YellowBox,
} from 'react-native';

import ProbaScreen from './ProbaScreen';

import PopupDialog, { ScaleAnimation } from 'react-native-popup-dialog';
const ScaleAnim = new ScaleAnimation();

export default class App extends Component {
  state = {
    settingsPopUpVisible: false,
    contactPopUpVisible: false,
    impressumModalVisible: false,
    settingsNotifications: false,
    settingsLocation: false,
    settingsEng: false,
  }

  showSettingsDialog() {
    this.settingsDialog.show();
  }

  showContactDialog() {
    this.contactDialog.show();
  }

  setImpressumModalVisible() {
    this.setState({ impressumModalVisible: true });
  }

  render() {
    YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'React debugger']);
    return (
      <View style={{flex:1}}>

        <PopupDialog
          width={0.8}
          height={215}
          dialogAnimation={ScaleAnim}
          ref={(popupDialog) => { this.settingsDialog = popupDialog; }}
        >
          <View style={styles.dialogView}>
            <View style={styles.settingRow}>
              <Text style={styles.settingText}>Értesítések</Text>
              <Switch value={this.state.settingsNotifications} onValueChange={() => this.setState({settingsNotifications: !this.state.settingsNotifications})}></Switch>
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingText}>Helymeghatorozas</Text>
              <Switch value={this.state.settingsLocation} onValueChange={() => this.setState({settingsLocation: !this.state.settingsLocation})}></Switch>
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingText}>Switch to English</Text>
              <Switch value={this.state.settingsEng} onValueChange={() => this.setState({settingsEng: !this.state.settingsEng})}></Switch>
            </View>

            <TouchableOpacity onPress={() => this.settingsDialog.dismiss()}>
              <Text style={styles.dismissBtn}>Ablak bezárása</Text>
            </TouchableOpacity>
          </View>
        </PopupDialog>

        <PopupDialog
          width={0.8}
          dialogAnimation={ScaleAnim}
          ref={(popupDialog) => { this.contactDialog = popupDialog; }}
        >
          <View style={styles.dialogView}>
            <Text>Kontakt</Text>
            <Button
              title="Ablak bezarasa"
              onPress={() => this.contactDialog.dismiss()}
            />
          </View>
        </PopupDialog>

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
                onPress={() => this.setState({ impressumModalVisible: false }) }>
                <Text>Hide Modal</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>

        <ProbaScreen 
          showSettingsDialog={() => this.showSettingsDialog()}
          showContactDialog={() => this.showContactDialog()}
          setImpressumModalVisible={() => this.setImpressumModalVisible()}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  dialogView: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'space-between',
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: 15,
  },
  settingRow: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingText: {
    fontFamily: "Montserrat",
    fontWeight: '600',
    fontSize: 16,
  },
  dismissBtn: {
    fontFamily: "Montserrat",
    fontWeight: '600',
    fontSize: 16,
    color: '#73beff',
  }
});
