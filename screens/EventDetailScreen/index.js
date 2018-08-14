import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  SafeAreaView
} from 'react-native';
import PageHeader from '../../components/PageHeader';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
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

  render() {
    //console.log('EventDetailScreen this.props', this.props);
    const { navigation } = this.props;
    const eventParam = navigation.getParam('event');
    //console.log('EventDetailScreen event', eventParam);

    let eventDetails;

    if(eventParam.description) {
      eventDetails = (
        <View>
          <Text style={styles.detailsTitle}>RÉSZLETEK</Text>
          <Text style={styles.detailsText}>{eventParam.description}</Text>
        </View>
      );
    }

    return (
      <SafeAreaView style={styles.container}>
        <PageHeader
          pageTitle="Események"
          isBack
          {...this.props}
        />
        <ScrollView showsVerticalScrollIndicator={false}>

          <View style={{ marginBottom: 25, padding: 15, }}>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginBottom: 25, }}>
              <View style={{width: '50%',}}>
                <Text style={styles.eventDateText}>{moment(eventParam.date).format('YYYY.MM.DD')}</Text>
                <Text style={styles.eventDescText}>{eventParam.name}</Text>
              </View>
              <View style={{width: '50%', }}>
                <Image source={{ uri: eventParam.media[0].src_thumbs}} style={{borderRadius: 3, width: 158, height: 90, marginLeft: 'auto'}}/>
              </View>
            </View>

            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, }}>
              <Icon name="schedule" style={styles.firstIcon} color="#73beff" size={20} />
              <Text style={[styles.eventTimeText, { width: 210}]}>{moment(eventParam.date).format('YYYY. MMMM DD')} <Text style={styles.timeDivider}>|</Text> {moment(eventParam.startTime).format('HH:mm')} - {moment(eventParam.endTime).format('HH:mm')}</Text>
              <TouchableOpacity
                style={styles.secondIcon}
                activeOpacity={0.8}
              >
                <Icon name="today" size={20} color="#fff"/>
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 25, }}>>
              <Icon name="near-me" style={styles.firstIcon} color="#73beff" size={20} />
              <View style={{ width: 210, marginRight: 'auto'}}>
                <Text style={styles.eventLocationText}>{eventParam.location.title}</Text>
                <Text style={styles.eventAddressText}>{eventParam.location.name}</Text>
              </View>
              <TouchableOpacity
                style={styles.secondIcon}
                activeOpacity={0.8}
              >
                <Icon name="directions" size={20} color="#fff"/>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.facebookBtn} activeOpacity={0.8} onPress={() => this.openFacebookLink(eventParam.facebook_event_url)}>
              <FontAwesome name="facebook-square" size={25} color="#c49565"/>
              <Text style={styles.facebookBtnText}>Facebook esemény</Text>
            </TouchableOpacity>

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
    paddingTop: 20,
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
