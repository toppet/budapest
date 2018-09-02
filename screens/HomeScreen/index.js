import React, { Component } from 'react';
import _ from 'lodash';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  Platform,
  NativeModules
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icomoonConfig from '../../selection.json';
const CustomIcon = createIconSetFromIcoMoon(icomoonConfig);

import { NavigationActions } from 'react-navigation';

import moment from 'moment';
import 'moment/locale/hu';

import textContentJSON from './homeScreenTrans.json';

import PageHeader from '../../components/PageHeader';
import PageLoader from '../../components/PageLoader';

const bestPlaces = [
  {
    id: 0,
    imageSrc: require('../../assets/images/attractions/dohany1.jpg'),
    placeName: 'Dohány utcai Zsinagóga',
  },
  {
    id: 1,
    imageSrc: require('../../assets/images/attractions/rumbach1.jpg'),
    placeName: 'Rumbach utcai Zsinagóga',
  },
  {
    id: 2,
    imageSrc: require('../../assets/images/attractions/kazinczy1.jpg'),
    placeName: 'Kazinczy utcai Zsinagóga',
  },
  {
    id: 6,
    imageSrc: require('../../assets/images/attractions/hosok1.jpg'),
    placeName: 'Hősök Temploma',
  },
  {
    id: 5,
    imageSrc: require('../../assets/images/attractions/orthodox1.jpg'),
    placeName: 'A Budapesti Zsidó Hitközség székháza',
  },
]

export default class HomeScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      loading: true,
      menuOpened: false,
      currencies: null,
      weatherBUD: null,
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
    const latestNews = await this.getLatestNews();
    const latestEvents = await this.getLatestEvents();

    this.setState({
      loading: false,
      refreshing: false,
      currencies,
      weatherBUD: weather,
      currentJDate: jDate,
      latestNews,
      latestEvents,
    });
  }

  _onRefresh = async () => {
    this.setState({
      refreshing: true,
    });

    setTimeout(() => this.fetchData(), 1000);

    // // a little bit of delay
    // setTimeout(() =>
    //   this.setState({
    //     latestNewsInState: refreshednewsAndTopNewsResponse,
    //     top3News: this.getTop3News(refreshednewsAndTopNewsResponse),
    //     refreshing: false,
    //     refreshingNewsList: false,
    //   }),
    // 1000);
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
        return null;
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
          return null;
        });
    } catch(e) {
      return e;
    }
  }

  getJDate = async () => {
    const today = moment().format('YYYY-MM-DD');
    try {
      return await fetch(`https://jewps.hu/api/v1/utils/date/${today}`)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('responseJson', responseJson);
        return responseJson.success ? responseJson.data : null;
      })
      .catch((error) => {
        return null;
      });
    } catch(e) {
      return null;
    }
  }

  getLatestNews = async () => {

    try {
      return await fetch('https://jewps.hu/api/v1/news')
        .then((response) => response.json())
        .then((responseJson) => {
          const responseData = responseJson.data;
          if(responseJson.success) {
            return responseData.slice(0, 4);
          }
          return null;
        })
        .catch((error) => {
          return null;

        });

    } catch(e) {
      return e;
    }
  }

  getLatestEvents = async () => {

    try {
      return await fetch(`https://jewps.hu/api/v1/events?fromDate=${moment().format('YYYY-MM-DD')}`)
      .then(response => response.json())
      .then(resJson => {
        return resJson.success ? resJson.data.slice(0, 4) : null;
      })
    } catch(e) {
      return null;
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

  // getLoadingIndicator(textContent) {
  //   return (
  //     <View style={styles.loadingContainer}>
  //       <ActivityIndicator size="large" color="#B7A99B" />
  //       <Text style={{fontSize: 20, fontFamily: 'YoungSerif-Regular', color: "#434656", marginTop: 15}}>{textContent.loadingTitle}</Text>
  //     </View>
  //   );
  // }

  render() {
    const {
      loading,
      currencies,
      weatherBUD,
      currentJDate,
      latestNews,
      latestEvents,
    } = this.state;

    let textContent =  textContentJSON.hu;
    moment.locale('hu');

    if(this.props.screenProps.settingsEng) {
      textContent = textContentJSON.en;
      moment.locale('en');
    }

    // const newsCardWidth = parseInt(Dimensions.get('window').width * 0.6, 10);
    // const eventCardWidth = parseInt(Dimensions.get('window').width * 0.7, 10);
    // const placesCardWidth = parseInt(Dimensions.get('window').width * 0.5, 10);
    const newsCardWidth = 300;
    const eventCardWidth = 300;
    const placesCardWidth = 200;

    let EUR_HUF = null;
    let USD_HUF = null;
    let weathTemp = null;
    let weathIcon = null;
    let newsCards = null;
    let eventCards = null;
    let holidayBox = null;

    if(loading) {
      return <PageLoader textContent={textContent} />;
    }

    if(currencies.EUR_HUF && currencies.USD_HUF) {
      EUR_HUF = currencies.EUR_HUF.val.toFixed(2);
      USD_HUF = currencies.USD_HUF.val.toFixed(2);
    }

    if(weatherBUD && weatherBUD.temperature) {
      weathTemp = weatherBUD.temperature.toFixed(1);
      weathIcon = this.renderWeathIcon(weatherBUD.icon);
    }

    if(latestNews && latestNews.length > 0) {
      newsCards = latestNews.map((n) => {
        const bgImage =  _.find(n.media, n => n.type === 1);
        return (
          <TouchableOpacity style={[styles.cardShadow, {width: newsCardWidth}]} key={n.id} onPress={() => this.props.navigation.navigate('NewsDetail', { newsItem: n })} activeOpacity={0.8}>
            <View style={styles.newsCard}>

              <View style={styles.imageBgBox}>
                <ImageBackground source={{ uri: bgImage.src_thumbs }} style={{width: '100%', height: '100%'}}/>
              </View>

              <View style={styles.newsCardInfoView}>
                <Text style={styles.newsDate}>{moment(n.posted_at).format('YYYY.MM.DD')}</Text>
              </View>

              <Text style={styles.newsCardDesc}>{n.title}</Text>
            </View>
          </TouchableOpacity>
        )
      });
    }

    if (currentJDate && currentJDate.type === 1) {
      holidayBox = (
        <View style={{marginLeft: 'auto', marginRight: 15, marginTop: 15}}>
          <View style={styles.unnepTitleView}>
            <Icon size={15} name="notifications" color="#434656"/>
            <Text style={styles.unnepTitle}>{`${textContent.unnepnapTitle}:`}</Text>
          </View>
          <View style={styles.unnepnapBox}>
            <Text style={styles.unnepBoxTitle}>{currentJDate.name}</Text>
          </View>
        </View>
      );
    }

    if (latestEvents && latestEvents.length > 0) {
      eventCards = latestEvents.map((e) => (
        <TouchableOpacity style={[styles.cardShadow, { width: eventCardWidth }]} key={e.id} onPress={() => this.props.navigation.navigate('EventDetail', { event: e })} activeOpacity={0.8}>
          <View style={styles.eventCard}>

            <View style={styles.eventCardInfoView}>
              <View style={styles.eventDayView}>
                <Text style={styles.eventDay}>{moment(e.from).format('DD')}</Text>
              </View>

              <View style={{flex: 1, marginRight: 'auto'}}>
                <Text style={styles.eventMonth}>{moment(e.from).format('MMMM').replace(/^\w/, c => c.toUpperCase())}</Text>
                <Text style={styles.eventYear}>{moment(e.from).format('YYYY')}</Text>
              </View>

              <View style={{width: 55}}>
                <Text style={styles.eventTime}>{moment(e.from).format('HH:mm')}</Text>
                <Text style={styles.eventTimeText}>{'Kezdés'}</Text>
              </View>
            </View>

            <Text style={styles.eventCardDesc}>{e.name}</Text>

          </View>
        </TouchableOpacity>
      ));
    }

    const placesCards = bestPlaces.map((e) => {
      return (
        <TouchableOpacity 
          style={[styles.cardShadow, { width: placesCardWidth, marginBottom: 40, }]} 
          key={e.id} 
          activeOpacity={0.9}
          onPress={() => { this.props.navigation.navigate("Map", { itemId: e.id }) }}
        >
          <View style={styles.placeCard}>

            <View style={styles.imageBgPlace}>
              <ImageBackground source={e.imageSrc} resizeMode='cover' style={{width: '100%', height: 115}}/>
            </View>
            <TouchableOpacity style={styles.readMoreBtn} onPress={() => { this.props.navigation.navigate("Map", { itemId: e.id }) }}
              activeOpacity={0.95}
            >
              <Text style={styles.readMoreBtnText}>{e.placeName}</Text>
            </TouchableOpacity>

          </View>
        </TouchableOpacity>
      );
    });

    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>

        <View style={{flex: 1, alignItems: 'stretch', justifyContent: 'flex-start', paddingTop: Platform.OS === 'android' ? 0 :  20,}}>

          <PageHeader {...this.props} noRightIcon/>

          <View style={{flex: 1, backgroundColor: 'transparent'}}>

            <ScrollView
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh}
                />
              }
            >

              <View style={{marginBottom: 30, flexDirection: 'row', alignItems:'flex-end'}}>
                <View>
                  <Text style={styles.title}>{textContent.homeTitle}</Text>
                  <Text style={styles.date}>{moment().format('MMMM DD., dddd').replace(/^\w/, c => c.toUpperCase())}</Text>
                </View>
                { holidayBox }
              </View>

              <View style={{flexDirection: 'row', marginBottom: 30, alignItems: 'center', justifyContent: 'center' }}>
                <View style={{width: "35%", height: 70, padding: 5, alignItems: "center",  borderRightWidth: 2, borderRightColor: "#EDEDED"}}>
                  { weathIcon }
                  <Text style={styles.weatherText}>{weatherBUD && weatherBUD.summary ? weatherBUD.summary : '-'}</Text>
                  <Text style={styles.weatherCels}>{weathTemp ? weathTemp : '-'} °C</Text>
                </View>

                <View style={{width: "30%", height: 70, padding: 5, alignItems: "center", borderRightWidth: 2, borderRightColor: "#EDEDED"}}>
                  <TouchableOpacity onPress={() => { this.props.navigation.navigate("Calendar") }}
                    activeOpacity={0.8}
                  >
                    <View style={{alignItems: "center"}}>
                      <Image source={require('../../assets/images/calendar.png')} />
                      <Text style={{fontFamily: "Montserrat-Regular", fontSize: 12, fontWeight: "bold", fontStyle: "normal", textAlign: "center", color: "#434656", paddingTop: 5}}>{currentJDate ? currentJDate.date : null}</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={{width: "35%", height: 70, padding: 5, alignItems: "center"}}>
                  <Icon size={30} name="show-chart" color="#434656"/>
                    <View style={{flexDirection: 'row', paddingTop: 5,}}>
                      <Text style={{fontFamily: "Montserrat-Regular", fontSize: 12, fontWeight: "bold", fontStyle: "normal", textAlign: "center", color: "#434656"}}>EUR  </Text><Text style={{fontFamily: "Montserrat-Regular", fontSize: 12, fontWeight: "bold", fontStyle: "normal", color: "#73BEFF"}}>{EUR_HUF ? EUR_HUF : '-'}</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={{fontFamily: "Montserrat-Regular", fontSize: 12, fontWeight: "bold", fontStyle: "normal", textAlign: "center", color: "#434656"}}>USD  </Text><Text style={{fontFamily: "Montserrat-Regular", fontSize: 12, fontWeight: "bold", fontStyle: "normal", color: "#C49565"}}>{USD_HUF ? USD_HUF : '-'}</Text>
                    </View>
                </View>
              </View>

              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent:'space-between', paddingHorizontal: 15}}>
                  <Text style={styles.subtitleBack}>{textContent.hirekBack}</Text>
                  <Text style={styles.subtitleFront}>{textContent.hirekTop}</Text>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('News')}
                  >
                    <Text style={styles.moreBtn}>{textContent.mindBtn}</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{paddingBottom: 10, paddingHorizontal: 15}}>
                  {newsCards}
                </ScrollView>
              </View>

              <View>
                <View style={{ marginBottom: 15, flexDirection: 'row', alignItems: 'center', justifyContent:'space-between', paddingHorizontal: 15}}>
                  <Text style={styles.subtitleBack}>{textContent.esemenyekBack}</Text>
                  <Text style={styles.subtitleFront}>{textContent.esemenyekTop}</Text>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Events')}
                  >
                    <Text style={styles.moreBtn}>{textContent.mindBtn}</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{paddingBottom: 10, paddingHorizontal: 15}}>
                  {eventCards}
                </ScrollView>
              </View>

              <View>
                <View style={{ marginBottom: 15, flexDirection: 'row', alignItems: 'center', justifyContent:'space-between', paddingHorizontal: 15}}>
                  <Text style={styles.subtitleBack}>{textContent.terkepBack}</Text>
                  <Text style={styles.subtitleFront}>{textContent.terkepTop}</Text>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Map')}
                  >
                    <Text style={styles.moreBtn}>{textContent.terkepBtn}</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: 15, paddingHorizontal: 15}}>
                  { placesCards }
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
    padding: Platform.OS === 'android' ? 0 : 15,
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
  subtitleBack: {
    fontFamily: 'YoungSerif-Regular',
    fontSize: 40,
    color: "rgba(183,169,155, 0.2)",
    position: 'absolute',
    left: 15,
    bottom: 5,
  },
  subtitleFront: {
    fontFamily: 'YoungSerif-Regular',
    fontSize: 20,
    color: "#434656",
  },
  weatherIcon: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
    marginBottom: 3,
  },
  weatherText: {
    fontFamily: "Montserrat-Bold",
    fontSize: 11,
    // fontWeight: "bold",
    // fontStyle: "normal",
    textAlign: "center",
    color: "#A3ABBC",
  },
  weatherCels: {
    fontFamily: "Montserrat-Bold",
    fontSize: 11,
    // fontWeight: "bold",
    // fontStyle: "normal",
    textAlign: "center",
    color: "#434656",
  },
  unnepnapBox: {
    maxWidth: Dimensions.get('window').width < 350 ? 80 : 120,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#FF7070',
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: '#CFD0DF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unnepBoxTitle: {
    fontFamily: "Montserrat-Bold",
    fontSize: 10,
    // fontWeight: "bold",
    // fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: '#FFF',
  },
  unnepTitle: {
    fontFamily: "Montserrat-Bold",
    fontSize: 10,
    // fontWeight: "bold",
    // fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: "#434656",
  },
  unnepTitleView: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 5,
  },
  // upNextTitle:{
  //   color: "#b7a99b",
  //   fontSize: 15,
  //   opacity: 0.7,
  //   fontFamily: "Montserrat-Regular",
  // },
  date: {
    fontFamily: "Montserrat-Bold",
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
    marginBottom: 20,
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
    fontFamily: 'Montserrat-Light',
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
    bottom: Platform.OS === 'android' ? 0 : -20,
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
    fontFamily: "Montserrat-SemiBold",
    // fontWeight: '600',
    fontSize: 12,
    textAlign: 'center',
  },
  newsCardDesc: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 15,
    fontFamily: "Montserrat-Bold",
    color: '#000',
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
    fontFamily: "Montserrat-Bold",
    // fontWeight: "bold",
    color: '#000',
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
    fontFamily: "Montserrat-Regular",
    fontWeight: '900',
    fontSize: 16,
    color: '#8e6034',
    fontStyle: 'italic',
  },
  eventMonth:{
    fontFamily: "Montserrat-SemiBold",
    fontSize: 14,
    // fontWeight: '600',
    color: '#434656',
  },
  eventYear: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 10,
    // fontWeight: '600',
    color: '#a3abbc',
  },
  eventTime: {
    fontFamily: "Montserrat-Bold",
    fontSize: 15,
    // fontWeight: '900',
    color: '#434656',
  },
  eventTimeText: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 10,
    fontWeight: '600',
    color: '#a3abbc',
  },
  moreBtn: {
    fontFamily: "Montserrat-Bold",
    // fontWeight: 'bold',
    color: '#b7a99b',
    fontSize: 15,
    padding: 10
  }
});
