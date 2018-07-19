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
  Image,
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
  }

  showSettingsDialog() {
    console.log('tek');
    this.settingsDialog.show();
  }

  showContactDialog() {
    console.log('tek');
    this.contactDialog.show();
  }

  render() {
    return (
      <View style={{flex:1}}>

        <PopupDialog
          width={0.8}
          dialogAnimation={ScaleAnim}
          ref={(popupDialog) => { this.settingsDialog = popupDialog; }}
        >
          <View style={styles.dialogView}>
            <Text>Beallitasok</Text>
          </View>
        </PopupDialog>

        <PopupDialog
          width={0.8}
          dialogAnimation={ScaleAnim}
          ref={(popupDialog) => { this.contactDialog = popupDialog; }}
        >
          <View style={styles.dialogView}>
            <Text>Kontakt</Text>
          </View>
        </PopupDialog>

        <ProbaScreen 
          showSettingsDialog={() => this.showSettingsDialog()}
          showContactDialog={() => this.showContactDialog()}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  dialogView: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: "rgba(5, 5, 5, 0.25)"
  }
})
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
