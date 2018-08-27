import React, { Component } from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';

import textContentJSON from './menuRootTrans.json';

export default class SideMenuScreen extends Component {
  state = {
    impressumModalVisible: false,
  }

  render() {
    // console.log('SideMenuScreen.props', this.props);
    let textContent =  textContentJSON.hu;
    moment.locale('hu');

    if(this.props.settingsEng) {
      textContent = textContentJSON.en;
      moment.locale('en');
    }
    // console.log("this.props", this.props)
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

        <ImageBackground source={require('../../assets/images/menu_bg.png')} style={{width: '100%', height: '100%', position: 'relative',}}>

          <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'flex-end'}}>
            <View style={{opacity: 0.3, borderRadius: 6, height: '90%', width: 500, right: -470, backgroundColor: "#b7a99b", position: 'absolute', }}></View>
            <View style={{opacity: 0.45,  borderRadius: 6, height: '95%', width: 500, right: -485, backgroundColor: "#b7a99b", position: 'absolute', }}></View>
          </View>

          <View style={{ flex: 1, marginTop: 50, justifyContent: 'flex-start', alignItems: 'center', backgroundColor: 'transparent'}}>

            <Image source={require('../../assets/images/icon_60pt.png')} style={styles.appIcon}/>

            <TouchableOpacity onPress={() => this.props.showSettingsDialog()} style={{ marginBottom: 30 }}>
              <View style={styles.buttonView}>
                <Icon style={styles.buttonIcon} size={22} name="settings" color="#c49565" />
                <Text style={styles.buttonText}>{textContent.beallitasok}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.props.showContactDialog()} style={{marginBottom: 30}}>
              <View style={styles.buttonView}>
                <Icon style={styles.buttonIcon} size={22} name="chat-bubble" color="#c49565" />
                <Text style={styles.buttonText}>{textContent.kapcsolat}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.props.setImpressumModalVisible()}>
              <View style={styles.buttonView}>
                <Icon style={styles.buttonIcon} size={22} name="insert-drive-file" color="#c49565" />
                <Text style={styles.buttonText}>{textContent.impresszum}</Text>
              </View>
            </TouchableOpacity>

          </View>

          <View style={{alignSelf: 'center', justifyContent: 'flex-start', alignItems: 'flex-start', width: 165, height: 150}}>
            <Text style={styles.addressL}>{textContent.dohanyTitle1}</Text>
            <Text style={styles.addressL}>{textContent.dohanyTitle2}</Text>
            <Text style={[styles.addressS, { marginTop: 10 }]}>{textContent.dohanyAddress1}</Text>
            <Text style={[styles.addressS, {marginBottom: 35}]}>{textContent.dohanyAddress2}</Text>
            <Text style={{justifyContent: 'center', fontFamily: "Montserrat", fontSize: 11, marginBottom: 10, textAlign: 'center', color: '#797e9c'}}>Ver. 1.1</Text>
          </View>


        </ImageBackground>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  appIcon: {
    width: 90,
    height: 90,
    borderRadius: 20,
    marginBottom: 60,
  },
  buttonView: {
    flexDirection: 'row',
    width: 165,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  buttonIcon: {
    marginRight: 10,
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
    color: "#434656"
  },
  addressS: {
    fontFamily: "Montserrat",
    fontSize: 14,
    color: "#434656"
  }
});
