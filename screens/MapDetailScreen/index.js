import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  Linking,
  TextInput,
  SafeAreaView,
  Platform,
} from 'react-native';
import _ from 'lodash';
import PageHeader from '../../components/PageHeader';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { web, phonecall } from 'react-native-communications';
import textContentJSON from './mapDetailTrans.json';

import PopupDialog, { ScaleAnimation } from 'react-native-popup-dialog';
const ScaleAnim = new ScaleAnimation();

const SLIDER_1_FIRST_ITEM = 1;

// const thumbnail_1 = require('../../assets/images/zsinagoga.jpg');
// const thumbnail_2 = require('../../assets/images/rumbach.jpg');
// const thumbnail_3 = require('../../assets/images/kazinczy.jpg');

const ENTRIES1 = [
  {
    illustration: null
  },
  {
    illustration: null
  },
  {
    illustration: null
  },
];

const IS_IOS = Platform.OS === 'ios';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp (percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}

const colors = {
  black: '#1a1917',
  gray: '#888888',
  background1: '#B721FF',
  background2: '#21D4FD'
};

const itemHorizontalMargin = wp(2);
const slideWidth = wp(75);
const slideHeight = 175;
const sliderWidth = viewportWidth;
const itemWidth = slideWidth + itemHorizontalMargin * 2;
const entryBorderRadius = 8;

export default class MapDetailScreen extends Component {

  constructor (props) {
    super(props);
    this.state = {
      slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
      openingHoursModalVisible: false,
    };
  }

  _renderItem ({ item }) {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.slideInnerContainer}
        >
          <View style={styles.shadow} />
          <View style={styles.imageContainer}>
            <Image
              source={item.illustration}
              resizeMode={'cover'}
              style={{width: 310, height: 175}}
            />
          </View>
      </TouchableOpacity>
    );
  }

  handleWebLink(weblink) {

    Linking.canOpenURL(weblink).then(supported => {
      if (supported) {
        Linking.openURL(weblink);
      }
    });
  }

  handleAddressLink(coordinate) {
    const url = `https://maps.google.com/?q=${coordinate.latitude},${coordinate.longitude}`;
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      }
    });
  }

  handlePhoneCall(phoneNumber) {
    const trimmedPhoneNumber = phoneNumber.split(' ').join('');
    phonecall(trimmedPhoneNumber, false);
  }

  showOpeningHoursDialog() {
    this.openingHoursDialog.show();
  }

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

  componentDidMount() {
     const _scrollView = this.scrollView;
     setTimeout(() => {
        this.scrollView.scrollTo({y: 2});
     }, 1);
  }

  getOpeningHours(openingHours, textContent) {
    const { open, close, closed } = openingHours;
    const now = new Date();
    const format = 'hh:mm';
    
    if (closed) {
      return <Text style={styles.infoText}><Text style={styles.closedState}>{textContent.zarva}</Text></Text>;
    }

    let time = moment(now, format);
    let openingTime = moment(open, format);
    let closingingTime = moment(close, format);
    let resultText;

    if(time.isBetween(openingTime, closingingTime)){
      resultText = <Text style={styles.infoText}>{`${open} - ${close} | `}<Text style={styles.openState}>{textContent.nyitva}</Text></Text>;
    } else {
      resultText = <Text style={styles.infoText}>{`${open} - ${close} | `}<Text style={styles.closedState}>{textContent.zarva}</Text></Text>
    }

    return resultText;
  }

  render() {
    const { navigation } = this.props;
    const mapItem = navigation.getParam('mapItem');
    // const openingHoursParam = navigation.getParam('openingHoursParam');
    // const { slider1ActiveSlide } = this.state;
    // const { data: { title, subtitle }, even } = this.props;
    let webPageBtn = null;
    let facebookLinkBtn = null;
    let ticketLinkBtn = null;

    let minEntryFee = null;
    let maxEntryFee = null;

    let prices = null;
    let phoneNumber = null;
    let openingHours = null;
    let address = null;
    let description = null;
    let textContent =  textContentJSON.hu;
    let modalBtn = null;
    let popupDialogWrap = null;
    let openingHoursWrap = null;
    let phoneNumberWrap = null;
    let entryFeeWrap = null;

    const sunday = _.head(mapItem.openingHours);
    const rest = _.slice(mapItem.openingHours, 1);
    const weekDays = _.concat(rest, sunday);

    // console.log('MapItem', mapItem);
    // console.log('openingHoursParam', openingHoursParam);

    moment.locale('hu');

    if(this.props.screenProps.settingsEng) {
      textContent = textContentJSON.en;
      moment.locale('en');
    }

    // === ASSIGN IMAGES === //

    if (mapItem.thumbnail_1) {
      ENTRIES1[0].illustration = mapItem.thumbnail_1;
    }

    if (mapItem.thumbnail_2) {
      ENTRIES1[1].illustration = mapItem.thumbnail_2;
    }

    if (mapItem.thumbnail_3) {
      ENTRIES1[2].illustration = mapItem.thumbnail_3;
    }

    if(mapItem.facebookPageLink) {
      facebookLinkBtn = (
        <TouchableOpacity
          style={styles.linkBtn}
          activeOpacity={0.8}
          onPress={() => this.openFacebookLink(mapItem.facebookPageLink)}
        >
          <Text style={styles.linkBtnText}>{textContent.facebookBtn}</Text>
        </TouchableOpacity>
      );
    }

    if(mapItem.webPageLink) {
      webPageBtn = (
        <TouchableOpacity
          style={styles.secondIcon}
          activeOpacity={0.8}
          onPress={() => this.handleWebLink(mapItem.webPageLink)}
        >
          <Icon name="language" size={20} color="#fff"/>
        </TouchableOpacity>
      );
    }

    if(mapItem.ticketLink) {
      ticketLinkBtn = (
        <TouchableOpacity
          style={styles.linkBtn}
          activeOpacity={0.8}
          onPress={() => this.handleWebLink(mapItem.ticketLink)}
        >
          <Text style={styles.linkBtnText}>{textContent.ticketBtn}</Text>
        </TouchableOpacity>
      );
    }

    if (mapItem.minEntryFee) {
      minEntryFee = `${mapItem.minEntryFee} ${mapItem.currency}`;
    }

    if (mapItem.maxEntryFee) {
      maxEntryFee = `- ${mapItem.maxEntryFee} ${mapItem.currency}`;
    }

    if (mapItem.minEntryFee || mapItem.maxEntryFee) {
      prices = (
        <View style={styles.infoWrap}>
          <Icon name="attach-money" size={25} color="#73beff" />
          <Text style={[styles.infoText, {marginRight: 'auto'}]}>{textContent.belepo}{minEntryFee}{maxEntryFee}</Text>
        </View>
      );

      entryFeeWrap = (
        <View style={styles.mapInfosListContainer}>
          <View style={styles.infoRow}>
            { prices }
          </View>
        </View>
      );
    }

    if (mapItem.phone) {
      phoneNumber = (
        <View style={styles.infoWrap}>
          <Icon name="call" size={25} color="#73beff"/>
          <Text style={styles.infoText}>{mapItem.phone}</Text>
          <TouchableOpacity
            style={styles.secondIcon}
            activeOpacity={0.8}
            onPress={() => this.handlePhoneCall(mapItem.phone)}
          >
            <Icon name="call" size={20} color="#fff"/>
          </TouchableOpacity>
        </View>
      )

      phoneNumberWrap = <View style={styles.mapInfosListContainer1}>
        <View style={styles.infoRow}>
          { phoneNumber }
        </View>
      </View>
    }

    if (mapItem.openingHours) {
      const currentDayIndex = moment().day();
  
      openingHours  = (
        <View style={styles.infoWrap}>
          <Icon name="schedule" size={25} color="#73beff" />
          {this.getOpeningHours(mapItem.openingHours[currentDayIndex], textContent)}
        </View>
      )

      modalBtn = (
        <View style={styles.infoWrap}>
          <TouchableOpacity style={styles.modalBtn} onPress={() => this.showOpeningHoursDialog()}>
            <Text style={styles.modalBtnText}>{textContent.nyitvatartas}</Text>
            <Icon name="keyboard-arrow-right" size={15} color="#434656"/>
          </TouchableOpacity>
        </View>
      )

      openingHoursWrap = (
        <View style={styles.mapInfosListContainer}>
          <View style={styles.infoRow}>
            { openingHours }
            { modalBtn }
          </View>
        </View>
      )

      popupDialogWrap = (
        <PopupDialog
          width={0.8}
          height={265}
          dialogAnimation={ScaleAnim}
          ref={(popupDialog) => { this.openingHoursDialog = popupDialog; }}
          hasOverlay={true}
          overlayOpacity={0.1}
          dialogStyle={{borderWidth: 1, borderColor: '#ededed'}}
        >
          <View style={styles.dialogView}>

            {weekDays.map((openingHour) => (
              <View style={styles.dayRow} key={openingHour.day}>
                <Text style={styles.dayText}>{openingHour.day}</Text>
                <Text style={openingHour.closed ? styles.closedText : styles.hourText}>{openingHour.closed ? openingHour.open : `${openingHour.open}-${openingHour.close}` }</Text>
              </View>
            ))}

            <TouchableOpacity onPress={() => this.openingHoursDialog.dismiss()}>
              <Text style={styles.dismissBtn}>{textContent.bezaras}</Text>
            </TouchableOpacity>
          </View>
        </PopupDialog>
      );
    }

    if (mapItem.address) {
      address = (
        <View style={styles.infoWrap}>
          <Icon name="near-me" size={25} color="#73beff"/>
          <Text
            style={styles.infoText}
          >
            {mapItem.address}
          </Text>
          <TouchableOpacity
            style={styles.secondIcon}
            activeOpacity={0.8}
            onPress={() => this.handleAddressLink(mapItem.coordinate)}
          >
            <Icon name="directions" size={20} color="#fff"/>
          </TouchableOpacity>
        </View>
      )
    }

    if (mapItem.description) {
      description = (
        <View style={styles.descriptionWrap}>
          <Icon name="format-quote" size={25} color="#73beff"/>
          <Text style={styles.descriptionText}>{mapItem.description}</Text>
        </View>
      )
    }


    return (
      <SafeAreaView style={styles.container}>
        <PageHeader
          {...this.props}
          pageTitle={textContent.screenTitle}
          isBack
        />

        <ScrollView style={styles.content} ref={scrollView => this.scrollView = scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.titleBar}>
            <View style={styles.flexLeft}>
              <Text style={styles.titleTypeText}>{textContent.nevezetesseg}</Text>
              <Text style={styles.titleText}>{mapItem.title}</Text>
            </View>
            <View style={styles.flexRight}>
              { webPageBtn }
            </View>
          </View>

          <View style={styles.sliderContainer}>
            <Carousel
              ref={(c) => { this._carousel = c; }}
              data={ENTRIES1}
              renderItem={this._renderItem}
              sliderWidth={sliderWidth}
              itemWidth={itemWidth}
              loop={true}
              onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index }) }
              containerCustomStyle={styles.slider}
              contentContainerCustomStyle={styles.sliderContentContainer}
              firstItem={1}
            />
          </View>

          <View style={styles.linkBtnRow}>
            { facebookLinkBtn }
            { ticketLinkBtn }
          </View>

           { entryFeeWrap }

          { phoneNumberWrap }

          { openingHoursWrap }
          
          <View style={styles.mapInfosListContainer1}>
            <View style={styles.infoRow}>
              { address }
            </View>
          </View>

          <View style={styles.descriptionRow}>
            { description }
          </View>

        </ScrollView>

        { popupDialogWrap }

      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 0 : 20,
  },

  titleBar: {
    marginTop: 15,
    paddingHorizontal: 15,
    flexDirection: 'row',
  },
  titleTypeText: {
    color: '#797e9c',
    fontFamily: 'YoungSerif-Regular',
    fontSize: 12,
    marginBottom: 5,
  },
  titleText: {
    color: '#434656',
    fontFamily: 'Montserrat',
    fontSize: 24,
    fontWeight: "600",
  },

  flexLeft: {
    width: '70%',
  },
  flexRight: {
    width: '30%',
    alignItems: 'flex-end',
    justifyContent: 'center',
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
    marginLeft: 'auto',
  },
  sliderContainer: {
    marginTop: 30,
    marginBottom: 20,
  },
  slideInnerContainer: {
    width: itemWidth,
    height: slideHeight,
    paddingHorizontal: itemHorizontalMargin,
    paddingBottom: 0, // needed for shadow
    // borderWidth: 3,
    // borderColor: '#f00'
  },
  shadow: {
    position: 'absolute',
    top: 0,
    left: itemHorizontalMargin,
    right: itemHorizontalMargin,
    bottom: 18,
    shadowColor: colors.black,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    borderRadius: entryBorderRadius
  },
  imageContainer: {
    flex: 1,
    marginBottom: IS_IOS ? 0 : -1, // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderRadius: entryBorderRadius,
    overflow: 'hidden',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'contain',
    borderRadius: IS_IOS ? entryBorderRadius : 0,
  },
  slider: {
    // marginTop: -25,
    overflow: 'hidden',
    // borderWidth: 2,
    // borderColor: '#f00'
  },
  sliderContentContainer: {
    paddingVertical: 0 // for custom animation
  },

  linkBtnRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  linkBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 15,
    marginBottom: 5,
    borderColor: 'rgba(237, 237, 237, 1)',
    shadowColor: '#b7a99b',
    shadowOffset: {
            width: 0,
            height: 15
          },
    shadowRadius: 15,
    shadowOpacity: 0.5,
  },
  linkBtnText: {
    fontFamily: "Montserrat",
    fontSize: 14,
    fontWeight: "600",
    fontStyle: "normal",
    color: '#c49565'
  },
  mapInfosListContainer: {
    width:'100%',
    backgroundColor: '#FFF',
    borderTopColor: '#F2F2F2',
    borderBottomColor: '#F2F2F2',
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderWidth: 1,
    height: 55
  },
  mapInfosListContainer1: {
    width:'100%',
    backgroundColor: '#FCFCFC',
    borderTopColor: '#F2F2F2',
    borderBottomColor: '#F2F2F2',
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderWidth: 1,
    height: 55
  },
  infoRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginHorizontal: 15,
  },
  infoWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  inforWrapLeft: {
    marginRight: 25,
    backgroundColor: 'red'
  },
  inforWrapRight: {
    flex: 0.6,
  },
  infoText: {
    fontFamily: "Montserrat",
    fontSize: 12,
    fontWeight: "600",
    fontStyle: "normal",
    marginHorizontal: 15,
    width: '75%',
  },
  modalBtn: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ededed',
    paddingHorizontal: 9,
    paddingVertical: 5,
    marginLeft: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  modalBtnText: {
    fontFamily: "Montserrat",
    fontSize: 12,
    fontWeight: "600",
    fontStyle: "normal",
    color: '#434656',
  },
  descriptionRow: {
    marginTop: 10,
    marginBottom: 30,
    marginHorizontal: 15,
  },
  descriptionWrap: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 15,
  },
  descriptionText: {
    fontFamily: "Montserrat",
    fontSize: 14,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 18,
    paddingHorizontal: 15,
    marginRight: 15,
  },
  dialogView: {
    padding: 15,
    flex: 1,
  },
  dayRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dismissBtn: {
    fontFamily: "Montserrat",
    fontWeight: '600',
    fontSize: 16,
    color: '#73beff',
    textAlign: 'center',
    marginTop: 10,
  },
  dayText: {
    fontFamily: "Montserrat",
    fontSize: 16,
    fontWeight: "600",
    color: '#434656',
  },
  hourText: {
    fontFamily: "Montserrat",
    fontSize: 16,
    fontWeight: "normal",
  },
  closedText: {
    fontFamily: "Montserrat",
    fontSize: 16,
    fontWeight: "600",
    color: '#f2426a',
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
