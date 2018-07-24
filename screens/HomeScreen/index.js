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
    desc: 'Új applikáció készül a zsidó közösség számára',
    date: new Date(),
  },
  {
    id: 1,
    imageSrc: require('../../assets/images/app.jpg'),
    desc: 'A fejlesztok azt igerik, hogy jo lesz.',
    date: new Date(),
  },
  {
    id: 3,
    imageSrc: require('../../assets/images/wellsee.jpg'),
    desc: 'Meglátjuk...',
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

export default class HomeScreen extends Component {
  constructor(props){
    super(props);  
    this.state = {
      menuOpened: false,  // Initial value for opacity: 0
    }
  }
  // shouldComponentUpdate(nextProps, nextState) {
  //   return _.difference(this.state, nextState).length > 0 ? true : false;
  // }

  
  render() {
    const newsCardWidth = parseInt(Dimensions.get('window').width*0.6, 10);
    const eventCardWidth = parseInt(Dimensions.get('window').width*0.7, 10);
    // console.log('this.props', this.props);
    const newsCards = latestNews.map((n) => (
      <View style={[styles.cardShadow, {width: newsCardWidth}]} key={n.id}>
        <View style={styles.newsCard}>
          
          <View style={styles.imageBgBox}>
            <ImageBackground source={n.imageSrc} style={{width: '100%', height: '100%'}}/>
          </View>

          <Text style={styles.newsCardDesc}>{n.desc}</Text>

          <View style={styles.newsCardInfoView}>
            
            <Text style={styles.newsDate}>{moment(n.date).format('YYYY.MM.DD')}</Text>
            
            {/* <TouchableOpacity onPress={() => console.log('ikonka')} style={{ marginLeft: 'auto' }}>
              <Icon name="bookmark-border" size={25} color="#73beff" />
            </TouchableOpacity> */}

            <TouchableOpacity onPress={() => console.log('ikonka')} style={{marginLeft: 10}}>
              <CustomIcon name="ic_share" size={20} color='#73beff'/>
            </TouchableOpacity>
          </View>
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


    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      
        <View style={{flex: 1, alignItems: 'stretch', justifyContent: 'flex-start', paddingTop: 20,}}>
          
          <PageHeader {...this.props} noRightIcon/>

          <View style={{flex: 1, padding: 15,}}>
            <ScrollView showsVerticalScrollIndicator={false}>

              <View style={{marginBottom: 38}}>
                <Text style={styles.title}>Üdvözöljük!</Text>
                <Text style={styles.date}>{moment().format('MMMM DD., dddd').replace(/^\w/, c => c.toUpperCase())}</Text>
              </View>
              
              <View>
                <View style={{ marginBottom: 15, flexDirection: 'row', alignItems: 'center', justifyContent:'space-between' }}>
                  <Text style={{fontSize: 20, fontFamily: 'YoungSerif-Regular'}}>Legfrissebb hírek</Text>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('News')}
                  >
                    <Text style={{fontFamily: "Montserrat", fontWeight: 'bold', color: '#b7a99b', fontSize: 15}}>Mind</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{paddingBottom: 10}}>
                  {newsCards}
                </ScrollView>
              </View>

              <View>
                <View style={{ marginBottom: 15, flexDirection: 'row', alignItems: 'center', justifyContent:'space-between' }}>
                  <Text style={{fontSize: 20, fontFamily: 'YoungSerif-Regular'}}>Közelgő események</Text>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Events')}
                  >
                    <Text style={{fontFamily: "Montserrat", fontWeight: 'bold', color: '#b7a99b', fontSize: 15}}>Mind</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{paddingBottom: 10}}>
                  {eventCards}
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
    fontSize: 35,
    fontFamily: "YoungSerif-Regular",
  },
  date: {
    fontFamily: "Montserrat-Black",
    fontSize: 14,
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
    marginBottom: 10,
  },
  newsCardDesc: {
    flex: 1,
    paddingLeft: 10, 
    paddingRight: 10, 
    marginBottom: 10, 
    fontFamily: "Montserrat", 
    fontWeight: "bold", 
    fontSize: 12
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

