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

LocaleConfig.locales['hu'] = {
  monthNames: ['Január','Február','Március','Április','Május','Június','Július','Augusztus','Szeptember','Október','November','December'],
  monthNamesShort: ['Jan.','Febr.','Marc.','Apr.','Máj.','Jún.','Júl.','Aug.','Szept.','Okt.','Nov.','Dec.'],
  dayNames: ['Vasárnap','Hétfő', 'Kedd','Szerda','Csütörtök','Péntek','Szombat'],
  dayNamesShort: ['V','H','K','Sz','Cs','P','Szo']
};

LocaleConfig.defaultLocale = 'hu';
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
    this.getEvents(startDate, endDate);
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
            // const responseData = responseJson.data;
            if (responseJson.success) {
              const markedDates = {};              
              const daysInMonth = [];
             
              _.times(monthDate.daysInMonth(), function (n) {
                daysInMonth.push(`${startDate.slice(0,7)}-${monthDate.format('DD')}`); 
                monthDate.add(1, 'day');
              });
              
              _.forEach(daysInMonth, (day) => markedDates[day] = { disabled: true, disableTouchEvent: true });

              responseJson.data.forEach((date) => {
                const key = moment(date.start).format(dateFormat);
                markedDates[key] = { marked: true, id: date.id, disabled: false, disableTouchEvent: false };
              });
              
              this.setState({ items: responseJson.data, markedDates });
            }
        })
        .catch((error) => {
            console.error(error);
        })
  }
  // renderItem(item) {
  //   return (
  //     <View >
  //       <View style={[styles.item, {height: item.height}]}>
  //         <View style={{marginTop: 5, width: '85%'}}>
  //           <Text style={styles.itemText}>{item.name}</Text>
  //         </View>
  //         <View style={{marginTop: 5}}>
  //         <TouchableOpacity onPress={() => console.log('Add this to calendar', item)} activeOpacity={0.8}>
  //           <Icon size={30} name="today" color="#73BEFF"/>
  //         </TouchableOpacity>
  //         </View>
  //       </View>
  //       <View style={{marginTop: 5}}>
  //         <Text style={styles.itemSubText}>{item.desc}</Text>
  //       </View>
  //     </View>
  //   );
  // }

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

  getEventsForToday(day) {
    const filteredEvents = _.filter(this.state.items, (item) => item.start.slice(0,10) === day);
    
    this.setState({ filteredEvents });
  }

  renderCalendarArrows(direction) {
    return direction === 'left' ? <Icon name="keyboard-arrow-left" size={25} color="#c49565" /> : <Icon name="keyboard-arrow-right" size={25} color="#c49565"/>
  }

  render() {
      const { filteredEvents } = this.state;
      let filteredEventItems = null;
      
      if (filteredEvents) {
        filteredEventItems = filteredEvents.map((item) => {
          let eventStyle = styles.eventEvent;
          let startTime = null;
          let endTime = null;

          if(item.type === 2) {
            eventStyle = styles.prayerEvent;
          }

          if(item.type === 3) {
            eventStyle = styles.simpleEvent;
          }

          if (item.start) {
            startTime = moment(item.start).format('HH:mm');
          }

          if (item.end) {
            endTime = ` - ${moment(item.end).format('HH:mm')}`;
          }

          return (
            <View key={item.id} style={eventStyle}>
              <View style={[styles.item, {height: item.height}]}>
                <View style={{marginTop: 5, width: '85%'}}>
                  <Text style={styles.itemText}>{item.name}</Text>
                </View>
                <View style={{marginTop: 5}}>
                  <TouchableOpacity onPress={() => console.log('Add this to calendar', item)} activeOpacity={0.8}>
                    <Icon size={30} name="today" color="#73BEFF"/>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{marginTop: 5}}>
                <Text style={styles.itemSubText}>Időpont: {startTime}{endTime}</Text>
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
            <Text style={styles.pageTitle}>Válasszon napot!</Text>
            <View style={{ flex: 1 }}>
              <Calendar
                minDate={moment().format(dateFormat)}
                hideExtraDays={true}
                onDayPress={(day) => {
                  this.setState({ calendarModalVisible: true, selectedDate: day.dateString }, this.getEventsForToday(day.dateString))
                }}
                monthFormat={'yyyy MMMM'}
                // Handler which gets executed when visible month changes in calendar. Default = undefined
                onMonthChange={(month) => {
                  const startDate = moment(month.dateString).startOf('month').format(dateFormat);
                  const endDate = moment(startDate).endOf('month').format(dateFormat);
                  this.getEvents(startDate, endDate);
                }}
                renderArrow={(direction) => this.renderCalendarArrows(direction)}
                firstDay={1}
                displayLoadingIndicator
                markedDates={this.state.markedDates}
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
                onRequestClose={() => {
                  alert('Modal has been closed.');
                }}>
                <View style={styles.calendarModalView}>
                  <TouchableOpacity
                    onPress={() => this.setState({calendarModalVisible: false})}
                  >
                    <Icon size={30} name="clear" style={styles.close} />
                  </TouchableOpacity>
                  <View style={{ marginBottom: 5 }}>
                      <Text style={styles.selectedDateNum}>{moment(this.state.selectedDate).format('YYYY. MMMM DD.')}</Text>
                      <Text style={styles.selectedDateText}>{moment(this.state.selectedDate).format('dddd')}</Text>
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
  pageTitle: {
    fontSize: 25,
    fontFamily: "YoungSerif-Regular",
    paddingLeft: 15,
    marginTop: 30,
    marginBottom: 15,
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
    
  },
  prayerEvent: {
    // borderWidth: 2,
    // borderColor: '#f00',
  },
  simpleEvent: {}
});
