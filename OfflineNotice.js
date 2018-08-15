import React, { Component } from 'react';
import {
  View,
  Text,
  NetInfo,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window').width;
const { height } = Dimensions.get('window').height;


class OfflineNotice extends Component {

  state = {
    isConnected: true
  };

  componentDidMount() {
      NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
  }

  handleConnectivityChange = isConnected => {
    if (isConnected) {
      this.setState({ isConnected });
      console.log(isConnected);
    } else {
      this.setState({ isConnected });
    }
  };

  render() {
    if (!this.state.isConnected) {
      return (
        <View style={styles.offlineContainerNo}>
        <View style={{position: 'absolute', top: 60}}>
          <Icon name="arrow-downward" size={30} color="#73beff" />
        </View>
        <View style={{position: 'absolute', top: 100}}>
          <Text style={styles.pullText}>Frissítéshez húzza le a képernyőt</Text>
        </View>
        <View>
            <ImageBackground source={require('./assets/images/illustrationNointernet.png')} style={{width: 375, height: 325}} />
        </View>
          <View>
            <Text style={styles.offlineText}>Nincs internetkapcsolat</Text>
          </View>
        </View>
      );
    }
    return null
  }
}

const styles = StyleSheet.create({
  offlineContainer: {
    backgroundColor: 'red',
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: width,
    top: 10,
  },
  offlineContainerNo: {
    backgroundColor: '#FFF',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    width: width,
  },
  offlineText: {
    fontFamily: "YoungSerif",
    fontSize: 20,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: '#434656'
  },
  pullText: {
    fontFamily: "Montserrat",
    fontSize: 12,
    fontWeight: "600",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: '#73beff'
  },
  btn: {
    marginTop: 15,
    width: 150,
    height: 40,
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
  btnText: {
    color: '#c49565',
    fontFamily: "Montserrat",
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
});
export default OfflineNotice;
