import React, { Component } from 'react';
import {
  Platform,
  MapRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  SafeAreaView
} from 'react-native';
import _ from 'lodash';
import moment from 'moment';

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icomoonConfig from '../../selection.json';
const CustomIcon = createIconSetFromIcoMoon(icomoonConfig);
import textContentJSON from './mapTrans.json';
import markersJSON from './markers';


const { width, height } = Dimensions.get("window");

const CARD_HEIGHT = height / 4;
const CARD_WIDTH = CARD_HEIGHT - 50;

const percent90HalfWidth = Math.round((Dimensions.get('window').width * 0.9) / 2);

const pinIcon = require('../../assets/images/ic_pin.png');
const selectedPinIcon = require('../../assets/images/ic_pin_valaszt.png');
customMapStyle = [
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.business",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  }
];

export default class MapScreen extends Component {
  state = {
    selectedMarker: null,
    selectedMarkerIndex: null,
    markers: markersJSON,
    region: {
      latitude: 47.4984094,
      longitude: 19.0621811,
      latitudeDelta: 0.015,
      longitudeDelta: 0.015,
    },
    polygonCoordinates: [
      {
        latitude: 47.502895,
        longitude: 19.064554,
      },
      {
        latitude: 47.501382,
        longitude: 19.065932,
      },
      {
        latitude: 47.498493,
        longitude: 19.069804,
      },
      {
        latitude: 47.496672,
        longitude: 19.066784,
      },
      {
        latitude: 47.495468,
        longitude: 19.062850,
      },
      {
        latitude: 47.495751,
        longitude: 19.059064,
      },
      {
        latitude: 47.497643,
        longitude: 19.055620,
      },
    ],
    searchText: '',
    navParamMapItemId: null,
    filteredAttractions: [],
  }

  componentDidMount() {
    // this.index = 0;
    // this.animation = new Animated.Value(0);
    const attractionNames = this.state.markers.map((marker) => marker.title.toLowerCase());
    this.setState({ attractionNames });
  }

  handleMapViewPress(e) {
    if (e.nativeEvent.action !== 'marker-press') {
      this.setState({
        selectedMarker: null,
        selectedMarkerIndex: null,
      });
    }
  }

  getOpeningHours(openingHours) {
    const { open, close, closed } = openingHours;
    const now = new Date();
    const format = 'hh:mm';
    
    if (closed) {
      return <Text>{`${openingHours.day}: `} <Text style={styles.closedState}>Zárva</Text></Text>;
    }

    let time = moment(now, format);
    let openingTime = moment(open, format);
    let closingingTime = moment(close, format);
    let resultText;

    if(time.isBetween(openingTime, closingingTime)){
      resultText = <Text>{`${openingHours.day}: ${open} - ${close} | `}<Text style={styles.openState}>Nyitva</Text></Text>;
    } else {
      resultText = <Text>{`${openingHours.day}: ${open} - ${close} | `}<Text style={styles.closedState}>Zárva</Text></Text>
    }

    return resultText;
  }

  setMarker(markerIndex) {
    this.setState({
      selectedMarker: this.state.markers[markerIndex],
      selectedMarkerIndex: markerIndex,
    });
  }

  filterAttractions(text) {
    const { markers } = this.state;
    const lowerCaseFilterText = text.toLowerCase();
    const filteredAttractions = _.filter(markers, (marker) => marker.title.toLowerCase().indexOf(lowerCaseFilterText) !== -1);
    this.setState({ filteredAttractions });
  }

  render() {
    let textContent =  textContentJSON.hu;
    moment.locale('hu');

    if(this.props.screenProps.settingsEng) {
      textContent = textContentJSON.en;
      moment.locale('en');
    }

    let selectedMarkerCard = <View></View>;
    let { 
      selectedMarker, 
      selectedMarkerIndex, 
      navParamMapItemId,
      filteredAttractions,
    } = this.state;
    const { navigation } = this.props;
    const currentDayIndex = moment().day();
    // let navParamMapItemId = navigation.getParam('itemId', null);

    // if(selectedMarker === null && navParamMapItemId !== null) {
    //   // console.log('this.state.markers[navParamMapItemId]', this.state.markers[navParamMapItemId], 'navParamMapItemId', navParamMapItemId);
    //   // selectedMarkerIndex = navParamMapItemId;
    //   // selectedMarker = this.state.markers[navParamMapItemId];
    //   // navParamMapItemId = null;
    //   // this.setMarker(navParamMapItemId);
    // }

    if (selectedMarker) {
      const openingHours = selectedMarker.openingHours ? selectedMarker.openingHours[currentDayIndex] : null;
      const entryFee = selectedMarker.entryFee !== 0 ? `${selectedMarker.entryFee} ${selectedMarker.currency}` : 'ingyenes';

      const openingHoursWrap = (
        <View>
          <Text style={styles.labelText}>{textContent.nyitvatartas}</Text>
          <Text style={styles.valueText}>
            {openingHours ? this.getOpeningHours(openingHours) : null}
          </Text>
        </View>
      );
      
      const entryFeeWrap = (
        <Text style={styles.labelText}>
          {textContent.belepo} <Text style={styles.valueText}>{entryFee}</Text>
        </Text>
      );

      selectedMarkerCard = (
        <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={() => this.props.navigation.navigate('MapDetail', { mapItem: this.state.selectedMarker }) }>
          <CustomIcon name="ic_forward" size={30} style={styles.arrowIcon}/>
          <View style={styles.leftView}>
            <Text style={styles.markerType}>{textContent.nevezetesseg}</Text>
            <Text style={styles.markerTitle}>{selectedMarker.title}</Text>
            { selectedMarker.entryFee !== 0 ? entryFeeWrap : null }
            { selectedMarker.openingHours ? openingHoursWrap : null }
          </View>
          <View style={styles.rightView}>
            <View style={styles.imageWrap}>
              <ImageBackground source={selectedMarker.thumbnail_1} style={{width: 120, height: 120}} />
            </View>
          </View>
        </TouchableOpacity>
      );
    }

    let filteredAttractionsList = <Text style={styles.noResultText}>Nincs Találat</Text>;

    if (filteredAttractions && filteredAttractions.length > 0 ){
      filteredAttractionsList = filteredAttractions.map((attraction) => {
        return (
          <TouchableOpacity
            key={attraction.id}
            style={styles.filterListItem}
            onPress={() => this.setState({
              searchText: '',
              selectedMarker: attraction,
              selectedMarkerIndex: attraction.id,
            })}
          >
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, }}>
              <Text style={styles.filterListItemText}>{attraction.title}</Text>
              <Icon name="keyboard-arrow-right" size={25} color="#d8d8d8" />
            </View>
          </TouchableOpacity>
        );
      });  
    }

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
            <View style={styles.searchBarWrap}>

              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => {
                  Keyboard.dismiss()
                  this.props.screenProps.openMenu();
                }}
                activeOpacity={0.8}
              >
                <Image source={require('../../assets/images/icMenu.png')} />
              </TouchableOpacity>

              <TextInput
                style={[styles.searchBarTextInput,
                  {
                    fontStyle: this.state.searchText.length == 0 ? 'italic' : 'normal',
                    color: this.state.searchText.length == 0 ? '#b7a99b' : '#434656',
                    opacity: this.state.searchText.length == 0 ? 0.5 : 1,
                  }]
                }
                placeholder={textContent.searchPlaceholder}
                placeholderTextColor="#b7a99b"
                onChangeText={(text) => this.setState({ searchText: text }, this.filterAttractions(text))}
                value={this.state.searchText}
              />
              

              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                {/* <Icon style={styles.menuButton} name='search' color="#434656" size={25}/> */}

                <TouchableOpacity
                  style={styles.menuButton}
                  onPress={() => {
                    Keyboard.dismiss()
                  }}
                  activeOpacity={0.6}
                >
                  <Icon name='gps-fixed' color="#434656" size={25}/>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ 
              display: this.state.searchText.length > 0 ? 'flex' :'none', 
              position: 'absolute', 
              zIndex: 3, 
              flex: 1, 
              height: '100%', 
              width: '100%', 
              backgroundColor: '#fff',
              paddingTop: 125,
            }}>
              { filteredAttractionsList }
            </View>

            <MapView
              // provider={PROVIDER_GOOGLE}
              ref={map => this.map = map}
              initialRegion={this.state.region}
              style={styles.container}
              customMapStyle={customMapStyle}
              onPress={(e) => this.handleMapViewPress(e)}
              showsUserLocation
              showsMyLocationButton
            >
              <MapView.Polygon
                coordinates={this.state.polygonCoordinates}
                strokeWidth={3}
                strokeColor="#c49565"
                fillColor="rgba(183, 169, 155, 0.15)"
              />
              {this.state.markers.map((marker, index) => {
                return (
                  <MapView.Marker
                    key={index}
                    coordinate={marker.coordinate}
                    image={selectedMarkerIndex === index ? selectedPinIcon : pinIcon}
                    onPress={() => {
                      selectedMarkerIndex !== index ? this.setState({ selectedMarker: marker, selectedMarkerIndex: index }) : null 
                    }}
                  >
                  </MapView.Marker>
                );
              })}
            </MapView>

            { selectedMarkerCard }
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  endPadding: {
    paddingRight: width - CARD_WIDTH,
  },
  searchBarWrap: {
    position: 'absolute',
    zIndex: 5,
    top: 40,
    width: '90%',
    height: 50,
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: "#ededed",
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
    left: (Dimensions.get('window').width / 2) - percent90HalfWidth,
  },
  searchBarTextInput: {
    flex: 1,
    height: '100%',
    fontFamily: "Montserrat",
    fontSize: 14,
    fontWeight: "600",
    color: '#b7a99b',
    paddingLeft: 15 ,
    borderLeftWidth: 2,
    borderLeftColor: '#ededed',
    borderRightWidth: 2,
    borderRightColor: '#ededed',
  },
  menuButton: {
    height: '100%',
    maxWidth: 57,
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    padding: 15,
    elevation: 2,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: 150,
    width: '90%',
    position: 'absolute',
    bottom: 15,
    left: (Dimensions.get('window').width / 2) - percent90HalfWidth,
    borderRadius: 10,
    flexDirection: 'row',
  },
  arrowIcon: {
    position: 'absolute',
    borderWidth: 5,
    borderColor: '#fff',
    borderRadius: 20,
    backgroundColor: '#fff',
    overflow: 'hidden',
    top: -15,
    left: (Dimensions.get('window').width / 2) - 45,
    color: '#c49565',
  },
  leftView: {
    width: '55%',
  },

  rightView: {
    width: '45%',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  cardImage: {
    flex: 3,
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  markerType: {
    fontFamily: 'YoungSerif-Regular',
    fontSize: 12,
    color: '#797e9c',
    marginBottom: 5,
  },
  markerTitle: {
    color: '#c49565',
    fontFamily: 'Montserrat',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  imageWrap: {
    overflow: 'hidden',
    borderRadius: 10,
  },
  labelText: {
    fontFamily: 'Montserrat',
    fontSize: 12,
    color: '#434656',
    fontWeight: '600',
    marginBottom: 5,
  },
  valueText: {
    fontFamily: 'Montserrat',
    fontSize: 12,
    color: '#a3abbc',
    fontWeight: '600',
  },
  openState: {
    fontFamily: 'Montserrat',
    fontSize: 12,
    fontWeight: '600',
    color: '#6ce986',
  },
  closedState: {
    fontFamily: 'Montserrat',
    fontSize: 12,
    fontWeight: '600',
    color: '#ff7070',
  },
  filterListItem: {
    padding: 10,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ededed',
  },
  filterListItemText: {
    fontFamily: "Montserrat",
    fontSize: 14,
    fontWeight: "600",
    color: '#434656',
    maxWidth: '85%',
  }, 
  noResultText: {
    fontFamily: "Montserrat",
    fontSize: 18,
    fontWeight: "600",
    color: '#797e9c',
    width: '100%',
    textAlign: 'center',
    fontStyle: 'italic',
  }

});
