import React, { Component } from 'react';
import _ from 'lodash';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Button,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icomoonConfig from '../../selection.json';
const CustomIcon = createIconSetFromIcoMoon(icomoonConfig);
import moment from 'moment';
require('moment/locale/hu');

import PageHeader from '../../components/PageHeader';

const latestNews = [
  {
    id: 0,
    imageSrc: require('../../assets/images/zsinagoga.jpg'),
    desc: 'Új applikáció készül a zsidó közösség számára, és ez egy nagyon nagyon hosszú cím ',
    date: new Date(),
  },
  {
    id: 1,
    imageSrc: require('../../assets/images/zsinagoga.jpg'),
    desc: 'Új applikáció készül a zsidó közösség számára',
    date: new Date(),
  },
  {
    id: 3,
    imageSrc: require('../../assets/images/zsinagoga.jpg'),
    desc: 'Új applikáció készül a zsidó közösség számára',
    date: new Date(),
  },
  {
    id: 4,
    imageSrc: require('../../assets/images/zsinagoga.jpg'),
    desc: 'Új applikáció készül a zsidó közösség számára',
    date: new Date(),
  },
  {
    id: 5,
    imageSrc: require('../../assets/images/zsinagoga.jpg'),
    desc: 'Új applikáció készül a zsidó közösség számára',
    date: new Date(),
  },
];

const latestEvents = [
  {
    id: 0,
    eventDesc: 'Legközelebbi esemény címe, amely ilyen hosszú lehet.',
    date: '2018-09-11 12:00',
  },
  {
    id: 1,
    eventDesc: 'Ez meg pont egy masik esemeny, ami nemsokora lesz.',
    date: '2018-10-05 20:00',
  },
  {
    id: 2,
    eventDesc: 'Ez meg mondjuk egy harmadik esemeny.',
    date: '2018-11-01 00:00',
  },
  {
    id: 3,
    eventDesc: 'Ez lesz a negyedik.',
    date: '2019-12-24 22:30',
  },
  {
    id: 4,
    eventDesc: 'Na még egyet a végére, hogy meglegyen az öt darab.',
    date: '2019-01-23 09:00',
  },
]

const bestPlaces = [
  {
    id: 0,
    imageSrc: require('../../assets/images/zsinagoga.jpg'),
    placeName: 'Dohány utcai Zsinagóga',
  },
  {
    id: 1,
    imageSrc: require('../../assets/images/rumbach.jpg'),
    placeName: 'Rumbach utcai Zsinagóga',
  },
  {
    id: 2,
    imageSrc: require('../../assets/images/kazinczy.jpg'),
    placeName: 'Kazinczy utcai Zsinagóga',
  },
  {
    id: 3,
    imageSrc: require('../../assets/images/hosoktemploma.jpg'),
    placeName: 'Hősök Temploma',
  },
  {
    id: 4,
    imageSrc: require('../../assets/images/hitkozseg.jpg'),
    placeName: 'A Budapesti Zsidó Hitközség székháza',
  },
]

export default class HomeScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      loading: true,
      menuOpened: false,
      currencies: {},
      weatherBUD: {},
      currentJDate: '-', 
    }
  }

  componentDidMount(){
    this.fetchData();
  }

  async fetchData() {
    const currencies = await this.getCurrency();
    const weather = await this.getWeather();
    const jDate = await this.getJDate();
    console.log("JDate", jDate);
    this.setState({ 
      loading: false,
      refreshing: false,
      currencies,
      weatherBUD: weather,
      currentJDate: jDate,
    });
  }

  getCurrency = async () => {
    try {
      return await fetch('https://free.currencyconverterapi.com/api/v6/convert?q=USD_HUF,EUR_HUF')
      .then((response) => response.json())
      .then((responseJson) => {
        const responseData = responseJson.results;
        return responseData;
      })
      .catch((error) => {
        return error;
      });
    } catch(e) {
      return e;
    }
  }

  getWeather = async () => {
    try {
      return fetch('https://api.darksky.net/forecast/e2118a40696c374f321c8af86daec18f/47.50045,19.07012?exclude=daily,minutely,hourly,alerts,flags&units=si&lang=hu')
        .then((response) => response.json())
        .then((responseJson) => {
          const responseData = responseJson.currently;
          return responseData;
        })
        .catch((error) => {
          return error;
        });
    } catch(e) {
      return e;
    }
  }

  getJDate = async () => {
    const today = moment().format('YYYY-MM-DD');
    try {
      return await fetch(`https://jewps.hu/api/v1/utils/date?date=${today}`)
      .then((response) => response.json())
      .then((responseJson) => {
        if(responseJson.success) {
          return responseJson.data;
        }
        
        return null;
      })
      .catch((error) => {
        console.log('error', error);
        return error;
      });
    } catch(e) {
      console.log('e', e);
      return e;
    }
  }

  renderWeathIcon(iconName){
    let wIcon = null;
    switch (iconName) {
      case "clear-day":
        wIcon =  <Image source={require('../../assets/images/weather/clear-day.png')} style={styles.weatherIcon}/>
        break;
      case "clear-night":
        wIcon = <Image source={require('../../assets/images/weather/clear-night.png')} style={styles.weatherIcon}/>
        break;
      case "cloudy":
        wIcon = <Image source={require('../../assets/images/weather/cloudy.png')} style={styles.weatherIcon}/>
        break;
      case "fog":
        wIcon = <Image source={require('../../assets/images/weather/fog.png')} style={styles.weatherIcon}/>
        break;
      case "partly-cloudy-day":
        wIcon = <Image source={require('../../assets/images/weather/partly-cloudy-day.png')} style={styles.weatherIcon}/>
        break;
      case "partly-cloudy-night":
        wIcon = <Image source={require('../../assets/images/weather/partly-cloudy-night.png')} style={styles.weatherIcon}/>
        break;
      case "rain":
        wIcon = <Image source={require('../../assets/images/weather/rain.png')} style={styles.weatherIcon}/>
        break;
      case "sleet":
        wIcon = <Image source={require('../../assets/images/weather/sleet.png')} style={styles.weatherIcon}/>
        break;
      case "snow":
        wIcon = <Image source={require('../../assets/images/weather/snow.png')} style={styles.weatherIcon}/>
        break;
      case "wind":
        wIcon = <Image source={require('../../assets/images/weather/wind.png')} style={styles.weatherIcon}/>
        break;
      default:
        wIcon = <Image source={require('../../assets/images/weather/clear-day.png')} style={styles.weatherIcon}/>
    }
    return wIcon;
  }

  getLoadingIndicator() {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  render() {
    const { 
      loading,
      currencies,
      weatherBUD,
      currentJDate,
    } = this.state;

    const newsCardWidth = parseInt(Dimensions.get('window').width*0.6, 10);
    const eventCardWidth = parseInt(Dimensions.get('window').width*0.7, 10);
    const placesCardWidth = parseInt(Dimensions.get('window').width*0.5, 10);

    let EUR_HUF = null;
    let USD_HUF = null;
    let weathTemp = null;
    let weathIcon = null;

    if(loading) {
      return this.getLoadingIndicator();
    }

    if(currencies.EUR_HUF && currencies.USD_HUF) {
      EUR_HUF = currencies.EUR_HUF.val.toFixed(2);
      USD_HUF = currencies.USD_HUF.val.toFixed(2);
    }

    if(weatherBUD && weatherBUD.temperature) {
      weathTemp = weatherBUD.temperature.toFixed(1);
      weathIcon = this.renderWeathIcon(weatherBUD.icon);
    }

    const newsCards = latestNews.map((n) => (
      <View style={[styles.cardShadow, {width: newsCardWidth}]} key={n.id}>
        <View style={styles.newsCard}>

          <View style={styles.imageBgBox}>
            <ImageBackground source={n.imageSrc} style={{width: '100%', height: '100%'}}/>
          </View>
          <View style={styles.newsCardInfoView}>

            <Text style={styles.newsDate}>{moment(n.date).format('YYYY.MM.DD')}</Text>

            {/* <TouchableOpacity onPress={() => console.log('ikonka')} style={{ marginLeft: 'auto' }}>
              <Icon name="bookmark-border" size={25} color="#73beff" />
            </TouchableOpacity> */}

            {/* <TouchableOpacity onPress={() => console.log('ikonka')} style={{marginLeft: 10}}>
              <CustomIcon name="ic_share" size={20} color='#73beff'/>
            </TouchableOpacity> */}
          </View>
          <Text style={styles.newsCardDesc}>{n.desc}</Text>


        </View>
      </View>
    ));

    const eventCards = latestEvents.map((e) => (
      <TouchableOpacity style={[styles.cardShadow, { width: eventCardWidth }]} key={e.id} onPress={() => this.props.navigation.navigate('EventDetail', { event: e })} activeOpacity={0.8}>
        <View style={styles.eventCard}>

          <View style={styles.eventCardInfoView}>
            <View style={styles.eventDayView}>
              <Text style={styles.eventDay}>{moment(e.date).format('DD')}</Text>
            </View>
            <View style={{flex: 1, marginRight: 'auto'}}>
              <Text style={styles.eventMonth}>{moment(e.date).format('MMMM').replace(/^\w/, c => c.toUpperCase())}</Text>
              <Text style={styles.eventYear}>{moment(e.date).format('YYYY')}</Text>
            </View>
            <View style={{width: 55}}>
              <Text style={styles.eventTime}>{moment(e.date).format('HH:mm')}</Text>
              <Text style={styles.eventTimeText}>{'Kezdés'}</Text>
            </View>
          </View>

          <Text style={styles.eventCardDesc}>{e.eventDesc}</Text>

        </View>
      </TouchableOpacity>
    ));

    const placesCards = bestPlaces.map((e) => (
      <TouchableOpacity style={[styles.cardShadow, { width: placesCardWidth }]} key={e.id} activeOpacity={1}>
        <View style={styles.placeCard}>

          <View style={styles.imageBgPlace}>
            <ImageBackground source={e.imageSrc} resizeMode='cover' style={{width: '100%', height: 115}}/>
          </View>
          <TouchableOpacity style={styles.readMoreBtn} onPress={() => this.props.navigation.navigate('Map', { mapItem: e  })} activeOpacity={0.95}>
            <Text style={styles.readMoreBtnText}>{e.placeName}</Text>
          </TouchableOpacity>

        </View>
      </TouchableOpacity>
    ));


    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>

        <View style={{flex: 1, alignItems: 'stretch', justifyContent: 'flex-start', paddingTop: 20,}}>

          <PageHeader {...this.props} noRightIcon/>

          <View style={{flex: 1, backgroundColor: 'transparent'}}>
            <ScrollView showsVerticalScrollIndicator={false}>

              <View style={{marginBottom: 38}}>
                <Text style={styles.title}>Üdvözöljük!</Text>
                <Text style={styles.date}>{moment().format('MMMM DD., dddd').replace(/^\w/, c => c.toUpperCase())}</Text>
              </View>

              <View style={{flexDirection: 'row', marginBottom: 50, alignItems: 'center', justifyContent: 'center' }}>
                <View style={{width: "35%", height: 70, padding: 5, alignItems: "center",  borderRightWidth: 2, borderRightColor: "#EDEDED"}}>
                  { weathIcon }
                  <Text style={styles.weatherText}>{weatherBUD.summary ? weatherBUD.summary : '-'}</Text>
                  <Text style={styles.weatherText}>{weathTemp ? weathTemp : '-'} °C</Text>
                </View>
                <View style={{width: "30%", height: 70, padding: 5, alignItems: "center", borderRightWidth: 2, borderRightColor: "#EDEDED"}}>
                  <Icon size={30} name="today" color="#434656"/>
                  <Text style={{fontFamily: "Montserrat", fontSize: 12, fontWeight: "bold", fontStyle: "normal", textAlign: "center", color: "#434656", paddingTop: 5}}>{currentJDate}</Text>
                </View>
                <View style={{width: "35%", height: 70, padding: 5, alignItems: "center"}}>
                  <Icon size={30} name="show-chart" color="#434656"/>
                    <View style={{flexDirection: 'row', paddingTop: 5,}}>
                      <Text style={{fontFamily: "Montserrat", fontSize: 12, fontWeight: "bold", fontStyle: "normal", textAlign: "center", color: "#434656"}}>EUR  </Text><Text style={{fontFamily: "Montserrat", fontSize: 12, fontWeight: "bold", fontStyle: "normal", color: "#73BEFF"}}>{EUR_HUF ? EUR_HUF : '-'}</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={{fontFamily: "Montserrat", fontSize: 12, fontWeight: "bold", fontStyle: "normal", textAlign: "center", color: "#434656"}}>USD  </Text><Text style={{fontFamily: "Montserrat", fontSize: 12, fontWeight: "bold", fontStyle: "normal", color: "#C49565"}}>{USD_HUF ? USD_HUF : '-'}</Text>
                    </View>
                </View>
              </View>

              <View>
                <View style={{ marginBottom: 15, flexDirection: 'row', alignItems: 'center', justifyContent:'space-between', paddingHorizontal: 15}}>
                  <Text style={{fontSize: 40, color: "rgba(183,169,155, 0.2)", position: 'absolute', left: 15, bottom: 0, fontFamily: 'YoungSerif-Regular'}}>Hírek</Text>
                  <Text style={{fontSize: 20, fontFamily: 'YoungSerif-Regular', color: "#434656"}}>Legfrissebb hírek</Text>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('News')}
                  >
                    <Text style={{fontFamily: "Montserrat", fontWeight: 'bold', color: '#b7a99b', fontSize: 15}}>Mind</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{paddingBottom: 10, paddingHorizontal: 15}}>
                  {newsCards}
                </ScrollView>
              </View>

              <View>
                <View style={{ marginBottom: 15, flexDirection: 'row', alignItems: 'center', justifyContent:'space-between', paddingHorizontal: 15}}>
                  <Text style={{fontSize: 40, color: "rgba(183,169,155, 0.2)", position: 'absolute', left: 15, bottom: 0, fontFamily: 'YoungSerif-Regular'}}>Események</Text>
                  <Text style={{fontSize: 20, fontFamily: 'YoungSerif-Regular', color: "#434656"}}>Közelgő események</Text>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Events')}
                  >
                    <Text style={{fontFamily: "Montserrat", fontWeight: 'bold', color: '#b7a99b', fontSize: 15}}>Mind</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{paddingBottom: 10, paddingHorizontal: 15}}>
                  {eventCards}
                </ScrollView>
              </View>

              <View>
                <View style={{ marginBottom: 15, flexDirection: 'row', alignItems: 'center', justifyContent:'space-between', paddingHorizontal: 15}}>
                  <Text style={{fontSize: 40, color: "rgba(183,169,155, 0.2)", position: 'absolute', left: 15, bottom: 0, fontFamily: 'YoungSerif-Regular'}}>Látnivalók</Text>
                  <Text style={{fontSize: 20, fontFamily: 'YoungSerif-Regular', color: "#434656"}}>Önnek ajánljuk</Text>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Map')}
                  >
                    <Text style={{fontFamily: "Montserrat", fontWeight: 'bold', color: '#b7a99b', fontSize: 15}}>Térkép</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: 15, paddingHorizontal: 15}}>
                  {placesCards}
                </ScrollView>
              </View>

            </ScrollView>
          </View>

        </View>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  header: {
    // flex: 1,
    height: 50,
    padding: 15,
    paddingTop: 0,
    paddingBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: "#fff"
  },
  pageTitle: {
    fontSize: 20,
    fontFamily: "YoungSerif-Regular",
  },
  title: {
    color: "#b7a99b",
    paddingTop: 20,
    paddingLeft: 15,
    fontSize: 35,
    fontFamily: "YoungSerif-Regular",
    marginTop: 10,
  },
  weatherIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  weatherText: {
    fontFamily: "Montserrat", 
    fontSize: 11, 
    fontWeight: "bold", 
    fontStyle: "normal", 
    textAlign: "center", 
    color: "#434656",
  },
  upNextTitle:{
    color: "#b7a99b",
    fontSize: 15,
    opacity: 0.7,
    fontFamily: "Montserrat-BoldItalic",
  },
  date: {
    fontFamily: "Montserrat-Black",
    fontSize: 14,
    paddingTop: 5,
    paddingLeft: 15,
    color: "#434656",
  },
  button: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 5,
    shadowOpacity: 0.1,
    elevation: 2,
    marginBottom: 40,
  },
  newsCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#eee',
    marginRight: 15,
    overflow: 'hidden',
  },
  newsDate: {
    fontFamily: 'Montserrat',
    fontSize: 11,
    color: '#797e9c',
  },
  imageBgBox: {
    height: 100,
    width: '100%',
    marginBottom: 5,
    borderRadius: 6,
  },
  placeCard:{
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#eee',
    marginRight: 15,
    height: 115,
    alignItems: 'center',
    marginBottom: 15
  },
  imageBgPlace: {
    height: '100%',
    width: '100%',
    marginBottom: 5,
  },
  readMoreBtn: {
    position: 'absolute',
    zIndex: 5,
    bottom: -20,
    width: 135,
    height: 50,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#b7a99b',
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
  readMoreBtnText: {
    color: '#434656',
    fontFamily: "Montserrat",
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'center',
  },
  newsCardDesc: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 15,
    fontFamily: "Montserrat",
    fontWeight: "bold",
    fontSize: 12,
  },
  newsCardInfoView: {
    height: 25,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 5,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  eventCard:{
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#eee',
    marginRight: 15,
  },

  eventCardDesc: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 10,
    fontFamily: "Montserrat",
    fontWeight: "bold",
    fontSize: 12
  },
  eventCardInfoView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 10,
  },
  eventDayView: {
    width: 30,
    height: 30,
    backgroundColor: 'rgba(183, 169, 155, 0.2)',
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  eventDay: {
    fontFamily: "Montserrat",
    fontWeight: '900',
    fontSize: 16,
    color: '#8e6034',
    fontStyle: 'italic',
  },
  eventMonth:{
    fontFamily: "Montserrat",
    fontSize: 14,
    fontWeight: '600',
    color: '#434656',
  },
  eventYear: {
    fontFamily: "Montserrat",
    fontSize: 10,
    fontWeight: '600',
    color: '#a3abbc',
  },
  eventTime: {
    fontFamily: "Montserrat",
    fontSize: 15,
    fontWeight: '900',
    color: '#434656',
  },
  eventTimeText: {
    fontFamily: "Montserrat",
    fontSize: 10,
    fontWeight: '600',
    color: '#a3abbc',
  },
});
