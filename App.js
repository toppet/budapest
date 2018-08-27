import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Modal,
  Switch,
  TouchableOpacity,
  YellowBox,
  Image,
  ScrollView,
  AsyncStorage,
  SafeAreaView,
  Linking,
  TextInput
} from 'react-native';

import ProbaScreen from './ProbaScreen';
import OfflineNotice from './OfflineNotice';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';

import textContentJSON from './screens/SideMenuScreen/menuRootTrans.json';

import PopupDialog, { ScaleAnimation } from 'react-native-popup-dialog';
import Communications from 'react-native-communications';
import firebase from 'react-native-firebase';

const ScaleAnim = new ScaleAnimation();

export default class App extends Component {
  state = {
    settingsPopUpVisible: false,
    contactPopUpVisible: false,
    impressumModalVisible: false,
    settingsNotifications: false,
    settingsLocation: false,
    settingsEng: false,
    fcmToken: null,
  }

  componentDidMount() {
    // this.getAllKeys();
    this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification) => {
        // Process your notification as required
        // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
    });
    this.notificationListener = firebase.notifications().onNotification((notification) => {
        // Process your notification as required
    });
    firebase.messaging().getToken()
      .then(fcmToken => {
        if (fcmToken) {
          // user has a device token
          // this.setState({ fcmToken });
          this._callFcm(fcmToken);
        } else {
          // user doesn't have a device token yet
        }
      });
    this._getAppLang();
  }

  componentWillUnmount() {
    this.notificationDisplayedListener();
    this.notificationListener();
}

  showSettingsDialog() {
    this.settingsDialog.show();
  }

  showContactDialog() {
    this.setState({ contactPopUpVisible: true });
  }

  setImpressumModalVisible() {
    this.setState({ impressumModalVisible: true });
  }

  _callFcm = async (fcmToken) => {
    try {
      const data = {
        token: fcmToken,
        lang: "hu",
      };
      await fetch('https://jewps.hu/api/v1/fcm', {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          // "Content-Type": "application/x-www-form-urlencoded",
        },
        referrer: "no-referrer", // no-referrer, *client
        body: JSON.stringify(data), // body data type mu
      })
      .then(() => {

      }).catch(e =>{
        return null;
      });
    } catch (error) {
      // Error saving data
    }
  }

  _getAppLang = async () => {
    try {
      const value = await AsyncStorage.getItem('@MySuperStore:key');
      // console.log('langvalue', value);
      if (value !== null) {
        // We have data!!
        this.setState({ settingsEng: value === 'en' ? true : false });
      }
     } catch (error) {
       // Error retrieving data
     }
  }

  _setAppLang = async () => {
    try {
      await this.setState({ settingsEng: !this.state.settingsEng });
      await AsyncStorage.setItem('@MySuperStore:key', this.state.settingsEng ? 'en' : 'hu');
    } catch (error) {
      // Error saving data
    }
  }

  render() {
    YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Remote debugger']);
    let textContent =  textContentJSON.hu;
    moment.locale('hu');

    if(this.state.settingsEng) {
      textContent = textContentJSON.en;
      moment.locale('en');
    }
    
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
              <Text style={styles.settingText}>{textContent.beallitasokNotif}</Text>
              <Switch value={this.state.settingsNotifications} onValueChange={() => this.setState({settingsNotifications: !this.state.settingsNotifications})}></Switch>
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingText}>{textContent.beallitasokLocation}</Text>
              <Switch value={this.state.settingsLocation} onValueChange={() => this.setState({settingsLocation: !this.state.settingsLocation})}></Switch>
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingText}>Switch to English</Text>
              <Switch value={this.state.settingsEng} onValueChange={() => this._setAppLang()}></Switch>
            </View>

            {/* <View style={styles.settingRow}>
              <TextInput style={styles.settingText}>FCM: {this.state.fcmToken}</TextInput>
            </View> */}

            <TouchableOpacity onPress={() => this.settingsDialog.dismiss()}>
              <Text style={styles.dismissBtn}>{textContent.beallitasokClose}</Text>
            </TouchableOpacity>
          </View>
        </PopupDialog>

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.contactPopUpVisible}
          onRequestClose={() => {
            // alert('Modal has been closed.');
          }}>
          <SafeAreaView style={{marginTop: 25}}>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => this.setState({ contactPopUpVisible: false }) }
                activeOpacity={0.8}
                style={styles.closeIconWrap}
                >
                <Icon size={30} name="clear" style={styles.close} />
              </TouchableOpacity>
              <Text style={styles.pageTitle}>{textContent.kapcsolatTitle}</Text>
              <View style={styles.rightIconPlaceholder}></View>;
            </View>

            <ScrollView style={{marginBottom: 25}}>
              <Text style={styles.contentTitle}>{textContent.kapcsolatTartalom}</Text>

              <View style={styles.tartalom}>
                <View style={styles.kapcsolat}>
                    <Text style={styles.kapcsName}>{textContent.kapcsolatPerson}</Text>
                    <Text style={styles.kapcsRole}>{textContent.kapcsolatPersonSub}</Text>
                </View>
                <View style={styles.kapcsButtonView}>
                  <TouchableOpacity style={styles.kapcsBtn} onPress={() => Communications.email(['dohanysyn@gmail.com'],null,null,'[JEWPSapp] Kapcsolatfelvétel','Kedves Hölgyem/Uram,\n\n')} activeOpacity={0.8}>
                      <Text style={styles.kapcsBtnText}>{textContent.kapcsolatTartalomBtn}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.tartalomBody}>
                <Text style={styles.kapcsBody}>{textContent.kapcsolatTartalomDesc}</Text>
              </View>
              <Text style={styles.contentTitle}>{textContent.hibaTitle}</Text>

              <View style={styles.hibabejelentes}>
                <View style={styles.hibaCegImage}>
                  <Image source={require('./assets/images/garandDesign.png')} style={{width: 45, height: 45, marginTop: 15,}}/>
                </View>
                <View style={styles.hibaCeg}>
                  <Text style={styles.kapcsName}>{textContent.hibaCompany}</Text>
                  <Text style={styles.kapcsRole}>{textContent.hibaSub}</Text>
                </View>
                <View style={styles.hibaButtonView}>
                  <TouchableOpacity style={styles.kapcsBtn} onPress={() => Communications.email(['info@jewps.hu'],null,null,'[JEWPSapp] Hibabejelentés','Kedves GarandDesign csapat, \n\nAz alábbi hibáról szeretnék beszámolni Önöknek. \n\n⚡️ A hiba leírása, amit tapasztaltam: \n\n⚡️ A készülékem adatai \n ➡️Gyártó, modell: \n ➡️Operációs rendszer verziószáma: \n\n⚡️ Képernyőfotó a hibáról:\n')} activeOpacity={0.8}>
                      <Text style={styles.kapcsBtnText}>{textContent.hibaBtn}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.tartalomBody}>
                <Text style={styles.kapcsBody}>{textContent.hibaDesc}</Text>
              </View>
            </ScrollView>
          </SafeAreaView>
        </Modal>


        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.impressumModalVisible}
          onRequestClose={() => {
            // alert('Modal has been closed.');
          }}
        >
          <SafeAreaView style={{ marginTop: 25 }}>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => this.setState({ impressumModalVisible: false }) }
                activeOpacity={0.8}
                style={styles.closeIconWrap}
              >
                <Icon size={30} name="clear" style={styles.close} />
              </TouchableOpacity>
              <Text style={styles.pageTitle}>{textContent.impresszumTitle}</Text>
              <View style={styles.rightIconPlaceholder}></View>;
            </View>

            <ScrollView style={styles.impresszumBody} showsVerticalScrollIndicator={false}>
              <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={styles.kapcsBody}>{textContent.impresszumDesc}</Text>
              </View>

              <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={styles.impHeading}>{textContent.impresszumIdojaras}</Text>
                <TouchableOpacity
                  style={styles.linkBtn}
                  activeOpacity={0.8}
                  onPress={() => Linking.openURL('https://darksky.net/poweredby/')}
                >
                  <Text style={styles.linkBtnText}>Powered By Dark Sky API</Text>
                </TouchableOpacity>
                <Image source={require('./assets/images/poweredby-oneline.png')} style={{width: 250, height: 50, marginTop: 15,}}/>
              </View>

              <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 25,}}>
                <Text style={styles.impHeading}>{textContent.impresszumCurrency}</Text>
                <TouchableOpacity
                  style={styles.linkBtn}
                  activeOpacity={0.8}
                  onPress={() => Linking.openURL('https://free.currencyconverterapi.com/')}
                >
                  <Text style={styles.linkBtnText}>Powered By CurrencyConverterAPI</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

          </SafeAreaView>
        </Modal>

        <ProbaScreen
          showSettingsDialog={() => this.showSettingsDialog()}
          showContactDialog={() => this.showContactDialog()}
          setImpressumModalVisible={() => this.setImpressumModalVisible()}
          settingsEng={this.state.settingsEng}
        />
        
        {/* <OfflineNotice /> */}
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
    color: '#434656',
  },
  header: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#FFF",
    // marginBottom: 15,
  },
  closeIconWrap: {
    marginRight: 'auto'
  },
  pageTitle: {
    fontSize: 20,
    fontFamily: "YoungSerif-Regular",
    color: "#434656",
    marginRight: 'auto'
  },
  close: {
    paddingHorizontal: 5,
    justifyContent: 'center',
    color: "#434656",
  },
  rightIc: {
    paddingRight: 10,
    justifyContent: 'center',
    color: "white",
  },
  tartalom: {
    marginLeft: 15,
    flexDirection: 'row',
  },
  kapcsolat:{
    width: '50%',
  },
  hibaCegImage: {
    width: '15%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  hibaCeg: {
    width: '45%',
    justifyContent: 'center'
  },
  kapcsName: {
    paddingTop: 15,
    paddingBottom: 5,
    fontFamily: "Montserrat",
    fontSize: 18,
    fontWeight: "normal",
    fontStyle: "normal",
    color: "#434656"
  },
  impHeading:{
    paddingTop: 15,
    paddingBottom: 22,
    fontFamily: "Montserrat",
    fontSize: 22,
    fontWeight: "600",
    fontStyle: "italic",
    color: "#434656"
  },
  kapcsRole:{
    fontFamily: "Montserrat",
    fontSize: 14,
    fontWeight: "normal",
    fontStyle: "normal",
    color: "#A3ABBC"
  },
  tartalomBody: {
    marginTop: 15,
    marginHorizontal: 15,
    marginBottom: 40,
  },
  impresszumBody: {
    flex: 1,
    flexBasis: "90%",
    marginHorizontal: 15,
  },
  kapcsBody:{
    fontFamily: "Montserrat",
    fontSize: 14,
    fontWeight: "normal",
    fontStyle: "normal",
    color: "#434656",
    marginRight: 15,
    marginTop: 10,
  },
  hibabejelentes: {
    marginLeft: 15,
    flexDirection: 'row',
  },
  contentTitle: {
    fontSize: 20,
    fontFamily: "YoungSerif-Regular",
    color: "#b7a99b",
    marginLeft: 15,
    marginRight: 20,
  },
  kapcsButtonView:{
    width: '50%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  hibaButtonView:{
    width: '30%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  kapcsBtn: {
    width: 130,
    height: 33,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'rgba(237, 237, 237, 1)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#b7a99b',
    shadowOffset: {
      width: 0,
      height: 15
    },
    shadowRadius: 15,
    shadowOpacity: 0.5,
  },
  kapcsBtnText: {
    color: '#c49565',
    fontFamily: "Montserrat",
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'center',
  },
  dismissBtn: {
    fontFamily: "Montserrat",
    fontWeight: '600',
    fontSize: 16,
    color: '#73beff',
    textAlign: 'center',
    marginTop: 10,
  },
  linkBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 15,
    marginBottom: 5,
    borderColor: 'rgba(237, 237, 237, 1)',
    shadowColor: '#b7a99b',
    shadowOffset: {
      width: 0,
      height: 15
    },
    shadowRadius: 15,
    shadowOpacity: 0.5,
  },
  linkBtnText: {
    fontFamily: "Montserrat",
    fontSize: 14,
    fontWeight: "600",
    fontStyle: "normal",
    color: '#c49565'
  },
  rightIconPlaceholder: {
    width: 50,
    height: 50,
  }
});
