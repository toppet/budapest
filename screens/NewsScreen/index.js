import React, { Component } from 'react';
import _ from 'lodash';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  FlatList,
  Picker,
  Modal,
  Button,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import PageHeader from '../../components/PageHeader';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icomoonConfig from '../../selection.json';
const CustomIcon = createIconSetFromIcoMoon(icomoonConfig);
import moment from 'moment';

const sampleNews = [
  {
    id: 0,
    title: "Következő hetiszakaszunk: Mátajsz-Mászé (מַּטּוֹת-מַסְעֵי)",
    posted_at: "2018-07-14 14:06:35",
    body: "Ezen a héten elkezdjük olvasni Mózes V. könyvét. A könyv első hetiszakasza, a könyv elnevezése is egyben Dvárim, askenáz kiejtéssel Dövórim (דְּבָרִים). Jelentése: Szavak./n Nevezik az ötödik könyvet Misné Tórának, a Tan megismétlésének, mert Mózes szózatában a negyven év minden fontos történéseit, tanításait felidézi. A történészek szerint ez a könyv i.e. 621-ben Josijáhu király uralkodása alatt került elő. A fiatal király az elődei által szégyenletesen elhanyagolt Templomot rendbe kívánta hozni, megtisztítva a fizikai és szellemi mocsoktól. A fal egy mélyedésében tekercset találtak, az elveszettnek hitt Ötödik Könyvet. A meghatódott uralkodó elrendelte a Devárim rendszeres felolvasását. A tartalom személyes visszaemlékezés, számadás. Ezért stílusa emelkedett, költői. Egyes eseményeket pl. a kémek történetét megmagyarázza, pontosabban értelmezi annál, ahogyan az a negyedik könyvben történésszerűen volt leírva. Ez a szidra a “látomás” szombatján kerül felolvasásra, amely megelőzi az egyik legnagyobb gyásznapunkat, Ab hó 9.-ét, héberül Tisó beávot. A “látomás” szó Jesája próféta Háftórájának kezdő szava, héberül cházon. Tisó Beáv ebben az évben július 29.-ére, vasárnapra esik. 25 órás böjt. A templomból eltávolítjuk a díszeket, a földön ülünk. Szombaton este Jeremiás Siralmait olvassuk hagyományos dallamra. Vasárnap délelőtt imaszíjak és tálit nélkül mondjuk a reggeli imát. Tórát is olvasnak három személynek. (Mózes 5, 4-25-40.) Bőr cipőt nem hordunk, Kinotot, szomorú énekeket olvasunk. Mindkét Szentély ezen a napon pusztult el. Gyászolunk.",
    media: [
      {
        id: 100,
        src_media: "https://librarius.hu/wp-content/uploads/2016/05/haumann-peter.jpg",
        src_thumbs: "https://asd.com/ize-thumb.jpg",
        type: 1
      }
    ],
    tags: [
      {
        id: 100,
        name: "Budapest"
      }
    ]
  },
]

// const top3News = latestNews.splice(0,3);
// console.log('top3News', top3News); 

export default class NewsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: [],
      tagFilterPlaceholder: 'Cimkék',
      selectedTagFilterId: null,
      selectedDateFilter: null,
      tagModalVisible: false,
      prevItemDate: "",
      latestNewsInState: null,
      loading: true,
      top3News: [],
      refreshing: false,
      refreshingNewsList: false,
    }
  }

  componentWillMount() {
    this.getNewsAndTopNews();
    this.getTags();
  }

  _onRefresh = () => {
    this.setState({
      refreshing: true,
      refreshingNewsList: true
    });
    
    setTimeout(() => {
      this.setState({ 
        refreshing: false,
        refreshingNewsList: false
      });
    }, 3000);
  }

  getNewsAndTopNews() {
    this.setState({
      loading: true,
    }, () => {
      fetch('https://jewps.hu/api/v1/news')
        .then((response) => response.json())
        .then((responseJson) => {
          console.log('news', responseJson);
          const responseData = responseJson.data;
          
          if(responseJson.success) {
            this.setState({ 
              latestNewsInState: responseData,
              top3News: [responseData[0], responseData[1], responseData[2]],
            });
          }
          
        })
        .catch((error) => {
          console.error(error);
        });
    })
  };

  getTags() {
    fetch('https://jewps.hu/api/v1/tags')
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log('tags', responseJson);
        const responseData = responseJson.data;
        const tmpTags = [];
        if(responseJson.success) {
          responseData.map((t) => {
            if (_.includes(tmpTags, t) === false) {
              tmpTags.push(t);
            }
          });
          this.setState({ 
            tags: tmpTags,
            loading: false,
          });
        }
        
      })
      .catch((error) => {
        console.error(error);
      });
  }

  getFilteredNews(dateFilter, selectedTagFilterId) {
    // console.log('dateFilter', dateFilter, 'tagFilter', selectedTagFilterId);
    let fetchUrl = 'https://jewps.hu/api/v1/news';

    if(selectedTagFilterId) {
      fetchUrl = `https://jewps.hu/api/v1/tags/${selectedTagFilterId}/news`;
    }

    this.setState({
      refreshingNewsList: true,
    }, () => {
      fetch(fetchUrl)
        .then((response) => response.json())
        .then((responseJson) => {
          console.log('news filtered by tags', responseJson);
          const responseData = responseJson.data;
          
          if(responseJson.success) {
            this.setState({ 
              latestNewsInState: responseData,
              refreshingNewsList: false,
            });
          }
          
        })
        .catch((error) => {
          console.error(error);
        });
    })
  }

  filterNews(filterBy) {
    const filteredValues = [this.state.latestNewsInState[0], this.state.latestNewsInState[1]];
    console.log('filteredValues', filteredValues);
    this.setState({
      latestNewsInState: filteredValues,
    });
  }

  renderNewsListItem = (item, index) => {
    const { latestNewsInState } = this.state;
    let listHeader = null;
    let monthSeparator = null;
    const prevMonth = index === 0 ? latestNewsInState[0].posted_at.slice(5, 7) : latestNewsInState[index-1].posted_at.slice(5, 7);
    const currentMonth = item.posted_at.slice(5, 7)
    const prevItemDate = index === 0 ? latestNewsInState[0].posted_at.slice(0, 10) : latestNewsInState[index-1].posted_at.slice(0, 10);
    const currentItemDate = item.posted_at.slice(0, 10);

    if (index === 0) {
      monthSeparator = (
        <View>
          <Text style={styles.listItemMonthHeaderText}>{moment(item.posted_at).format('MMMM').toUpperCase()}</Text>
          <View style={styles.listItemMonthHeaderBorder}></View>
        </View>
      );
      listHeader = <Text style={styles.listItemHeaderText}>{moment(item.posted_at).format('dddd - MMMM DD.')}</Text>
    }

    if (currentMonth !== prevMonth) {
      monthSeparator = (
        <View>
          <Text style={styles.listItemMonthHeaderText}>{moment(item.posted_at).format('MMMM').toUpperCase()}</Text>
          <View style={styles.listItemMonthHeaderBorder}></View>
        </View>
      );
    }

    if (currentItemDate !== prevItemDate) {
      listHeader = <Text style={styles.listItemHeaderText}>{moment(item.posted_at).format('dddd - MMMM DD.')}</Text>
    }

    return (
      <View>
        {monthSeparator}
        {listHeader}
        <TouchableOpacity key={item.id} activeOpacity={0.8} onPress={() => this.props.navigation.navigate('NewsDetail', { newsItem: item }) } style={styles.newsListItem}>
          <View style={{ flex: 1, paddingRight: 50 }}>
            <Text style={styles.newsListItemTitle}>{item.title}</Text>
            <View style={{flexDirection: 'row'}}>
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginRight: 20 }}>
                <Icon name="watch-later" size={13} color="#73beff" style={{marginRight: 5}}/> 
                <Text style={styles.newsListItemText}>{moment(item.posted_at).format('YYYY.MM.DD')}</Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                <Icon name="label" size={13} color="#c49565" style={{marginRight: 5}}/> 
                <Text style={styles.newsListItemText}>{item.tags[0].name}</Text>
              </View>
            </View>
          </View>
          <View style={{alignItems: 'center', justifyContent: 'center', width: 30, marginRight: 15}}>
            <Icon name="keyboard-arrow-right" size={25} color="#d8d8d8" />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  getLoadingIndicator() {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  getFilterValueText(selectedTag) {
    console.log('getFilterValueText selectedTag', selectedTag);
    // {tagFilter.name.length > 10 ? `${tagFilter.name.slice(0,10)}...` : tagFilter.name}
  }

  // RENDER
  render() {
    const { loading, tags, selectedTagFilterId, tagFilterPlaceholder, latestNewsInState, top3News } = this.state;

    if (loading) {
      return this.getLoadingIndicator();
    }

    console.log('latestNewsInState', latestNewsInState);
    console.log('tagsInState', tags);
    console.log('selectedTagFilterId', selectedTagFilterId);

    const selectedTagObj = selectedTagFilterId ? _.find(tags, (o) => o.id == selectedTagFilterId) : '';
    const selectedTagLabel = selectedTagObj.name;
    console.log('selectedTagLabel', selectedTagLabel);

    let tagFilterClearBtn = null;
    let tagPickers;

    if(tags.length > 0) {
      tagPickers = tags.sort(function(a, b){
        if(a.name < b.name) return -1;
        if(a.name > b.name) return 1;
        return 0;
      }).map((t, i) => (
        <Picker.Item key={`${t.id}`} label={`${t.name}`} value={t.id} />
      ));
    }

    if(selectedTagFilterId) {
      tagFilterClearBtn = (
        <TouchableOpacity onPress={() => {
          this.setState({ 
            selectedTagFilterId: null,
          }, () => this.getFilteredNews(null, null))
        }}>
            <Icon name="cancel" size={20} />
        </TouchableOpacity>
      );
    }

    const news = top3News.map((n) => (
      <View style={styles.newsCard} key={n.id}>
        <View style={{ width: '100%', height: '100%', overflow: 'hidden', padding: 0,}}>
          <ImageBackground source={{uri: n.media[0].src_media}} resizeMode='cover' style={{ height: '100%' }}>
              <View style={{ padding: 15 }}>
                <Text style={styles.newsDate}>{moment(n.posted_at).format('YYYY.MM.DD')}</Text>
                <Text style={styles.newsTitle}>{n.title}</Text>
              </View>
          </ImageBackground>
        </View>
        <TouchableOpacity style={styles.readMoreBtn} activeOpacity={0.95}>
          <Text style={styles.readMoreBtnText}>Elolvasom</Text>
        </TouchableOpacity>
      </View>
    ));
   
    const newsListItems = (
      <FlatList
       data={latestNewsInState}
       renderItem={({item, index}) => this.renderNewsListItem(item, index)}
       keyExtractor={(item, index) => `${item.id}${index}`}
      >
      </FlatList>
    )

    return (
      <View style={styles.container}>

        <PageHeader 
          {...this.props}
          pageTitle="Hírek"
        />

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          stickyHeaderIndices={[3]}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
          style={styles.content}
        >
          <Text style={styles.title}>Aktuális</Text>
          
          <View style={{paddingBottom: 20, paddingHorizontal: 15, }}>
            {news}
          </View>

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
                  color={selectedTagFilterId ? "#c49565" : "#434656"}
                />
                <Text 
                  style={selectedTagFilterId ? styles.filterTextActive : styles.filterTextInActive}
                >
                  {selectedTagLabel ? selectedTagLabel : tagFilterPlaceholder}
                </Text>
                {tagFilterClearBtn}
              </TouchableOpacity>
            </View>

          </View>

          <View style={{marginBottom: 25}}>
            { this.state.refreshingNewsList ? this.getLoadingIndicator() : newsListItems }
          </View>

          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.tagModalVisible}
            transparent
            onRequestClose={() => {
              console.log('Modal has been closed, state value => ', this.getFilteredNews(null, selectedTagFilterId));
            }}
            onDismiss={() => {
              console.log('Modal has been closed, state value => ', this.getFilteredNews(null, selectedTagFilterId));
            }}
          >
            <View style={{ marginTop: 22, backgroundColor: '#fafafa', position: 'absolute', bottom: 0, width: '100%' }}>
              <View>
                <Picker
                  selectedValue={selectedTagFilterId}  
                  onValueChange={(itemValue, itemIndex) => {
                    console.log('typeof itemValue', typeof itemValue)
                    console.log('itemValue', itemValue)
                    this.setState({
                      selectedTagFilterId: itemValue === "" ? null : itemValue,
                    })
                  }}>
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
    width: '100%',
    height: 155,
    borderWidth: 2,
    borderRadius: 3,
    marginBottom: 30,
  },
  shareBtn: {
    marginBottom: 40,
  },
  newsDate: {
    marginTop: 75,
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
  listItemMonthHeaderText: {
    backgroundColor: "#f5f5f5", 
    padding: 5, 
    paddingLeft: 15,
    fontFamily: "Montserrat",
    fontSize: 14,
    fontWeight: "600",
    color: '#c49565',
  },
  listItemMonthHeaderBorder: {
    height: 1,
    backgroundColor: '#e6e6e6',
  },
  listItemHeaderText: {
    backgroundColor: "#f5f5f5", 
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

