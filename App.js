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
  Image,
  ScrollView,
  AsyncStorage,
} from 'react-native';

import ProbaScreen from './ProbaScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';

import PopupDialog, { ScaleAnimation } from 'react-native-popup-dialog';
import Communications from 'react-native-communications';
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

  componentDidMount() {
    // this.getAllKeys();
    this._getAppLang();
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

  _getAppLang = async () => {
    try {
      const value = await AsyncStorage.getItem('@MySuperStore:key');
      console.log('langvalue', value)
      if (value !== null) {
        // We have data!!
        this.setState({ settingsEng: value === 'eng' ? true : false });
      }
     } catch (error) {
       // Error retrieving data
     }
  }

  _setAppLang = async () => {
    
    try {
      await this.setState({ settingsEng: !this.state.settingsEng }, () => console.log('setting language to english', this.state.settingsEng));
      await AsyncStorage.setItem('@MySuperStore:key', this.state.settingsEng ? 'eng' : 'hu');
    } catch (error) {
      // Error saving data
    }
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
              <Text style={styles.settingText}>Helymeghatározás</Text>
              <Switch value={this.state.settingsLocation} onValueChange={() => this.setState({settingsLocation: !this.state.settingsLocation})}></Switch>
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingText}>Switch to English</Text>
              <Switch value={this.state.settingsEng} onValueChange={() => this._setAppLang()}></Switch>
            </View>

            <TouchableOpacity onPress={() => this.settingsDialog.dismiss()}>
              <Text style={styles.dismissBtn}>Ablak bezárása</Text>
            </TouchableOpacity>
          </View>
        </PopupDialog>

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.contactPopUpVisible}
          onRequestClose={() => {
            alert('Modal has been closed.');
          }}>
          <View style={{marginTop: 25}}>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => this.setState({ contactPopUpVisible: false }) }
                activeOpacity={0.8}>
                <Icon size={30} name="clear" style={styles.close} />
              </TouchableOpacity>
                <Text style={styles.pageTitle}>Kapcsolat</Text>
              <TouchableOpacity
                activeOpacity={1}>
                <Icon size={30} name="clear" style={styles.rightIc} />
              </TouchableOpacity>
            </View>

            <Text style={styles.contentTitle}>Tartalmakért felelős személy</Text>

            <View style={styles.tartalom}>
              <View style={styles.kapcsolat}>
                  <Text style={styles.kapcsName}>Bármi Áron</Text>
                  <Text style={styles.kapcsRole}>tartalmakért felelős Dohány utcai Zsinagóga</Text>
              </View>
              <View style={styles.kapcsButtonView}>
                <TouchableOpacity style={styles.kapcsBtn} onPress={() => Communications.email(['info@jewps.hu'],null,null,'[JEWPSapp] Kapcsolatfelvétel marketing témakörben','Kedves Hölgyem/Uram,\n\n')} activeOpacity={0.8}>
                    <Text style={styles.kapcsBtnText}>Kapcsolatfelvétel</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.tartalomBody}>
              <Text style={styles.kapcsBody}>PR megjelenés és rendezvények hirdetéséhez keresse fel munkatársunkat!</Text>
            </View>
            <Text style={styles.contentTitle}>Hibabejelentés</Text>

            <View style={styles.hibabejelentes}>
              <View style={styles.hibaCegImage}>
                <Image source={require('./assets/images/garandDesign.png')} style={{width: 45, height: 45, marginTop: 15,}}/>
              </View>
              <View style={styles.hibaCeg}>
                <Text style={styles.kapcsName}>GarandDesign</Text>
                <Text style={styles.kapcsRole}>FPM 24/7 Kft.</Text>
              </View>
              <View style={styles.hibaButtonView}>
                <TouchableOpacity style={styles.kapcsBtn} onPress={() => Communications.email(['info@jewps.hu'],null,null,'[JEWPSapp] Hibabejelentés','Kedves GarandDesign csapat, \n\nAz alábbi hibáról szeretnék beszámolni Önöknek. \n\n⚡️ A hiba leírása, amit tapasztaltam: \n\n⚡️ A készülékem adatai \n ➡️Gyártó, modell: \n ➡️Operációs rendszer verziószáma: \n\n⚡️ Képernyőfotó a hibáról:\n')} activeOpacity={0.8}>
                    <Text style={styles.kapcsBtnText}>Írjon Nekünk!</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.tartalomBody}>
              <Text style={styles.kapcsBody}>Kérjük próbáljon meg minél részletesebb leírást adni a tapasztalt rendellenességről. Írja meg, pontosan az: 	{"\n"}{"\n"}• 	eszköz típusát
	{"\n"}• 	operációs rendszerét. {"\n"}{"\n"}Az e-mailhez csatolhat képernyőfotót is, mely sokat segíthet a hiba feltárásában. Ilyet a bekapcsológomb és a ‘home’ gomb együttes megnyomásával készíthető.</Text>
            </View>
          </View>
        </Modal>


        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.impressumModalVisible}
          onRequestClose={() => {
            alert('Modal has been closed.');
          }}>
          <View style={{marginTop: 25}}>
            <View style={styles.header}>
            <TouchableOpacity
              onPress={() => this.setState({ impressumModalVisible: false }) }
              activeOpacity={0.8}>
              <Icon size={30} name="clear" style={styles.close} />
            </TouchableOpacity>
              <Text style={styles.pageTitle}>Impresszum</Text>
              <TouchableOpacity
                activeOpacity={1}>
                <Icon size={30} name="clear" style={styles.rightIc} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.impresszumBody}>
              <Text style={styles.kapcsBody}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam efficitur dapibus nibh, vitae rhoncus augue feugiat sed. Aenean tincidunt dictum nunc, sed rhoncus est aliquam eget. Nullam at tortor varius, tincidunt diam nec, convallis leo. Pellentesque vel ligula ut nisl scelerisque ultricies. Nunc sed purus consectetur, vestibulum nibh ac, elementum elit. Sed volutpat, risus vel viverra porttitor, turpis metus tempor diam, ut vulputate est metus a ex. Ut sed eleifend nunc. Nam rhoncus tellus dui, sed venenatis risus interdum sed. Nam vehicula cursus quam sit amet pulvinar. Curabitur vehicula libero lacinia venenatis condimentum. Curabitur a nibh fringilla, sollicitudin nulla in, tempor massa. Proin libero urna, vestibulum at finibus sed, iaculis a dolor. Aenean tincidunt sagittis nisi, sed convallis quam cursus id. Donec facilisis dolor nec massa mattis pharetra. Vivamus mollis hendrerit odio, non euismod dui dapibus ac. Vivamus ultricies ex erat, ut euismod purus lobortis at. Aenean eu facilisis dolor, nec placerat nisl. Donec ligula augue, cursus vel nisl eget, hendrerit gravida nunc. Nulla mauris nisi, blandit ac turpis at, aliquam ultrices metus. Aenean nec nisl magna. Nullam imperdiet bibendum vestibulum. Aliquam porttitor nisi ac tellus facilisis, vitae tincidunt sem consectetur. Vivamus convallis efficitur magna, at accumsan erat volutpat vel. In aliquet porttitor porttitor. Sed at malesuada nibh. Donec posuere, nulla a viverra pretium, mi arcu consequat augue, at iaculis nunc mauris sit amet augue. Nunc nec erat euismod justo consequat posuere quis eu urna. Aliquam lacus metus, facilisis eu nisi pretium, blandit aliquam ex. Morbi et varius odio. Fusce ac finibus ex, et dignissim massa. Sed nec massa porta dolor fringilla convallis. Etiam sit amet elit sapien. Duis scelerisque egestas enim eu tempor. In hac habitasse platea dictumst. Pellentesque interdum tellus sed ex faucibus sagittis. Proin lorem lectus, dictum nec varius eu, vehicula eget erat. Fusce sit amet imperdiet lectus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Quisque convallis condimentum ante, id egestas nisi ornare id. Curabitur nec quam rhoncus, hendrerit dui vel, sollicitudin risus. Fusce sed erat id ante fringilla blandit sit amet vehicula tellus. Nulla est lectus, fringilla nec sollicitudin non, vulputate vel magna.</Text>
            </ScrollView>
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
    color: '#434656',
  },
  header: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: "#FFF",
    marginBottom: 15,
  },
  pageTitle: {
    fontSize: 20,
    fontFamily: "YoungSerif-Regular",
    color: "#434656"
  },
  close: {
    paddingLeft: 10,
    justifyContent: 'center',
    color: "#434656"
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
  hibaCegImage:{
    width: '15%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  hibaCeg:{
    width: '45%',
    justifyContent: 'center'
  },
  kapcsName:{
    paddingTop: 15,
    paddingBottom: 5,
    fontFamily: "Montserrat",
    fontSize: 18,
    fontWeight: "normal",
    fontStyle: "normal",
    color: "#434656"
  },
  kapcsRole:{
    fontFamily: "Montserrat",
    fontSize: 14,
    fontWeight: "normal",
    fontStyle: "normal",
    color: "#A3ABBC"
  },
  tartalomBody:{
    marginTop: 15,
    marginLeft: 15,
    marginBottom: 40,

  },
  impresszumBody:{
    marginLeft: 15,
    marginRight: 5,
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
  }
});
