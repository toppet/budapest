import React, { Component } from 'react';
import _ from 'lodash';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
  Platform,
} from 'react-native';
import YouTube from 'react-native-youtube';
import PageHeader from '../../components/PageHeader';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Markdown from 'react-native-markdown-renderer';

import textContentJSON from '../NewsScreen/newsTrans.json';

export default class NewsDetailScreen extends Component {
  static navigationOptions = {
    title: 'News Detail',
    headerTitle: 'News Detail',
  };

  getYtId(url) {
    const splitted = url.split("=");
    return splitted.length > 1 ? splitted[1] : url.split("/").slice(-1)[0];
  };

  render() {
    const { navigation } = this.props;
    const newsItem = navigation.getParam('newsItem');
    // console.log('newItem', newsItem);

    let textContent =  textContentJSON.hu;
    moment.locale('hu');

    if(this.props.screenProps.settingsEng) {
      textContent = textContentJSON.en;
      tagFilterPlaceholder = textContent.tagBtn;
      moment.locale('en');

    }

    const headerImage = _.find(newsItem.media, n => n.type === 1);
    const youtubeMedia = _.find(newsItem.media, n => n.type === 2) || null;

    let youTubeWrapper = null;

    if(youtubeMedia) {
      const youtubeId = this.getYtId(youtubeMedia.src_media);
      youTubeWrapper = (
        <YouTube
          apiKey="AIzaSyARm4hM8Lpcuv4pteH92UYdp1Lq_Pyhin0"
          videoId={youtubeId}   // The YouTube video ID
          play={false}             // control playback of video with true/false
          fullscreen={true}       // control whether the video should play in fullscreen or inline
          loop={false}             // control whether the video should loop when ended

          onReady={e => this.setState({ isReady: true })}
          onChangeState={e => this.setState({ status: e.state })}
          onChangeQuality={e => this.setState({ quality: e.quality })}
          onError={e => this.setState({ error: e.error })}

          style={{ alignSelf: 'stretch', height: 200, marginBottom: 50 }}
        />
      );
    }
    return (
      <SafeAreaView style={styles.container}>
        <PageHeader
          {...this.props}
          pageTitle={textContent.screenTitle}
          isBack
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <Image source={{uri: headerImage.src_thumbs}} style={{width: '100%', height: 165}}/>

          <View style={styles.dateRow}>
            <Text style={styles.date}>{moment(newsItem.posted_at).format('YYYY.MM.DD')}</Text>
            <View style={styles.tagWrap}>
              <Icon name="label" size={13} style={styles.tagIcon}/>
              <Text style={styles.tagText}>{newsItem.tags[0].name}</Text>
            </View>
          </View>

          <View style={styles.newsContent}>
            <Text style={styles.newsTitle}>{newsItem.title}</Text>
            {/* <Text style={styles.newsBody}>{newsItem.body}</Text> */}
            <Markdown style={{
              heading3: {
                fontFamily: 'Montserrat',
                fontSize: 14,
                fontWeight: 'bold',
              },
              text: {
                fontFamily: 'Montserrat',
                fontSize: 14,
              }
            }}
            >{newsItem.body}</Markdown>
          </View>

          <View>
            { youTubeWrapper }
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
  },
  dateRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: 15,
    marginTop: 15,
    marginBottom: 15,
  },
  date: {
    color: "#b7a99b",
    fontFamily: "Montserrat",
    fontSize: 12,
    marginRight: 25,
  },
  tagWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagIcon:{
    marginRight: 5,
    color: "#434656"
  },
  tagText: {
    color: "#b7a99b",
    fontFamily: "Montserrat",
    fontSize: 12,
  },
  newsContent: {
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 25,
  },
  newsTitle: {
    fontFamily: "Montserrat",
    fontWeight: '600',
    fontSize: 18,
    color: "#333",
    marginBottom: 25,
  },
  newsBody: {
    fontFamily: "Montserrat",
    fontSize: 14,
    color: "#434656",
    lineHeight: 18,
    marginBottom: 25,
  },
});
