import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  SectionList,
  Picker,
  Modal,
  Button,
} from 'react-native';

import PageHeader from '../../components/PageHeader';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icomoonConfig from '../../selection.json';
const CustomIcon = createIconSetFromIcoMoon(icomoonConfig);
import moment from 'moment';

const latestNews = [
  {
    title: '2018-07-24',
    data: [
      {
        id: 0,
        newsDate: '2018-07-24',
        newsTitle: 'Következő hetiszakaszunk: Vöeszchánon (וָאֶתְחַנַּן)',
        newsContent: '',
        newsBackground: 'https://librarius.hu/wp-content/uploads/2016/05/haumann-peter.jpg',
        newsTag: 'hetiszakasz',
      },
      {
        id: 1,
        newsDate: '2018-07-24',
        newsTitle: 'Következő hetiszakaszunk: Mátajsz-Mászé (מַּטּוֹת-מַסְעֵי)',
        newsContent: '',
        newsBackground: 'https://librarius.hu/wp-content/uploads/2016/05/haumann-peter.jpg',
        newsTag: 'masik cimke',
      },
    ]
  },
  {
    title: '2018-07-25',
    data: [
      {
        id: 0,
        newsDate: '2018-07-25',
        newsTitle: 'Következő hetiszakaszunk: Vöeszchánon (וָאֶתְחַנַּן)',
        newsContent: '',
        newsBackground: 'https://librarius.hu/wp-content/uploads/2016/05/haumann-peter.jpg',
        newsTag: 'hetiszakasz',
      },
      {
        id: 1,
        newsDate: '2018-07-25',
        newsTitle: 'Következő hetiszakaszunk: Mátajsz-Mászé (מַּטּוֹת-מַסְעֵי)',
        newsContent: '',
        newsBackground: 'https://librarius.hu/wp-content/uploads/2016/05/haumann-peter.jpg',
        newsTag: 'masik cimke',
      },
      {
        id: 2,
        newsDate: '2018-07-25',
        newsTitle: 'Következő hetiszakaszunk: Mátajsz-Mászé (מַּטּוֹת-מַסְעֵי)',
        newsContent: '',
        newsBackground: 'https://librarius.hu/wp-content/uploads/2016/05/haumann-peter.jpg',
        newsTag: 'masik cimke',
      },
    ]
  }
]

export default class NewsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: [],
      tagFilterPlaceholder: 'Cimkék',
      tagFilter: 'Cimkék',
      tagModalVisible: false,
    }
  }

  componentWillMount() {
    const tmpTags = [];
    // const tmpEventHeaders = [];

    latestNews.map((n) => {
      n.data.map((d) => {
        if (tmpTags.indexOf(d.newsTag) === -1) {
          tmpTags.push(d.newsTag);
        }
      })
    });

    this.setState({ tags: tmpTags });
  }

  render() {
    const { tags, tagFilter, tagFilterPlaceholder } = this.state;
    
    let tagFilterCancelBtn = null;
    let tagPickers;

    if(tags.length > 0) {
      tagPickers = tags.sort(function(a, b){
        if(a < b) return -1;
        if(a > b) return 1;
        return 0;
      }).map((t, i) => (
        <Picker.Item key={`${t}`} label={`${t}`} value={`${t}`} />
      ));
    }

    if(tagFilter !== tagFilterPlaceholder && tagFilter !== '') {
      tagFilterCancelBtn = (
        <TouchableOpacity onPress={() => this.setState({tagFilter: tagFilterPlaceholder})}>
            <Icon name="cancel" size={20} />
        </TouchableOpacity>
      );
    }

    const news = latestNews.map((n) => {
     return n.data.map((d) => (
        <View style={styles.newsCard} key={d.id}>
          <View style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
            <ImageBackground source={{uri: d.newsBackground}} style={{width: 315, height: 155, position: 'relative', padding: 15, borderRadius: 3}}>
                <TouchableOpacity activeOpacity={0.8} style={styles.shareBtn}>
                  <CustomIcon name="ic_share" size={20} color='#fff'/>
                </TouchableOpacity>
                <View>
                  <Text style={styles.newsDate}>{moment(d.newsDate).format('YYYY.MM.DD')}</Text>
                  <Text style={styles.newsTitle}>{d.newsTitle}</Text>
                </View>
            </ImageBackground>
          </View>
          <TouchableOpacity style={styles.readMoreBtn} activeOpacity={0.9}>
            <Text style={styles.readMoreBtnText}>Elolvasom</Text>
          </TouchableOpacity>
        </View>
      ))
    });

    const newsListItems = (
      <SectionList
        renderItem={({ item, index }) => (
          <TouchableOpacity key={item.id} activeOpacity={0.8} onPress={() => this.props.navigation.navigate('NewsDetail', { news: item }) } style={styles.newsListItem}>
            <View style={{ flex: 1, paddingRight: 50 }}>
              <Text style={styles.newsListItemTitle}>{item.newsTitle}</Text>
              <View style={{flexDirection: 'row'}}>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginRight: 20 }}>
                  <Icon name="watch-later" size={13} color="#73beff" style={{marginRight: 5}}/> 
                  <Text style={styles.newsListItemText}>{moment(item.newsDate).format('YYYY.MM.DD')}</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                  <Icon name="label" size={13} color="#c49565" style={{marginRight: 5}}/> 
                  <Text style={styles.newsListItemText}>{item.newsTag}</Text>
                </View>
              </View>
            </View>
            <View style={{alignItems: 'center', justifyContent: 'center', width: 30, marginRight: 15}}>
              <Icon name="keyboard-arrow-right" size={25} color="#d8d8d8" />
            </View>
          </TouchableOpacity>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.listItemHeaderText}>{moment(title).format('dddd - MMMM DD.')}</Text>
        )}
        sections={latestNews}
        keyExtractor={(item, index) => item.id + index}
      >
      </SectionList>
    )

    return (
      <View style={styles.container}>

        <PageHeader 
          {...this.props}
          pageTitle="Hírek"
        />

        <ScrollView showsVerticalScrollIndicator={false} style={styles.content} stickyHeaderIndices={[3]}>
          <Text style={styles.title}>Aktuális</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{paddingBottom: 20, paddingLeft: 15, }}>
            {news}
          </ScrollView>

          <Text style={styles.title}>Összes hír</Text>

          <View style={styles.filterRow}>
            <View style={{ width: '50%', padding: 10, borderRightWidth: 1, borderColor: '#ededed' }}>
              <TouchableOpacity onPress={() => this.setState({datePickerModalVisible: true})} style={styles.tagFilter} activeOpacity={0.8}>
                <Icon name="date-range" size={20} />
                <Text style={[styles.filterTextInActive, { color: '#434656'} ]}>Dátum</Text>
              </TouchableOpacity>
            </View>
            <View style={{ position: 'absolute', right: 90, padding: 10, marginLeft: 15, width: 75,}}>
              <TouchableOpacity onPress={() => this.setState({ tagModalVisible: true })} style={styles.tagFilter} activeOpacity={0.8}>
                <Icon 
                  name="label" 
                  size={20} 
                  color={(tagFilter !== tagFilterPlaceholder && tagFilter !== '') ? "#c49565" : "#434656"}
                />
                <Text 
                  style={(tagFilter !== tagFilterPlaceholder && tagFilter !== '') ? styles.filterTextActive : styles.filterTextInActive}
                >
                  {tagFilter.length > 10 ? `${tagFilter.slice(0,10)}...` : tagFilter}
                </Text>
                {tagFilterCancelBtn}
              </TouchableOpacity>
            </View>
          </View>

          <View style={{marginBottom: 25}}>
            {newsListItems}
          </View>

          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.tagModalVisible}
            transparent
            onRequestClose={() => {
              alert('Modal has been closed.');
            }}
          >
            <View style={{ marginTop: 22, backgroundColor: '#fafafa', position: 'absolute', bottom: 0, width: '100%' }}>
              <View>
                <Picker
                  selectedValue={tagFilter}  
                  onValueChange={(itemValue) => this.setState({tagFilter: itemValue !== '' ? itemValue : tagFilterPlaceholder})}>
                  <Picker.Item label="" value="" />
                  {tagPickers}
                </Picker>
                <Button
                  title="Bezár"
                  onPress={() => this.setState({ tagModalVisible: false }) } />
              </View>
            </View>
          </Modal>
          
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
  content: {
    // padding: 10,
  },
  title: {
    fontFamily: "YoungSerif",
    fontSize: 26,
    color: '#434656',
    paddingLeft: 15,
    marginBottom: 15,
  },
  newsCard: {
    width: 315,
    height: 155,
    borderWidth: 2,
    borderRadius: 3,
    marginRight: 20,
  },
  shareBtn: {
    marginBottom: 40,
  },
  newsDate: {
    fontFamily: "Montserrat",
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  newsTitle: {
    fontFamily: "Montserrat",
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  readMoreBtn: {
    position: 'absolute',
    zIndex: 5,
    bottom: -15,
    right: 15,
    width: 105,
    paddingTop: 8, 
    paddingBottom: 8, 
    paddingLeft: 15, 
    paddingRight: 15, 
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ededed',
    alignItems: 'center',
  },
  readMoreBtnText: {
    color: '#b7a99b',
    fontFamily: "Montserrat",
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'center',
  },
  filterRow: {
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 3,
    borderColor: '#ededed',
    backgroundColor: '#fff',
    marginBottom: 15,
    position: 'relative',
    height: 50,
    marginRight: 15,
    marginLeft: 15,
  }, 
  tagFilter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterTextInActive: {
    fontFamily: "Montserrat",
    fontSize: 12,
    fontWeight: '600',
    color: '#434656',
    width: 85,
    marginLeft: 10,
  },
  filterTextActive: {
    fontFamily: "Montserrat",
    fontSize: 12,
    fontWeight: '600',
    color: '#c49565',
    width: 85,
    marginLeft: 10,
    // marginRight: 20,
  },
  listItemHeaderText: {
    backgroundColor: "#ededed", 
    padding: 5, 
    paddingLeft: 15,
    fontFamily: "Montserrat",
    fontSize: 14,
    fontWeight: "600",
    color: '#434656',
  },
  newsListItem: {
    // borderWidth: 1,
    borderTopWidth: 1, 
    borderTopColor: '#ededed',
    flexDirection: 'row',
    padding: 15,
    paddingLeft: 0,
    paddingRight: 0,
  },
  newsListItemTitle: {
    fontFamily: "Montserrat",
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  newsListItemText: {
    fontFamily: "Montserrat",
    fontSize: 10,
    fontWeight: "600",
    color: '#a3abbc',
  },
});

