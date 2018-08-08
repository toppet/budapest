import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import PageHeader from '../../components/PageHeader';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class NewsDetailScreen extends Component {
  static navigationOptions = {
    title: 'News Detail',
    headerTitle: 'News Detail',
  };

  render() {
    const { navigation } = this.props;
    const newsItem = navigation.getParam('newsItem', 'NO-ID');
    console.log('newItem', newsItem);

    return (
      <View style={styles.container}>
        <PageHeader
          {...this.props}
          pageTitle="Hírek"
          isBack
        />
        <ScrollView>
          <Image source={{uri: newsItem.media[0].src_media}} style={{width: '100%', height: 165}}/>
          <View style={styles.dateRow}>
            <Text style={styles.date}>{moment(newsItem.posted_at).format('YYYY.MM.DD')}</Text>
            <View style={styles.tagWrap}>
              <Icon name="label" size={13} style={styles.tagIcon}/>
              <Text style={styles.tagText}>{newsItem.tags[0].name}</Text>
            </View>
          </View>
          <View style={styles.newsContent}>
            <Text style={styles.newsTitle}>{newsItem.title}</Text>
            <Text style={styles.newsBody}>{newsItem.body}</Text>
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
