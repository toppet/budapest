import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  SafeAreaView,
  Platform,
} from 'react-native';
import PageHeader from '../../components/PageHeader';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import textContentJSON from '../EventsScreen/eventsTrans.json';

import * as AddCalendarEvent from 'react-native-add-calendar-event';
import Markdown from 'react-native-markdown-renderer';

export default class EventDetailScreen extends Component {
  static navigationOptions = {
    title: 'Event Detail',
    headerTitle: 'Event Detail',
  };

  openFacebookLink (url) {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      }
      // } else {
      //   console.log("Don't know how to open URI: " + this.props.url);
      // }
    });
  }

  addToCalendar(item) {
    // console.log('item', item);
    const eventConfig = {
      title: item.name,
      // startDate: moment(item.from).format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
      startDate: moment(item.from).subtract(2, 'hours').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
      allDay: false,
    };

    if (item.till) {
      eventConfig.endDate = moment(item.till).subtract(2, 'hours').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    }

    if(moment(item.from).format('HH:mm') === '00:00') {
      eventConfig.allDay = true;
    }

    if (item.location) {
      eventConfig.location = `${item.location.title} - ${item.location.name}`;
    }
    

    AddCalendarEvent.presentEventCreatingDialog(eventConfig)
      .then((eventInfo) => {
        // handle success - receives an object with `calendarItemIdentifier` and `eventIdentifier` keys, both of type string.
        // These are two different identifiers on iOS.
        // On Android, where they are both equal and represent the event id, also strings.
        // when { action: 'CANCELLED' } is returned, the dialog was dismissed
        // console.warn(JSON.stringify(eventInfo));
      })
      .catch((error) => {
        // handle error such as when user rejected permissions
        // console.warn(error);
      });
  }

  render() {
    //console.log('EventDetailScreen this.props', this.props);
    const { navigation } = this.props;
    const eventParam = navigation.getParam('event');

    let eventDetails;
    let eventDirectionBtn;
    let facebookEventBtn;

    let textContent =  textContentJSON.hu;
    moment.locale('hu');

    if(this.props.screenProps.settingsEng) {
      textContent = textContentJSON.en;
      moment.locale('en');
    }

    if(eventParam.location && eventParam.location.longitude && eventParam.location.latitude) {
      eventDirectionBtn = (
        <TouchableOpacity
          style={styles.secondIcon}
          activeOpacity={0.8}
          onPress={() => {
            const url = `https://maps.google.com/?q=${eventParam.location.latitude},${eventParam.location.longitude}`;
            Linking.canOpenURL(url).then(supported => {
              if (supported) {
                Linking.openURL(url);
              }
            });
          }}
        >
          <Icon name="directions" size={20} color="#fff"/>
        </TouchableOpacity>
      );
    }

    if(eventParam.description) {
      eventDetails = (
        <View>
          <Text style={styles.detailsTitle}>{textContent.details}</Text>
          {/* <Text style={styles.detailsText}>{eventParam.description}</Text> */}
          <Markdown style={{
            text: {
              fontFamily: 'Montserrat-Regular',
              fontSize: 14,
            }
          }}>{eventParam.description}</Markdown>
        </View>
      );
    }

    if(eventParam.facebook_event_url) {
      facebookEventBtn = (
        <TouchableOpacity style={styles.facebookBtn} activeOpacity={0.8} onPress={() => this.openFacebookLink(eventParam.facebook_event_url)}>
          <FontAwesome name="facebook-square" size={25} color="#c49565"/>
          <Text style={styles.facebookBtnText}>{textContent.facebookBtn}</Text>
        </TouchableOpacity>
      );
    }



    return (
      <SafeAreaView style={styles.container}>
        <PageHeader
          pageTitle={textContent.screenTitle}
          isBack
          {...this.props}
        />
         <ScrollView showsVerticalScrollIndicator={false}>

          <View style={{ marginBottom: 25, padding: 15, }}>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginBottom: 25, }}>
              <View style={{width: '50%',}}>
                <Text style={styles.eventDateText}>{moment(eventParam.from).format('YYYY.MM.DD')}</Text>
                <Text style={styles.eventDescText}>{eventParam.name}</Text>
              </View>
              <View style={{width: '50%', }}>
                <Image source={{ uri: eventParam.media[0].src_thumbs}} style={{borderRadius: 3, width: 158, height: 90, marginLeft: 'auto'}} />
              </View>
            </View>

            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, }}>
              <Icon name="schedule" style={styles.firstIcon} color="#73beff" size={20} />
              <Text style={[styles.eventTimeText, { width: 210}]}>{moment(eventParam.from).format('YYYY. MMMM DD')} <Text style={styles.timeDivider}>|</Text> {moment(eventParam.from).format('HH:mm')} - {moment(eventParam.till).format('HH:mm')}</Text>
              <TouchableOpacity
                style={styles.secondIcon}
                activeOpacity={0.8}
                onPress={() => this.addToCalendar(eventParam)}
              >
                <Icon name="today" size={20} color="#fff"/>
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 25, }}>
              <Icon name="near-me" style={styles.firstIcon} color="#73beff" size={20} />
              <View style={{ width: 210, marginRight: 'auto'}}>
                <Text style={styles.eventLocationText}>{eventParam.location.title}</Text>
                <Text style={styles.eventAddressText}>{eventParam.location.name}</Text>
              </View>
              { eventDirectionBtn }
            </View>

            { facebookEventBtn }

            { eventDetails }
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 0 : 20,
    // marginBottom: 25,
  },
  eventDateText: {
    fontFamily: 'Montserrat',
    fontSize: 12,
    color: '#b7a99b',
    marginBottom: 5,
  },
  eventDescText: {
    fontFamily: 'Montserrat',
    fontWeight: '600',
    fontSize: 16,
    color: '#333',
    paddingRight: 5,
  },
  firstIcon: {
    marginRight: 10,
  },
  secondIcon: {
    borderWidth: 2,
    borderColor: '#73beff',
    backgroundColor: '#73beff80',
    padding: 5,
    borderRadius: 19,
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 35,

  },
  eventTimeText: {
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
    fontSize: 12,
    color: '#434656',
    marginRight: 'auto'
  },
  timeDivider: {
    color: '#b7a99b',
    fontSize: 12,
  },
  eventLocationText: {
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
    fontSize: 12,
    color: '#434656',
    marginRight: 'auto'
  },
  eventAddressText: {
    fontFamily: 'Montserrat',
    fontSize: 12,
    color: '#434656',
    marginRight: 'auto'
  },
  detailsTitle: {
    fontFamily: "YoungSerif-Regular",
    fontSize: 16,
    color: '#797e9c',
    marginBottom: 15,
  },
  detailsText: {
    fontFamily: "Montserrat",
    fontSize: 14,
    color: '#434656',
    lineHeight: 18,
    marginBottom: 25,
  },

  facebookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 280,
    height: 45,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: '#fff',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom:35,
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
  facebookBtnText: {
    color: '#c49565',
    fontFamily: "Montserrat",
    fontWeight: '600',
    marginLeft: 15,
    fontSize: 16,
    textAlign: 'center',
  },
});
