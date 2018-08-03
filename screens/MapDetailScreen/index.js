import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  Platform,
  TouchableOpacity,
} from 'react-native';
import PageHeader from '../../components/PageHeader';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Carousel, { Pagination } from 'react-native-snap-carousel';

const SLIDER_1_FIRST_ITEM = 1;
const ENTRIES1 = [
  {
      title: 'Beautiful and dramatic Antelope Canyon',
      subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
      illustration: 'https://scontent-lht6-1.xx.fbcdn.net/v/t1.0-9/38127547_651023835270205_5910063183288074240_n.jpg?_nc_cat=0&oh=ed5c9b5bbbd7913574123b63bdd8c028&oe=5C0B6B83'
  },
  {
      title: 'Earlier this morning, NYC',
      subtitle: 'Lorem ipsum dolor sit amet',
      illustration: 'https://jewps.hu/images/1533116495.jpg'
  },
  {
      title: 'White Pocket Sunset',
      subtitle: 'Lorem ipsum dolor sit amet et nuncat ',
      illustration: 'https://librarius.hu/wp-content/uploads/2016/05/haumann-peter.jpg'
  },
  {
      title: 'White Pocket Sunset',
      subtitle: 'Lorem ipsum dolor sit amet et nuncat ',
      illustration: 'https://goo.gl/2W4iW6'
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
const slideHeight = viewportHeight * 0.36;
const sliderWidth = viewportWidth;
const itemWidth = slideWidth + itemHorizontalMargin * 2;
const entryBorderRadius = 8;

export default class MapDetailScreen extends Component {
 
  constructor (props) {
    super(props);
    this.state = {
      slider1ActiveSlide: SLIDER_1_FIRST_ITEM
    };
  }

  _renderItem ({item, index}) {
    const even = (index + 1) % 2 === 0;

    console.log('item.illustration', item.illustration);
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.slideInnerContainer}
        >
          <View style={styles.shadow} />
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item.illustration }}
              resizeMode={'cover'}
              style={{width: 310, height: 175}}
              onLoad={() => console.log('loaded')}
            />
          </View>
      </TouchableOpacity>
    );
  }

  render() {
    const { navigation } = this.props;
    const mapItem = navigation.getParam('mapItem');
    const { slider1ActiveSlide } = this.state;
    console.log('mapItem', mapItem);
    // const { data: { title, subtitle }, even } = this.props;

    return (
      <View style={styles.container}>
        <PageHeader 
          {...this.props}
          pageTitle="Térkép"
          isBack
        />

        <ScrollView style={styles.content}>
          <View style={styles.titleBar}>
            <View style={styles.flexLeft}>
              <Text style={styles.titleTypeText}>NEVEZETESSÉG</Text>
              <Text style={styles.titleText}>{mapItem.title}</Text>
            </View>
            <View style={styles.flexRight}>
              <TouchableOpacity
                style={styles.secondIcon}
                activeOpacity={0.8}
              >
                <Icon name="language" size={20} color="#fff"/>
              </TouchableOpacity>
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
            <Pagination
              dotsLength={ENTRIES1.length}
              activeDotIndex={slider1ActiveSlide}
              dotStyle={{
                width: 8,
                height: 8,
                borderRadius: 5,
                marginHorizontal: 0,
                backgroundColor: '#c49565'
              }}
              inactiveDotStyle={{
                backgroundColor: '#a3abbc',
              }}
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.8}
              carouselRef={this._carousel}
              tappableDots={!!this._carousel}
            />
          </View>
        </ScrollView>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
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
    width: '60%',
  },
  flexRight: {
    width: '40%',
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
    marginLeft: 35,
  },


  sliderContainer: {
    marginTop: 30,
  },
  slideInnerContainer: {
    width: itemWidth,
    height: slideHeight,
    paddingHorizontal: itemHorizontalMargin,
    paddingBottom: 0 // needed for shadow
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
    marginTop: -15,
    overflow: 'hidden',
    // borderWidth: 2,
    // borderColor: '#f00'
  },
  sliderContentContainer: {
    paddingVertical: 0 // for custom animation
  },
});
