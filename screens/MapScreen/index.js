import React, { Component } from 'react';
import {
  Platform,
  MapRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Animated,
  Image,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  SafeAreaView
} from 'react-native';
import moment from 'moment';

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icomoonConfig from '../../selection.json';
const CustomIcon = createIconSetFromIcoMoon(icomoonConfig);

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
    markers: [
      {
        coordinate: {
          latitude: 47.4959529,
          longitude: 19.0605719,
        },
        entryFee: 4000,
        currency: 'Ft',
        state: 'Nyitva',
        title: "Dohány utcai Zsinagóga, neológ",
        minEntryFee: 1200,
        maxEntryFee: 4000,
        currency: 'Ft',
        webPageLink: 'http://www.dohany-zsinagoga.hu/',
        facebookPageLink: 'https://www.facebook.com/Dohanytemplom/',
        ticketLink: 'https://www.jegy.hu/venue/dohany-utcai-zsinagoga-es-zsido-muzeum',
        phone: '+36 30 123 4567',
        address: 'Dohány u. 2, 1074 Budapest',
        thumbnail: require('../../assets/images/zsinagoga.jpg'),
        openingHours: [
          {
            day: 'Vasárnap',
            open: 'Zárva',
            close: 'Zárva',
            closed: true,
          },
          {
            day: 'Hétfő',
            open: '10:00',
            close: '20:00',
          },
          {
            day: 'Kedd',
            open: '10:00',
            close: '20:00',
          },
          {
            day: 'Szerda',
            open: '10:00',
            close: '20:00',
          },
          {
            day: 'Csütörtök',
            open: '10:00',
            close: '20:00',
          },
          {
            day: 'Péntek',
            open: '8:30',
            close: '16:00',
          },
          {
            day: 'Szombat',
            open: 'Zárva',
            close: 'Zárva',
            closed: true,
          },
        ],
        description: 'A Dohány utcai Zsinagóga Budapest egyik kiemelt turisztikai látványossága, Európa legnagyobb, a világ második legnagyobb zsinagógája. 1859-ban épült mór stílusban, 3000 fő befogadására alkalmas. Nagysága a korabeli fővárosi zsidóság jelentőségét, magas színvonalú gazdasági és kulturális igényét bizonyítja.A templom építésze Ludwig Förster (1797—1863) német építész, a bécsi akadémia tanára volt. Az építésvezető Wechselmann Ignác műépítész (1828—1903), aki később egész vagyonát a Vakok Intézetére hagyta. Förster távozása után Feszl Frigyes, a Vigadó híres építésze tervezte a templom belső szentélyét. A zsinagóga ünnepélyes felavatására 1859. szeptember 6-án került sor. A belső tér 1200 négyzetméter, tornyainak magassága 44 méter, a sík mennyezetű belső térben közel háromezer ember, a földszinten 1497 férfi, az emeleti karzatokon pedig 1472 női ülés található.'
      },
      {
        coordinate: {
          latitude: 47.4977421,
          longitude: 19.0586996,
        },
        entryFee: 0,
        currency: 'Ft',
        state: 'Nyitva',
        title: "Rumbach utcai Zsinagóga, status quo",
        minEntryFee: null,
        maxEntryFee: null,
        currency: 'Ft',
        webPageLink: 'http://www.dohany-zsinagoga.hu/',
        facebookPageLink: null,
        ticketLink: null,
        phone: null,
        address: 'Budapest, Rumbach Sebestyén u. 11-13, 1074',
        thumbnail: require('../../assets/images/rumbach.jpg'),
        openingHours: [
          {
            day: 'Vasárnap',
            open: 'Zárva',
            close: 'Zárva',
            closed: true,
          },
          {
            day: 'Hétfő',
            open: '10:00',
            close: '20:00',
          },
          {
            day: 'Kedd',
            open: '10:00',
            close: '20:00',
          },
          {
            day: 'Szerda',
            open: '10:00',
            close: '20:00',
          },
          {
            day: 'Csütörtök',
            open: '10:00',
            close: '20:00',
          },
          {
            day: 'Péntek',
            open: '8:30',
            close: '16:00',
          },
          {
            day: 'Szombat',
            open: 'Zárva',
            close: 'Zárva',
            closed: true,
          },
        ],
        description: 'A Rumbach utcai zsinagóga romantikus, a mór építészet jegyeit utánzó stílusban épült zsinagóga a budapesti „zsinagóga-háromszögben”, a későbbi budapesti gettó területén. „Kis zsinagóga”-ként is ismert (a „nagy zsinagóga” a Dohány utcai). A VII. kerületben található, a Rumbach Sebestyén utca 11-13. szám alatt (valamikor a 8-as szám volt).A zsinagóga 1869 és 1872 között épült közadakozásból, tervezője az osztrák Otto Wagner, aki a bécsi szecesszió vezető alakja volt. A falán magyar nyelvű emléktábla olvasható, amely azokra a zsidókra emlékeztet, akiket 1941-ben ebben az épületben gyűjtöttek össze, mielőtt a megszállt ukrajnai Kamenyeck-Podolszkba szállítottak a magyar hatóságok, ahol a németek legyilkolták őket.'
      },
    ],
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
  }

  componentWillMount() {
    this.index = 0;
    // this.animation = new Animated.Value(0);
  }

  componentDidMount() {
    // this.setState({
    //   selectedMarker: this.state.markers[this.props.navigation.getParam('itemId')],
    //   selectedMarkerIndex: this.props.navigation.getParam('itemId'),
    // });
  }

  shouldComponentUpdate(nextProps, nextState) {
    // console.log('this.props', this.props);
    // console.log('nextProps', nextProps);
    // console.log('nextState', nextState);
    // this.setState({
    //   selectedMarker: this.state.markers[this.props.navigation.getParam('itemId')],
    //   selectedMarkerIndex: this.props.navigation.getParam('itemId'),
    // });
    // if(this.state.selectedMarkerIndex !== nextState.selectedMarkerIndex) {
    //   return true;
    // }
    // return false;
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
    var format = 'hh:mm';

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

  render() {
    let selectedMarkerCard = <View></View>;
    let { selectedMarker, selectedMarkerIndex, navParamMapItemId } = this.state;
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
      selectedMarkerCard = (
        <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={() => this.props.navigation.navigate('MapDetail', { mapItem: this.state.selectedMarker }) }>
          <CustomIcon name="ic_forward" size={30} style={styles.arrowIcon}/>
          <View style={styles.leftView}>
            <Text style={styles.markerType}>NEVEZETESSÉG</Text>
            <Text style={styles.markerTitle}>{selectedMarker.title}</Text>
            <Text style={styles.labelText}>
              Belépő: <Text style={styles.valueText}>{`${selectedMarker.entryFee} ${selectedMarker.currency}`}</Text>
            </Text>
            <Text style={styles.labelText}>Nyitvatartás:</Text>
            <Text style={styles.valueText}>
              {this.getOpeningHours(selectedMarker.openingHours[currentDayIndex])}
            </Text>
          </View>
          <View style={styles.rightView}>
            <View style={styles.imageWrap}>
              <ImageBackground source={selectedMarker.thumbnail} style={{width: 120, height: 120}} />
            </View>
          </View>
        </TouchableOpacity>
      );
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
                placeholder="Keresés itt: Helyszínek"
                placeholderTextColor="#b7a99b"
                onChangeText={(text) => this.setState({ searchText: text })}
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

});
