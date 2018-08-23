import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Image,
    ScrollView,
    Modal,
} from 'react-native';
import PageHeader from '../../components/PageHeader';
import Icon from 'react-native-vector-icons/MaterialIcons';
import _ from 'lodash';

import * as AddCalendarEvent from 'react-native-add-calendar-event';

import { LocaleConfig, Agenda, Calendar, CalendarList } from 'react-native-calendars';
import moment from 'moment';

import textContentJSON from './calendarScreenTrans.json';

LocaleConfig.locales['hu'] = {
  monthNames: ['Január','Február','Március','Április','Május','Június','Július','Augusztus','Szeptember','Október','November','December'],
  monthNamesShort: ['Jan.','Febr.','Marc.','Apr.','Máj.','Jún.','Júl.','Aug.','Szept.','Okt.','Nov.','Dec.'],
  dayNames: ['Vasárnap','Hétfő', 'Kedd','Szerda','Csütörtök','Péntek','Szombat'],
  dayNamesShort: ['V','H','K','Sz','Cs','P','Szo']
};

LocaleConfig.locales['en'] = {
  monthNames: ['January','February','March','April','May','June','July','August','September','October','November','December'],
  dayNamesShort: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
};

const dateFormat = "YYYY-MM-DD";

export default class CalendarScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: {},
      calendarModalVisible: false,
      filteredEvents: null,
    };
  }

  componentDidMount() {
    const startDate = moment(new Date()).format(dateFormat);
    const endDate = moment().endOf("month").format(dateFormat);
    this.fetchData(startDate, endDate);
  }

  async fetchData(startDateParam, endDateParam) {
    const { items, markedDates } = await this.getEvents(startDateParam, endDateParam);
    const todaysjDate = await this.getJDate(moment().format(dateFormat));

    this.setState({
      reset: false,
      items,
      markedDates,
      todaysjDate,
    });
  }

  async getSelectedDayData(day) {
    const filteredEvents = await this.getEventsForToday(day.dateString);
    const jDate = await this.getJDate(day.dateString);

    this.setState({ 
      calendarModalVisible: true, 
      selectedDate: day.dateString,
      filteredEvents,
      jDate,
    });
  }

  async getEvents(startDate, endDate) {
    const monthDate = moment(startDate).startOf('month');
    const currentDate = moment().format(dateFormat);

    if (monthDate.isBefore(currentDate)) {
      startDate = currentDate;
    }

    return await fetch(`https://jewps.hu/api/v1/calendar?startDate=${startDate}&endDate=${endDate}`)
      .then(response => response.json())
      .then(responseJson => {
          if (responseJson.success) {
            const markedDates = {};              
            const daysInMonth = [];
            
            const prayerEvent = { key:'prayerEvent', color: '#cfd0df' };
            const eventEvent = { key:'eventEvent', color: '#6ce986' };
            const holidayEvent = { key:'holidayEvent', color: '#ff7070' };
            
            _.times(monthDate.daysInMonth(), function (n) {
              daysInMonth.push(`${startDate.slice(0,7)}-${monthDate.format('DD')}`); 
              monthDate.add(1, 'day');
            });
            
            _.forEach(daysInMonth, (day) => markedDates[day] = { dots: [], disabled: true, disableTouchEvent: true });

            responseJson.data.forEach((date) => {
              const key = moment(date.start).format(dateFormat);
              let tmpDots = markedDates[key] && markedDates[key].dots ? markedDates[key].dots : [];

              if (markedDates[key]) {
                if (date.type === 1) {
                  if(_.includes(tmpDots, eventEvent) === false) {
                    tmpDots.push(eventEvent);
                  }
                }

                if (date.type === 2) {
                  if(_.includes(tmpDots, prayerEvent) === false) {
                    tmpDots.push(prayerEvent);
                  }
                }

                if (date.type === 3) {
                  if(_.includes(tmpDots, holidayEvent) === false) {
                    tmpDots.push(holidayEvent);
                  }
                }
              }

              markedDates[key] = { dots: [...tmpDots], marked: true, id: date.id, disabled: false, disableTouchEvent: false };
            });
            
            return { items: responseJson.data, markedDates };
          }
      })
      .catch((error) => {
        console.error(error);
      })
    }

  async getJDate(dayDate) {
    const jDate = await fetch(`https://jewps.hu/api/v1/utils/date/${dayDate}`)
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson.success ? responseJson.data.date : null;
      })
      .catch((error) => {
        return null;
      });

    return jDate;
  }

  renderEmptyDate() {
    return null;
  }

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }

  async getEventsForToday(day) {
    const filteredEvents = _.filter(this.state.items, (item) => item.start.slice(0,10) === day);
    
    return filteredEvents;
  }

  renderCalendarArrows(direction) {
    return direction === 'left' ? <Icon name="keyboard-arrow-left" size={25} color="#c49565" /> : <Icon name="keyboard-arrow-right" size={25} color="#c49565"/>
  }

  addToCalendar(item) {
    // console.log('item', item);
    const eventConfig = {
      title: item.name,
      startDate: moment(item.start).format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
      allDay: '',
    };

    if (item.end) {
      eventConfig.endDate = moment(item.end).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
    }

    if(item.type === 2) {
      eventConfig.endDate = moment(eventConfig.startDate).add(1, 'hour');
    }

    if(moment(item.start).format('HH:mm') === '00:00') {
      eventConfig.allDay = true;
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
        console.warn(error);
      });
  }

  render() {
      const { filteredEvents } = this.state;
      
      let filteredEventItems = null;

      let textContent =  textContentJSON.hu;
      moment.locale('hu');
      LocaleConfig.defaultLocale = 'hu';
      
      if(this.props.screenProps.settingsEng) {
        textContent = textContentJSON.en;
        moment.locale('en');
        LocaleConfig.defaultLocale = 'en';
      }
      
      if (filteredEvents) {
        filteredEventItems = filteredEvents.map((item) => {
          let eventStyle = styles.eventEvent;
          let startTime = null;
          let endTime = '';

          if(item.type === 2) {
            eventStyle = styles.prayerEvent;
          }

          if(item.type === 3) {
            eventStyle = styles.holidayEvent;
          }

          if (item.start) {
            startTime = moment(item.start).format('HH:mm') === "00:00" ? textContent.wholeDayEventText : moment(item.start).format('HH:mm');
          }

          if (item.end) {
            endTime = ` - ${moment(item.end).format('HH:mm')}`;
          }

          return (
            <View key={item.id} >
              <View style={[styles.item, { height: item.height}, eventStyle]}>
                <View style={{marginTop: 5, width: '85%'}}>
                  <Text style={styles.itemText}>{item.name}</Text>
                </View>
                <View style={{marginTop: 5}}>
                  <TouchableOpacity onPress={() => this.addToCalendar(item)} activeOpacity={0.8}>
                    <Icon size={30} name="today" color="#73BEFF"/>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{marginTop: 5}}>
                <Text style={styles.itemSubText}>{`${textContent.eventTime}: ${startTime}${endTime}`}</Text>
              </View>
            </View>
          )
        });
      }

      return (
          <View style={styles.container}>
            <PageHeader
              { ...this.props }
              pageTitle="Naptár"
            />

            <View style={styles.pageTitleRow}>
              <Text style={styles.pageTitle}>{moment().format('MMMM DD.').replace(/^\w/, c => c.toUpperCase())}</Text>
              <TouchableOpacity 
                onPress={() => {
                  this.setState({
                    reset: true,
                  });
                  const startDate = moment().startOf('month').format(dateFormat);
                  const endDate = moment().endOf('month').format(dateFormat);
                  this.fetchData(startDate, endDate);
                }}
                style={styles.currentBtn}
                activeOpacity={0.8}
              >
                <Text style={styles.currentBtnText}>{textContent.currentBtnText}</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.todaysJDate}>
              <View style={{ backgroundColor: '#ededed', marginRight: 10, paddingHorizontal: 7, paddingVertical: 5, borderRadius: 6}}>
                <Image source={require('../../assets/images/shape.png')} size={25} />
              </View>
              <Text style={styles.todaysJDateText}>{this.state.todaysjDate}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <View style={styles.infoWrap}>
                <Text style={[styles.infoCircle, { backgroundColor: '#6ce986' }]}></Text>
                <Text style={styles.infoText}>{textContent.infoTextEvent}</Text>
              </View>
              
              <View style={styles.infoWrap}>
                <Text style={[styles.infoCircle, { backgroundColor: '#a3abbc' }]}></Text>
                <Text style={styles.infoText}>{textContent.infoTextPrayer}</Text>
              </View>
              
              <View style={styles.infoWrap}>
                <Text style={[styles.infoCircle, { backgroundColor: '#ff7070' }]}></Text>
                <Text style={styles.infoText}>{textContent.infoTextHoliday}</Text>
              </View>
            </View>

            <View style={{ flex: 1 }}>
              <Calendar
                current={this.state.reset ? moment().format(dateFormat) : ''}
                minDate={moment().format(dateFormat)}
                hideExtraDays={true}
                onDayPress={(day) => this.getSelectedDayData(day)}
                monthFormat={'yyyy. MMMM'}
                // Handler which gets executed when visible month changes in calendar. Default = undefined
                onMonthChange={(month) => {
                  const startDate = moment(month.dateString).startOf('month').format(dateFormat);
                  const endDate = moment(startDate).endOf('month').format(dateFormat);
                  this.fetchData(startDate, endDate);
                }}
                renderArrow={(direction) => this.renderCalendarArrows(direction)}
                firstDay={1}
                displayLoadingIndicator={true}
                markedDates={this.state.markedDates}
                markingType={'multi-dot'}
                theme={{
                  textMonthFontFamily: 'Montserrat',
                  textMonthFontWeight: 'bold',
                  textDayFontFamily: 'Montserrat',
                  monthTextColor: '#c49565',
                  dotColor: '#c49565',
                  selectedDayBackgroundColor: '#c49565',
                  todayTextColor: '#73beff',
                  textMonthFontSize: 18,
                  textDayFontSize: 13,
                }}
              />

              <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.calendarModalVisible}
                onRequestClose={() => {}}
              >
                <View style={styles.calendarModalView}>
                  <View style={{flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center'}}>
                    <TouchableOpacity
                      onPress={() => this.setState({calendarModalVisible: false})}
                      style={{ marginRight: 'auto' }}
                    >
                      <Icon size={30} name="clear" style={styles.close} />
                    </TouchableOpacity>

                    <View style={{ marginRight: 'auto', marginBottom: 5, }}>
                        <Text style={styles.selectedDateNum}>{moment(this.state.selectedDate).format('YYYY. MMMM DD.')}</Text>
                        <Text style={styles.selectedDateText}>{moment(this.state.selectedDate).format('dddd')}</Text>
                    </View>
                  </View>

                  <View style={styles.modalTodaysJDate}>
                    <View style={{ backgroundColor: '#ededed', marginRight: 10, paddingHorizontal: 7, paddingVertical: 5, borderRadius: 6}}>
                      <Image source={require('../../assets/images/shape.png')} size={25} />
                    </View>
                    <Text style={[styles.todaysJDateText, { color: '#434656' }]}>{this.state.jDate}</Text>
                  </View>

                  <ScrollView style={styles.calendarModalScrollView} showsVerticalScrollIndicator={false}>                
                    <View>
                      { filteredEventItems }
                    </View>
                  </ScrollView>
                </View>
              </Modal>

            </View>
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
  pageTitleRow: {
    marginTop: 30,
    marginBottom: 15,
    paddingHorizontal: 15,
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between'
  },
  pageTitle: {
    fontSize: 25,
    fontFamily: "YoungSerif-Regular",
    // marginTop: 30,
    // marginBottom: 15,
    color: '#434656',
  },
  item: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 10,
    marginRight: 10,
    marginTop: 17,
    borderRadius: 5,
  },
  itemText: {
    fontFamily: 'YoungSerif-Regular',
    fontSize: 17,
    color: '#434656',
    marginBottom: 5,
  },
  itemSubText: {
    fontFamily: "Montserrat",
    fontSize: 14,
    marginTop: 3,
    fontWeight: '600',
    fontStyle: "normal",
    color: '#A3ABBC',
    marginBottom: 10,
    paddingLeft: 5,
  },
  emptyDate: {
    height: 15,
    flex:1,
    paddingTop: 30
  },
  noNewsTitle: {
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 15,
    fontFamily: "YoungSerif",
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
    fontFamily: "YoungSerif",
    fontSize: 14,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: '#A3ABBC',
    textAlign: 'center',
  },
  calendarModalView: {
    flex: 1,
    height: '100%',
    backgroundColor: '#f7f7f7',
    padding: 15,
    paddingTop: 35,
  },
  calendarModalScrollView: {
    backgroundColor: '#f7f7f7',
  },
  selectedDateNum: {
    fontFamily: "Montserrat",
    fontSize: 22,
    fontWeight: "900",
    fontStyle: "italic",
    textAlign: "center",
    color: '#c49565',
  },
  selectedDateText: {
    fontFamily: "Montserrat",
    fontSize: 18,
    fontWeight: "600",
    fontStyle: "normal",
    color: '#434656',
    textAlign: 'center'
  },
  eventEvent: {
    borderLeftWidth: 4,
    borderLeftColor: '#6ce986',    
  },
  prayerEvent: {
    borderLeftWidth: 4,
    borderLeftColor: '#cfd0df',
  },
  holidayEvent: {
    borderLeftWidth: 4,
    borderLeftColor: '#ff7070',
  },
  todayBtn: {
    borderWidth: 1,
    borderColor: '#ededed',
    padding: 15,
  },
  todaysJDate: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 15,
  },
  modalTodaysJDate: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 15,
    marginVertical: 15,
    marginLeft: -25,
  },
  todaysJDateText: {
    fontFamily: "YoungSerif-Regular",
    fontSize: 16,
    fontWeight: "600",
    fontStyle: "normal",
    color: '#a3abbc',
    textAlign: 'center'
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 25,
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  infoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  infoCircle: {
    width: 8, 
    height:8, 
    overflow: 'hidden', 
    // borderWidth: 1, 
    borderRadius: 4,
    marginRight: 5, 
  },
  infoText: {
    fontFamily: "Montserrat",
    fontSize: 14,
    fontWeight: "400",
    fontStyle: "italic",
    color: '#a3abbc'
  },
  currentBtn: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: '#ededed',
    borderRadius: 6,
  },
  currentBtnText: {
    fontFamily: "Montserrat",
    fontSize: 14,
    fontWeight: "600",
    fontStyle: "normal",
    color: '#c49565'
  },
});
