import React, { Component } from 'react';
import _ from 'lodash';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Picker,
  TouchableOpacity,
  Modal,
  Image,
  FlatList,
  RefreshControl,
  DatePickerIOS,
  DatePickerAndroid,
  Dimensions,
  Platform,
} from 'react-native';
import PageHeader from '../../components/PageHeader';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icomoonConfig from '../../selection.json';
const CustomIcon = createIconSetFromIcoMoon(icomoonConfig);
import moment from 'moment';
import textContentJSON from './eventsTrans.json';
import PageLoader from '../../components/PageLoader';
import { SinglePickerMaterialDialog } from 'react-native-material-dialog';

const dateFormat = 'YYYY-MM-DD';

export default class EventsScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      loading: true,
      locationFilter: null,
      dateFilter: null,
      formattedDateFilter: null,
      locations: [],
      locationModalVisible: false,
      datePickerModalVisible: false,
      events: null,
      refreshing: false,
      refreshingEventsList: false,
      singlePickerVisible: false,
    }
  }

  componentWillMount() {
    this.fetchData();
  }

  async fetchData() {
    const eventsResponse = await this.getEvents();

    this.setState({
      loading: false,
      events: eventsResponse,
      comingEventsInState: this.getComingEvents(eventsResponse),
      locations: this.getLocationFilters(eventsResponse),
      refreshing: false,
      refreshingEventsList: false,
    });
  }

  getEvents = async () => {
    try {
      return await fetch(`https://jewps.hu/api/v1/events?fromDate=${moment().format('YYYY-MM-DD')}`)
        .then(response => response.json())
        .then(resJson => {
          if (resJson.success) {
            return resJson.data;
          }
        })
    } catch(e) {

    }
  }

  getComingEvents(eventsResponse) {
    let comingEventsArray;

    if(eventsResponse.length < 5) {
      comingEventsArray = eventsResponse.map(r => r);
    } else {
      comingEventsArray = [eventsResponse[0], eventsResponse[1], eventsResponse[2], eventsResponse[3], eventsResponse[4]];
    }

    return comingEventsArray;
  }

  getLocationFilters(eventsResponse) {
    const tmpLocations = [];

    eventsResponse.forEach(({ location }) => {
      if (location.title && _.includes(tmpLocations, location.title) === false) {
        tmpLocations.push(location.title);
      }
    });

    return tmpLocations;
  }

  _onRefresh = async () => {
    this.setState({
      refreshing: true,
      refreshingEventsList: true,
      locationFilter: null,
      dateFilter: null,
    });

    const refreshedEvents = await this.getEvents();

    // a little bit of delay
    setTimeout(() =>
      this.setState({
        events: refreshedEvents,
        comingEventsInState: this.getComingEvents(refreshedEvents),
        refreshing: false,
        refreshingEventsList: false,
      }),
    1000);
  }

  setDate(newDate) {
    this.setState({
      dateFilter: newDate,
      formattedDateFilter: moment(newDate).format('YYYY.MM.DD'),
    })
  }

  getItemDescription(desc) {
    return desc.length < 80 ? desc :`${desc.slice(0, 80)} ...`;
  }


  renderEventListItem = (item, index) => {
    const { events } = this.state;
    let listHeader = null;
    let monthSeparator = null;
    const prevMonth = index === 0 ? events[0].from.slice(5, 7) : events[index-1].from.slice(5, 7);
    const currentMonth = item.from.slice(5, 7)
    const prevItemDate = index === 0 ? events[0].from.slice(0, 10) : events[index-1].from.slice(0, 10);
    const currentItemDate = item.from.slice(0, 10);

    if (index === 0) {
      monthSeparator = (
        <View>
          <Text style={styles.listItemMonthHeaderText}>{moment(item.from).format('MMMM').toUpperCase()}</Text>
          <View style={styles.listItemMonthHeaderBorder}></View>
        </View>
      );
      listHeader = <Text style={styles.listItemHeaderText}>{moment(item.from).format('dddd - MMMM DD.')}</Text>
    }

    if (currentMonth !== prevMonth) {
      monthSeparator = (
        <View>
          <Text style={styles.listItemMonthHeaderText}>{moment(item.from).format('MMMM').toUpperCase()}</Text>
          <View style={styles.listItemMonthHeaderBorder}></View>
        </View>
      );
    }

    if (currentItemDate !== prevItemDate) {
      listHeader = <Text style={styles.listItemHeaderText}>{moment(item.from).format('dddd - MMMM DD.')}</Text>
    }

    return (
      <View>
        {monthSeparator}
        {listHeader}
        <TouchableOpacity key={index} activeOpacity={0.8} onPress={() => {this.props.navigation.navigate('EventDetail', { event: item })}} style={styles.eventListItem}>
          <View style={{flex: 1, paddingRight: 50}}>
            <Text style={styles.eventListItemDesc}>{this.getItemDescription(item.name)}</Text>
            <View style={{flexDirection: 'row'}}>
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginRight: 20 }}>
                <Icon name="watch-later" size={13} color="#73beff" style={{marginRight: 5}}/>
                <Text style={styles.eventListItemText}>{moment(item.from).format('HH:mm')}</Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                <Icon name="near-me" size={13} color="#c49565" style={{marginRight: 5}}/>
                <Text style={styles.eventListItemText}>{item.location.title ? item.location.title : '-'}</Text>
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

  sliceLocationFilter(location) {
    // console.log('getFilterValueText selectedTagLabel', selectedTagLabel);
    return location.length > 10 ? `${location.slice(0,10)}...` : location;
  }


  getFilteredEvents(dateFilter, locationFilter) {
    const encodedLocationFilter = encodeURI(locationFilter);
    const today = moment().format(dateFormat);
    let fetchUrl = `https://jewps.hu/api/v1/events?fromDate=${today}`;
    let formattedDate;

    if(dateFilter) {
      formattedDate = moment(dateFilter).format('YYYY-MM-DD');
      fetchUrl = `https://jewps.hu/api/v1/events?date=${formattedDate}`;
    }

    if(locationFilter) {
      fetchUrl = `https://jewps.hu/api/v1/events?fromDate=${today}&location=${encodedLocationFilter}`;
    }

    if(dateFilter && locationFilter) {
      fetchUrl = `https://jewps.hu/api/v1/events?date=${formattedDate}&location=${encodedLocationFilter}`;
    }

    // console.log('dateFilter', dateFilter, 'locationFilter', locationFilter, 'encodedLocationFilter', encodedLocationFilter);
    // console.warn('fetchurl', fetchUrl);

    this.setState({
      refreshingEventsList: true,
    }, () => {
      fetch(fetchUrl)
        .then((response) => response.json())
        .then((responseJson) => {
          const responseData = responseJson.data;
          
          if(responseJson.success) {
            const sortedEventsById = _.sortBy(responseData, ['from']);
            this.setState({
              events: sortedEventsById,
              refreshingEventsList: false,
            });
          }

        })
        .catch((error) => {
          console.error(error);
        });
    })
  }

  render() {
    const {
      loading,
      locations,
      locationFilter,
      events,
      comingEventsInState,
      dateFilter,
      formattedDateFilter,
      refreshingEventsList,
    } = this.state;
    
    let dateFilterClearBtn = null;
    let locationFilterCancelBtn = null;

    let locationPickers;
    let comingEvents = null;
    let eventListItems = null;

    let textContent =  textContentJSON.hu;
    moment.locale('hu');
    let locationFilterPlaceholder = textContent.tagBtn;

    if(this.props.screenProps.settingsEng) {
      textContent = textContentJSON.en;
      locationFilterPlaceholder = textContent.tagBtn;
      moment.locale('en');
    }


    if (loading) {
     return <PageLoader textContent={textContent} />;
    }

    if(formattedDateFilter) {
      dateFilterClearBtn = (
        <TouchableOpacity 
          onPress={() => {
            this.setState({
              formattedDateFilter: null,
              dateFilter: null,
            }, () => this.getFilteredEvents(null, locationFilter))
          }}
          style={styles.cancelBtn}
        >
          <Icon name="cancel" size={20} color="#434656"/>
        </TouchableOpacity>
      );
    }

    if(locationFilter) {
      locationFilterCancelBtn = (
        <TouchableOpacity 
          onPress={() => {
            this.setState({
              locationFilter: null,
              selectedPickerItem: null,
            }, () => this.getFilteredEvents(dateFilter, null))
          }}
          style={styles.cancelBtn}
        >
          <Icon name="cancel" size={20} color="#434656"/>
        </TouchableOpacity>
      );
    }

    if(locations.length > 0) {
      locationPickers = locations.sort(function(a, b){
        if(a < b) return -1;
        if(a > b) return 1;
        return 0;
      }).map((l, i) => (
        <Picker.Item key={`${l}`} label={`${l}`} value={`${l}`} />
      ));
    }

    if(comingEventsInState && comingEventsInState.length > 0) {
      comingEvents = comingEventsInState.map((e) => (
        <View style={[styles.cardShadow, { width: 315 }]} key={e.id}>
          <TouchableOpacity style={styles.eventsCard} onPress={() => this.props.navigation.navigate('EventDetail', { event: e })} activeOpacity={0.8}>

            <View style={styles.imageBgBox}>
              <ImageBackground source={{ uri: e.media[0].src_thumbs}} style={{width: '100%', height: '100%'}}/>
            </View>

            <View style={styles.eventCard}>
              <View style={styles.eventCardInfoView}>
                <View style={styles.eventDayView}>
                  <Text style={styles.eventDay}>{moment(e.from).format('DD')}</Text>
                </View>

                <View style={{flex: 1, marginRight: 'auto'}}>
                  <Text style={styles.eventMonth}>{moment(e.from).format('MMMM').replace(/^\w/, c => c.toUpperCase())}</Text>
                  <Text style={styles.eventYear}>{moment(e.from).format('YYYY')}</Text>
                </View>

                <View style={{width: 150, alignItems: 'flex-end'}}>
                  <Text style={styles.eventTime}>{moment(e.from).format('HH:mm')} - {moment(e.till).format('HH:mm')}</Text>
                  <Text style={styles.eventLocationText}>{e.location.title ? e.location.title : '-'}</Text>
                </View>
              </View>

              <Text style={styles.eventCardDesc}>{this.getItemDescription(e.name)}</Text>
            </View>

          </TouchableOpacity>
        </View>
      ));
    }

    if(events && events.length > 0) {
      eventListItems = (
        <FlatList
          data={events}
          renderItem={({item, index}) => this.renderEventListItem(item, index)}
          keyExtractor={(item, index) => `${item.id}${index}`}
        />
      )
    } else {
      eventListItems = (
        <View style={{alignItems: 'center', marginBottom: 20}}>
          <Text style={styles.noEventTitle}>{textContent.emptyTitle}</Text>
          <Text style={styles.noEventSub}>{textContent.emptyBody}</Text>
          <Image source={require('../../assets/images/hir_esemeny_empty.png')} style={{width: 250, height: 125, marginTop: 15,}}/>
        </View>
      );
    }


    return (
      <View style={styles.container}>
        <PageHeader
          { ...this.props }
          pageTitle={textContent.screenTitle}
        />

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.content}
            stickyHeaderIndices={[3]}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
          >
            <Text style={styles.title}>{textContent.hamarosan}</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{paddingBottom: 10, paddingHorizontal: 10,}}>
              { comingEvents }
            </ScrollView>

            <Text style={styles.title}>{textContent.osszesevent}</Text>

            <View style={styles.filterRowBg}>
              <View style={styles.filterRow}>
                <View style={{ flex: 1, justifyContent: 'center', borderRightWidth: 1, borderColor: '#ededed', width: '50%' }}>
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
                              dateFilter: selectedDate,
                              formattedDateFilter: moment(selectedDate).format('YYYY.MM.DD'),
                            }, () => this.getFilteredEvents(selectedDate, locationFilter))
                          }
                        } catch ({code, message}) {
                          console.warn('Cannot open date picker', message);
                        }
                      } else {
                        this.setState({ datePickerModalVisible: true }, this.setDate(new Date()))}
                      }
                    }
                    style={styles.filterWrap} activeOpacity={0.8}
                  >
                    <Icon
                      name="date-range"
                      size={20}
                      color={formattedDateFilter ? "#c49565" : "#434656"}
                    />
                    <Text style={formattedDateFilter ? styles.filterTextActive : styles.filterTextInActive}>
                      {formattedDateFilter ? formattedDateFilter : textContent.dateBtn}
                    </Text>
                    { dateFilterClearBtn }
                  </TouchableOpacity>
                </View>

                <View style={{ position: 'absolute', right: 0, flex: 1, width: '50%'}}>
                  <TouchableOpacity
                    onPress={() => {
                      Platform.OS === 'android' ? this.setState({ singlePickerVisible: true}) : this.setState({ locationModalVisible: true })}
                    } 
                    style={styles.filterWrap} activeOpacity={0.8}
                  >
                    <CustomIcon
                      name="ic_location"
                      size={20}
                      color={locationFilter ? "#c49565" : "#434656"}
                    />
                    <Text
                      style={locationFilter ? styles.filterTextActive : styles.filterTextInActive}
                    >
                      { locationFilter ? this.sliceLocationFilter(locationFilter) : locationFilterPlaceholder }
                    </Text>
                    { locationFilterCancelBtn }
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={{marginBottom: 25}}>
              { refreshingEventsList ? <PageLoader textContent={textContent} /> : eventListItems }
            </View>

            <SinglePickerMaterialDialog
              title={textContent.pickerTitle}
              items={locations.map((row, index) => ({ value: index, label: row }))}
              visible={this.state.singlePickerVisible}
              selectedItem={this.state.selectedPickerItem}
              onCancel={() => this.setState({ singlePickerVisible: false })}
              onOk={async result => {
                // console.warn('selected', result.selectedItem);
                // await this.setState({ singlePickerVisible: false })
                await this.setState({
                  singlePickerVisible: false,
                  selectedPickerItem: result.selectedItem,
                  locationFilter: result.selectedItem && result.selectedItem.label !== "" ? result.selectedItem.label : null,
                }, () => this.getFilteredEvents(dateFilter, result.selectedItem.label))
                // this.getFilteredEvents(dateFilter, result.selectedItem.label)
                // this.setState({ singlePickerVisible: false }, () => {
                //   console.warn('result.selectedItem.label', result.selectedItem.label);
                // });
              }}
            />

            <Modal
              animationType="slide"
              transparent
              visible={this.state.datePickerModalVisible}
              onRequestClose={() => {
                this.getFilteredEvents(dateFilter, locationFilter);
              }}
              onDismiss={() => {
                this.getFilteredEvents(dateFilter, locationFilter);
              }}
            >
              <View style={{ flex: 1, height: '100%', width: '100%' }}>
                <View style={{ marginTop: 22, backgroundColor: '#fafafa', position: 'absolute', bottom: 0, zIndex: 1000, width: '100%',}}>
                  <DatePickerIOS
                    date={this.state.dateFilter ? this.state.dateFilter : new Date()}
                    onDateChange={(newDate) => this.setDate(newDate)}
                    locale="hu"
                    mode="date"
                  />
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
              transparent={false}
              visible={this.state.locationModalVisible}
              transparent
              onRequestClose={() => {
                this.getFilteredEvents(dateFilter, locationFilter);
              }}
              onDismiss={() => {
                this.getFilteredEvents(dateFilter, locationFilter);
              }}
            >
              <View style={{ backgroundColor: '#fafafa', borderWidth: 3, position: 'absolute', bottom: 0, width: '100%' }}>
                <Picker
                  selectedValue={locationFilter}
                  onValueChange={(itemValue) => this.setState({
                    locationFilter: itemValue === "" ? null : itemValue
                  })}
                >
                  <Picker.Item label="" value="" />
                  { locationPickers }
                </Picker>
                <TouchableOpacity
                  style={{position: 'relative', width: '100%', alignItems: 'center', justifyContent: 'center',}}
                  onPress={() => this.setState({ locationModalVisible: false }) }
                >
                  <Text style={{paddingHorizontal: 25, paddingVertical: 15, fontFamily: "Montserrat", fontSize: 18, fontWeight: "600", color: '#73beff', position: 'relative', zIndex: 1000, bottom: 10}}>Bezár</Text>
                </TouchableOpacity>
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
    flex: 1,
  },
  title: {
    fontFamily: "YoungSerif-Regular",
    fontSize: 26,
    color: '#434656',
    marginBottom: 15,
    marginTop: 15,
    paddingHorizontal: 10,
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
    marginBottom: 15,
  },
  eventsCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#eee',
    marginRight: 10,
    overflow: 'hidden',
  },
  imageBgBox: {
    height: 100,
    width: '100%',
    marginBottom: 10,
  },
  eventCard:{
    flex: 1,
    backgroundColor: '#fff',
  },
  eventCardDesc: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 10,
    fontFamily: "Montserrat",
    fontWeight: "bold",
    fontSize: 13,
    color: "#434656"
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
    fontSize: 12,
    fontWeight: '900',
    color: '#434656',
  },
  eventLocationText: {
    fontFamily: "Montserrat",
    fontSize: 12,
    fontWeight: 'bold',
    color: '#c49565',
  },
  filterRowBg: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 0,
    paddingHorizontal: 10,
    justifyContent: 'center',
    marginBottom: 15,
  },
  filterRow: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: '#ededed',
    backgroundColor: '#fff',
    position: 'relative',
    justifyContent: 'center',
    height: 55,
    paddingVertical: 5,
  },
  filterWrap: {
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
  eventListItem: {
    // borderWidth: 1,
    borderTopWidth: 1,
    borderTopColor: '#ededed',
    flexDirection: 'row',
    padding: 15,
    paddingLeft: 0,
    paddingRight: 0,
  },
  eventListItemDesc: {
    fontFamily: "Montserrat",
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  eventListItemText: {
    fontFamily: "Montserrat",
    fontSize: 10,
    fontWeight: "600",
    color: '#a3abbc',
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
  noEventTitle: {
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
  noEventSub: {
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
  cancelBtn: {
    padding: 5,
    // borderWidth: 2,
    height: 32,
  }
});
