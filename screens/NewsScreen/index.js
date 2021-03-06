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
  RefreshControl,
  DatePickerIOS,
  DatePickerAndroid,
  Image,
  Platform,
  Dimensions,
} from 'react-native';

import PageHeader from '../../components/PageHeader';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icomoonConfig from '../../selection.json';
const CustomIcon = createIconSetFromIcoMoon(icomoonConfig);
import moment from 'moment';
import PageLoader from '../../components/PageLoader';
import { SinglePickerMaterialDialog } from 'react-native-material-dialog';

import textContentJSON from './newsTrans.json';

export default class NewsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: [],
      selectedTagFilterId: null,
      selectedDateFilter: null,
      tagModalVisible: false,
      prevItemDate: "",
      latestNewsInState: [],
      loading: true,
      top3News: [],
      refreshing: false,
      refreshingNewsList: false,
      datePickerModalVisible: false,
      chosenDate: null,
      formatterChosenDate: null,
      singlePickerVisible: false,
    }
  }

  componentWillMount() {
    this.fetchData();
  }

  async fetchData() {
    const newsAndTopNewsResponse = await this.getNewsAndTopNews();
    const tags = await this.getTags();

    this.setState({
      loading: false,
      top3News: this.getTop3News(newsAndTopNewsResponse),
      tags,
      latestNewsInState: newsAndTopNewsResponse,
      refreshing: false,
      refreshingNewsList: false,
    });
  }

  _onRefresh = async () => {
    this.setState({
      refreshing: true,
      refreshingNewsList: true,
      selectedTagFilterId: null,
      selectedDateFilter: null,
    });

    const refreshednewsAndTopNewsResponse = await this.getNewsAndTopNews();

    // a little bit of delay
    setTimeout(() =>
      this.setState({
        latestNewsInState: refreshednewsAndTopNewsResponse,
        top3News: this.getTop3News(refreshednewsAndTopNewsResponse),
        refreshing: false,
        refreshingNewsList: false,
      }),
    1000);
  }

  getTop3News(response) {
    let newsArray;
    
    if(!response) {
      return null;
    }

    if(response && response.length < 3) {
      newsArray = response.map(r => r);
    } else {
      newsArray = [response[0], response[1], response[2]];
    }

    return newsArray;
  }

  getNewsAndTopNews = async () => {
    return await fetch('https://jewps.hu/api/v1/news')
      .then((response) => response.json())
      .then((responseJson) => {
        const responseData = responseJson.data;
        // console.log('responseData', responseData);
        if(responseJson.success) {
          return responseData;
        }
      })
      .catch((error) => {
        return null;
      })
  }

  getTags = async () => {
    return await fetch('https://jewps.hu/api/v1/tags')
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
          return tmpTags;
        }

      })
      .catch((error) => {
        return null;
      });
  }

  getFilteredNews(dateFilter, selectedTagFilterId) {
    let fetchUrl = 'https://jewps.hu/api/v1/news';

    let formattedDate;

    if(dateFilter) {
      formattedDate = moment(dateFilter).format('YYYY-MM-DD');
      fetchUrl = `https://jewps.hu/api/v1/news?date=${formattedDate}`;
    }

    if(selectedTagFilterId) {
      fetchUrl = `https://jewps.hu/api/v1/tags/${selectedTagFilterId}/news`;
    }

    if(dateFilter && selectedTagFilterId) {
      fetchUrl = `https://jewps.hu/api/v1/news?tags=${selectedTagFilterId}&date=${formattedDate}`;
    }
    // console.log('dateFilter', dateFilter, 'formattedDAte', formattedDate, 'selectedTagFilterId', selectedTagFilterId);
    // console.log('fetchurl', fetchUrl);

    this.setState({
      refreshingNewsList: true,
    }, () => {
      fetch(fetchUrl)
        .then((response) => response.json())
        .then((responseJson) => {
          // console.log('news filtered by tags', responseJson);
          const responseData = responseJson.data;

          if(responseJson.success) {
            this.setState({
              latestNewsInState: responseData,
              refreshingNewsList: false,
            });
          } else {
            this.setState({
              latestNewsInState: null,
              refreshingNewsList: false,
            });
          }

        })
        .catch((error) => {
          return null;
        });
    })
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

  sliceTagFilterLabel(selectedTagLabel) {
    // console.log('getFilterValueText selectedTagLabel', selectedTagLabel);
    return selectedTagLabel && selectedTagLabel.length > 10 ? `${selectedTagLabel.slice(0,10)}...` : selectedTagLabel;
  }

  setDate(newDate) {
    this.setState({
      chosenDate: newDate,
      formatterChosenDate: moment(newDate).format('YYYY.MM.DD'),
    })
  }

  // RENDER
  render() {
    const {
      loading,
      tags,
      selectedTagFilterId,
      latestNewsInState,
      top3News,
      chosenDate,
      formatterChosenDate,
      refreshingNewsList,
      datePickerModalVisible,
    } = this.state;


    let textContent =  textContentJSON.hu;
    moment.locale('hu');
    let tagFilterPlaceholder = textContent.tagBtn;

    if(this.props.screenProps.settingsEng) {
      textContent = textContentJSON.en;
      tagFilterPlaceholder = textContent.tagBtn;
      moment.locale('en');
    }

    if (loading) {
      return <PageLoader textContent={textContent} />;
    }

    const selectedTagObj = selectedTagFilterId ? _.find(tags, (o) => o.id == selectedTagFilterId) : '';
    const selectedTagLabel = selectedTagObj.name;

    let dateFilterClearBtn = null;
    let tagFilterClearBtn = null;
    let tagPickers;
    let news = null;

    if(tags && tags.length > 0) {
      tagPickers = tags.sort(function(a, b){
        if(a.name < b.name) return -1;
        if(a.name > b.name) return 1;
        return 0;
      }).map((t, i) => (
        <Picker.Item key={`${t.id}`} label={`${t.name}`} value={t.id} />
      ));
    }

    if(formatterChosenDate) {
      dateFilterClearBtn = (
        <TouchableOpacity
          onPress={() => {
            this.setState({
              formatterChosenDate: null,
              chosenDate: null,
            }, () => this.getFilteredNews(null, selectedTagFilterId))
          }}
          style={styles.clearBtn}
        >
          <Icon name="cancel" size={20} color="#434656"/>
        </TouchableOpacity>
      );
    }

    if(selectedTagFilterId) {
      tagFilterClearBtn = (
        <TouchableOpacity 
          onPress={() => {
            this.setState({
              selectedTagFilterId: null,
              selectedPickerItem: null,
            }, () => this.getFilteredNews(chosenDate, null))
            
          }}
          style={styles.clearBtn}
        >
          <Icon name="cancel" size={20} color="#434656"/>
        </TouchableOpacity>
      );
    }


    if(top3News) {
      news = top3News.map((n) => {
        const headerImage = _.find(n.media, n => n.type === 1);
        return (
          <TouchableOpacity style={styles.newsCard} key={n.id} activeOpacity={0.95} onPress={() => this.props.navigation.navigate('NewsDetail', { newsItem: n }) }>
            <View style={{ width: '100%', height: '100%', overflow: 'hidden', padding: 0, borderRadius: 6,}}>
              <ImageBackground source={{uri: headerImage.src_thumbs}} resizeMode='cover' style={{ height: '100%' }}>
                  <View style={{ padding: 10, backgroundColor: 'rgba(67, 70, 86, 0.6)', height: '100%' }}>
                    <Text style={styles.newsDate}>{moment(n.posted_at).format('YYYY.MM.DD')}</Text>
                    <Text style={styles.newsTitle}>{n.title}</Text>
                  </View>
              </ImageBackground>
            </View>
            <TouchableOpacity style={styles.readMoreBtn} activeOpacity={0.95} onPress={() => this.props.navigation.navigate('NewsDetail', { newsItem: n }) }>
              <Text style={styles.readMoreBtnText}>{textContent.elolvasomBtn}</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      );
    }

    let newsListItems;

    if (latestNewsInState && latestNewsInState.length > 0) {
      newsListItems = (
        <FlatList
          data={latestNewsInState}
          renderItem={({item, index}) => this.renderNewsListItem(item, index)}
          keyExtractor={(item, index) => `${item.id}${index}`}
        />
      );
    } else {
      newsListItems = (
        <View style={{alignItems: 'center', marginBottom: 20}}>
          <Text style={styles.noNewsTitle}>{textContent.emptyTitle}</Text>
          <Text style={styles.noNewsSub}>{textContent.emptyBody}</Text>
          <Image source={require('../../assets/images/hir_esemeny_empty.png')} style={{width: 250, height: 125, marginTop: 15,}}/>
        </View>
      );
    }

    const datePickerElement = (
      <DatePickerIOS
        date={this.state.chosenDate ? this.state.chosenDate : new Date()}
        onDateChange={(newDate) => this.setDate(newDate)}
        locale="hu"
        mode="date"
      />
    );
    


    return (
      <View style={styles.container}>

        <PageHeader
          {...this.props}
          pageTitle={textContent.screenTitle}
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
          <Text style={styles.title}>{textContent.aktualis}</Text>

          <View style={{paddingBottom: 10, paddingHorizontal: 15, }}>
            {news}
          </View>

          <Text style={styles.title}>{textContent.osszeshir}</Text>

          <View style={styles.filterRowBg}>
            <View style={styles.filterRow}>
              <View style={{ flex: 1, width: '50%' }}>
                <TouchableOpacity
                  onPress={async () => {
                    if(Platform.OS === 'android') {
                      try {
                        const {action, year, month, day} = await DatePickerAndroid.open({
                          // Use `new Date()` for current date.
                          // May 25 2020. Month 0 is January.
                          date: new Date()
                        });
                        if (action !== DatePickerAndroid.dismissedAction) {
                          // Selected year, month (0-11), day
                          // this.setDate(moment(`${year}-${month}-${day}`));
                          const curMon = ++month;
                          const rightMonth = curMon < 10 ? `0${curMon}` : curMon;
                          const rightDay = day < 10 ? `0${day}` : day;
                          const selectedDate = moment(`${year}-${rightMonth}-${rightDay}`).toDate();
                          
                          this.setState({
                            chosenDate: selectedDate,
                            formatterChosenDate: moment(selectedDate).format('YYYY.MM.DD'),
                          }, () => this.getFilteredNews(selectedDate, selectedTagFilterId))
                        }
                      } catch ({code, message}) {
                        console.warn('Cannot open date picker', message);
                      }
                    } else {
                      this.setState({ datePickerModalVisible: true }, this.setDate(new Date()))}
                    }
                  }
                  activeOpacity={0.8}
                  style={styles.tagFilter} 
                >
                  <Icon
                    name="date-range"
                    size={20}
                    color={formatterChosenDate ? "#c49565" : "#434656"}
                  />
                  <Text style={formatterChosenDate ? styles.filterTextActive : styles.filterTextInActive}>
                    {formatterChosenDate ? formatterChosenDate : textContent.dateBtn}
                  </Text>
                  {dateFilterClearBtn}
                </TouchableOpacity>
              </View>

              <View style={{ position: 'absolute', right: 0, flex: 1, borderLeftWidth: 1, borderColor: '#ededed', width: '50%'}}>
                <TouchableOpacity 
                  onPress={() => 
                    Platform.OS === 'android' ? this.setState({ singlePickerVisible: true}) : this.setState({ tagModalVisible: true })
                  }
                  style={styles.tagFilter} 
                  activeOpacity={0.8}
                >
                  <Icon
                    name="label"
                    size={20}
                    color={selectedTagFilterId ? "#c49565" : "#434656"}
                  />
                  <Text
                    style={selectedTagFilterId ? styles.filterTextActive : styles.filterTextInActive}
                  >
                    {selectedTagLabel ? this.sliceTagFilterLabel(selectedTagLabel) : tagFilterPlaceholder}
                  </Text>
                  {tagFilterClearBtn}
                </TouchableOpacity>
              </View>

            </View>
          </View>

          <View style={{marginBottom: 25}}>
            { refreshingNewsList ? <PageLoader textContent={textContent} /> : newsListItems }
          </View>

          <SinglePickerMaterialDialog
              title={textContent.pickerTitle}
              items={tags.map(row => ({ value: row.id, label: row.name }))}
              visible={this.state.singlePickerVisible}
              selectedItem={this.state.selectedPickerItem}
              onCancel={() => this.setState({ singlePickerVisible: false })}
              onOk={async result => {
                await this.setState({
                  singlePickerVisible: false,
                  selectedPickerItem: result.selectedItem,
                  selectedTagFilterId: result.selectedItem.value,
                }, () => this.getFilteredNews(chosenDate, result.selectedItem.value))
              }}
            />

          <Modal
            animationType="slide"
            transparent
            visible={datePickerModalVisible}
            onRequestClose={() => {
              console.log('Modal has been closed, state value => ', this.getFilteredNews(chosenDate, selectedTagFilterId));
            }}
            onDismiss={() => {
              console.log('Modal has been closed, state value => ', this.getFilteredNews(chosenDate, selectedTagFilterId));
            }}
            onPress={() => console.log('modal pressed')}
          >
            <View style={{ flex: 1, height: '100%', width: '100%' }}>
              <View style={{ marginTop: 22, backgroundColor: '#fafafa', position: 'absolute', bottom: 0, zIndex: 1000, width: '100%',}}>
                
                { datePickerElement }

                <TouchableOpacity
                  style={{position: 'relative', width: '100%', alignItems: 'center', justifyContent: 'center',}}
                  onPress={() => this.setState({ datePickerModalVisible: false }) }
                  activeOpacity={0.8}
                >
                  <Text style={{paddingHorizontal: 25, paddingVertical: 15, fontFamily: "Montserrat", fontSize: 18, fontWeight: "600", color: '#73beff', position: 'relative', zIndex: 1000, bottom: 10}}>Bezár</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Modal
            animationType="slide"
            visible={this.state.tagModalVisible}
            transparent
            onRequestClose={() => {
              this.getFilteredNews(chosenDate, selectedTagFilterId);
            }}
            onDismiss={() => {
              this.getFilteredNews(chosenDate, selectedTagFilterId);
            }}
          >
            <View style={{ marginTop: 22, backgroundColor: '#fafafa', position: 'absolute', bottom: 0, width: '100%' }}>
              <View>
                <Picker
                  style={{ width: '100%' }}
                  selectedValue={selectedTagFilterId}
                  onValueChange={(itemValue, itemIndex) => {
                    // console.log('typeof itemValue', typeof itemValue)
                    // console.log('itemValue', itemValue)
                    this.setState({
                      selectedTagFilterId: itemValue === "" ? null : itemValue,
                    })
                  }}>
                  <Picker.Item label="" value="" />
                  {tagPickers}
                </Picker>
                <TouchableOpacity
                  style={{position: 'relative', width: '100%', alignItems: 'center', justifyContent: 'center',}}
                  onPress={() => this.setState({ tagModalVisible: false }) }
                  activeOpacity={0.8}
                >
                  <Text style={{paddingHorizontal: 25, paddingVertical: 15, fontFamily: "Montserrat", fontSize: 18, fontWeight: "600", color: '#73beff', position: 'relative', zIndex: 1000, bottom: 10}}>Bezár</Text>
                </TouchableOpacity>
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
    minHeight: 150,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 0 : 20,
  },
  content: {
    // padding: 10,
  },
  title: {
    fontFamily: "YoungSerif-Regular",
    fontSize: 26,
    color: '#434656',
    paddingLeft: 15,
    marginBottom: 15,
    marginTop: 15,
  },
  newsCard: {
    width: '100%',
    height: 155,
    marginBottom: 25,
  },
  shareBtn: {
    marginBottom: 40,
  },
  newsDate: {
    marginTop: 50,
    fontFamily: "Montserrat",
    fontSize: 10,
    fontWeight: '600',
    color:  "#FFF",
  },
  newsTitle: {
    fontFamily: "Montserrat",
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 3,
    marginBottom: 5,
  },
  readMoreBtn: {
    position: 'absolute',
    zIndex: 5,
    bottom: Platform.OS ? 10 : -15,
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
    shadowColor: '#b7a99b',
    shadowOffset: {
      width: 0,
      height: 15
    },
    shadowRadius: 15,
    shadowOpacity: 0.5,
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
    position: 'relative',
    height: 55,
  },
  tagFilter: {
    // flexDirection: 'row',
    // alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
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
    width: Dimensions.get('window').width < 350 ? 70 : 85,
    marginLeft: Dimensions.get('window').width < 350 ? 5 : 10,
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
  noNewsTitle: {
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 15,
    fontFamily: "YoungSerif-Regular",
    fontSize: 20,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    color: '#434656',
    textAlign: 'center',
  },
  noNewsSub: {
    paddingHorizontal: 15,
    marginBottom: 5,
    fontFamily: "YoungSerif-Regular",
    fontSize: 14,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: '#A3ABBC',
    textAlign: 'center',
  },
  filterRowBg: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 0,
    paddingHorizontal: 10,
    justifyContent: 'center',
    marginBottom: 15,
  },
  clearBtn: {
    padding: 5,
  }
});
