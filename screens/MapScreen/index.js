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
} from 'react-native';

import MapView from 'react-native-maps';

import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icomoonConfig from '../../selection.json';
const CustomIcon = createIconSetFromIcoMoon(icomoonConfig);

const { width, height } = Dimensions.get("window");

const CARD_HEIGHT = height / 4;
const CARD_WIDTH = CARD_HEIGHT - 50;

const Images = [
  { uri: "https://i.imgur.com/sNam9iJ.jpg" },
  { uri: "https://i.imgur.com/N7rlQYt.jpg" },
  { uri: "https://i.imgur.com/UDrH0wm.jpg" },
  { uri: "https://i.imgur.com/Ka8kNST.jpg" }
]

const pinIcon = require('../../assets/images/ic_pin.png');
const selectedPinIcon = require('../../assets/images/ic_pin_valaszt.png');

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
        image: Images[0],
        title: "Dohány utcai zsinagóga",
        entryFee: 4000,
        currency: 'Ft',
        openingHours: 'Kedd 08:00 - 18:00',
        state: 'Nyitva',
      },
      {
        coordinate: {
          latitude: 47.4983726,
          longitude: 19.0541903,
        },
        image: Images[1],
        title: "Akvárium Klub",
        entryFee: 3000,
        currency: 'Ft',
        openingHours: 'Kedd 08:00 - 18:00',
        state: 'Nyitva',
      },
      // {
      //   coordinate: {
      //     latitude: 45.5230786,
      //     longitude: -122.6701034,
      //   },
      //   title: "Third Best Place",
      //   description: "This is the third best place in Portland",
      //   image: Images[2],
      // },
      // {
      //   coordinate: {
      //     latitude: 45.521016,
      //     longitude: -122.6561917,
      //   },
      //   title: "Fourth Best Place",
      //   description: "This is the fourth best place in Portland",
      //   image: Images[3],
      // },
    ],
    region: {
      latitude: 47.4978032,
      longitude: 19.0584075,
      latitudeDelta: 0.04864195044303443,
      longitudeDelta: 0.040142817690068,
    },
  }

  componentWillMount() {
    this.index = 0;
    this.animation = new Animated.Value(0);
  }

  componentDidMount() {
    // We should detect when scrolling has stopped then animate
    // We should just debounce the event listener here
    this.animation.addListener(({ value }) => {
      let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
      if (index >= this.state.markers.length) {
        index = this.state.markers.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }

      clearTimeout(this.regionTimeout);
      this.regionTimeout = setTimeout(() => {
        if (this.index !== index) {
          this.index = index;
          const { coordinate } = this.state.markers[index];
          this.map.animateToRegion(
            {
              ...coordinate,
              latitudeDelta: this.state.region.latitudeDelta,
              longitudeDelta: this.state.region.longitudeDelta,
            },
            350
          );
        }
      }, 10);
    });
  }

  handleMapViewPress(e) {
    if (e.nativeEvent.action !== 'marker-press') {
      this.setState({ 
        selectedMarker: null,
        selectedMarkerIndex: null,
      });
    }
  }


  render() {
    // const interpolations = this.state.markers.map((marker, index) => {
    //   const inputRange = [
    //     (index - 1) * CARD_WIDTH,
    //     index * CARD_WIDTH,
    //     ((index + 1) * CARD_WIDTH),
    //   ];
    //   const scale = this.animation.interpolate({
    //     inputRange,
    //     outputRange: [1, 2.5, 1],
    //     extrapolate: "clamp",
    //   });
    //   const opacity = this.animation.interpolate({
    //     inputRange,
    //     outputRange: [0.35, 1, 0.35],
    //     extrapolate: "clamp",
    //   });
    //   return { scale, opacity };
    // });
    let selectedMarkerCard = <View></View>;
    const { selectedMarker, selectedMarkerIndex } = this.state;

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
            <Text style={styles.valueText}>{`${selectedMarker.openingHours}`} | <Text style={styles.openState}>{`${selectedMarker.state}`}</Text></Text>
          </View>
          <View style={styles.rightView}>
            <View style={styles.imageWrap}>
              <ImageBackground source={require('../../assets/images/budapest.jpg')} style={{width: 120, height: 120,}} />
            </View>
          </View>
        </TouchableOpacity>
      );
    } 

    return (
      <View style={styles.container}>
        <MapView
          ref={map => this.map = map}
          initialRegion={this.state.region}
          style={styles.container}
          onPress={(e) => this.handleMapViewPress(e)}
        >
          {this.state.markers.map((marker, index) => {
            return (
              <MapView.Marker
                key={index} 
                coordinate={marker.coordinate} 
                image={selectedMarkerIndex === index ? selectedPinIcon : pinIcon}
                onPress={() => this.setState({ selectedMarker: marker, selectedMarkerIndex: index })}>
              </MapView.Marker>
            );
          })}
        </MapView>
        {/* <Animated.ScrollView
          horizontal
          scrollEventThrottle={1}
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: this.animation,
                  },
                },
              },
            ],
            { useNativeDriver: true }
          )}
          style={styles.scrollView}
          contentContainerStyle={styles.endPadding}
        >
          {this.state.markers.map((marker, index) => (
            <View style={styles.card} key={index}>
              <Image
                source={marker.image}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <View style={styles.textContent}>
                <Text numberOfLines={1} style={styles.cardtitle}>{marker.title}</Text>
                <Text numberOfLines={1} style={styles.cardDescription}>
                  {marker.description}
                </Text>
              </View>
            </View>
          ))}
        </Animated.ScrollView> */}
        
        { selectedMarkerCard }

        

      </View>
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
  card: {
    padding: 15,
    elevation: 2,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: 150,
    width: 330,
    position: 'absolute',
    bottom: 15,
    left: (Dimensions.get('window').width / 2) - 165,
    borderRadius: 10,
    flexDirection: 'row',
  },
  arrowIcon: {
    position: 'absolute',
    borderWidth: 5,
    borderColor: '#fff',
    borderRadius: 20,
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
  }

});
