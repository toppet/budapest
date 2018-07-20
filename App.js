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
// import HomeScreen from './screens/HomeScreen';
// import MapScreen from './screens/MapScreen';
// import ExploreScreen from './screens/ExploreScreen';
// import EventsScreen from './screens/EventsScreen';
// import CalendarScreen from './screens/CalendarScreen';
// import { createBottomTabNavigator, BottomTabBar } from 'react-navigation';

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

// export default createBottomTabNavigator(
//   {
//     Home: {
//       screen: HomeScreen,
//       title: 'Homez'
//     },
//     Map: MapScreen,
//     Explore: ExploreScreen,
//     Events: EventsScreen,
//     Calendar: CalendarScreen,
//     // tabBarComponent: props => <BottomTabBar {...props} style={{ backgroundColor: '#ff0000' }} />,
//   },
//   {
//     navigationOptions: ({ navigation }) => ({
//       initialRouteName: "Home",
//       headerStyle: {
//         backgroundColor: "transparent"
//       },
//       headerTitleStyle: {
//         fontWeight: "bold",
//         color: "#fff",
//         zIndex: 1,
//         fontSize: 18,
//         lineHeight: 23,
//         fontFamily: "CircularStd-Bold"
//       },
//       headerMode: 'screen',
//       headerTintColor: "#fff",
//       animationEnabled: true,
//       tabBarIcon: () => {
//         const { routeName } = navigation.state;
//         let icon;

//         if (routeName === 'Home') {
//           icon = <Image source={require('./assets/images/home.png')} />;
//         } else if (routeName === 'Map') {
//           icon = <Image source={require('./assets/images/map.png')} />;
//         } else if (routeName === 'Explore') {
//           icon = <Image source={require('./assets/images/explore.png')} />;
//         } else if (routeName === 'Events') {
//           icon = <Image source={require('./assets/images/news.png')} />;
//         } else if (routeName === 'Calendar') {
//           icon = <Image source={require('./assets/images/calendar.png')} />;
//         }

//         // You can return any component that you like here! We usually use an
//         // icon component from react-native-vector-icons
//         return icon;
//       },
//       tabBarOptions: {
//         showLabel: false,
//         activeBackgroundColor: "#ffffff",
//         style: {
//           backgroundColor: '#EDEDED',
//           borderTopWidth: 1,
//           borderTopColor: "#b7a99b",
//           shadowColor: '#000',
//           shadowOffset: { width: 1, height: 5 },
//           shadowOpacity: 1,
//           shadowRadius: 2,
//           // elevation: 1,
//         },
//       }
//     }),
//   }
// );
