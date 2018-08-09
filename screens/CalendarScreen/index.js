import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import PageHeader from '../../components/PageHeader';
import Icon from 'react-native-vector-icons/MaterialIcons';

import * as AddCalendarEvent from 'react-native-add-calendar-event';

import { LocaleConfig, Agenda } from 'react-native-calendars';

LocaleConfig.locales['hu'] = {
  monthNames: ['Január','Február','Március','Április','Május','Június','Július','Augusztus','Szeptember','Október','November','December'],
  monthNamesShort: ['Jan.','Febr.','Marc.','Apr.','Máj.','Jún.','Júl.','Aug.','Szept.','Okt.','Nov.','Dec.'],
  dayNames: ['Hétfő','Kedd','Szerda','Csütörtök','Péntek','Szombat','Vasárnap'],
  dayNamesShort: ['V','H','K','Sz','Cs','P','Szo']
};

LocaleConfig.defaultLocale = 'hu';

export default class CalendarScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: {}
    };
  }



  loadItems(day) {
    setTimeout(() => {
      // for (let i = -15; i < 85; i++) {
      //   const time = day.timestamp + i * 24 * 60 * 60 * 1000;
      //   const strTime = this.timeToString(time);
      //   if (!this.state.items[strTime]) {
      //     this.state.items[strTime] = [];
      //     const numItems = Math.floor(Math.random() * 5);
      //     for (let j = 0; j < numItems; j++) {
      //       this.state.items[strTime].push({
      //         name: 'Esemény ' + strTime,
      //         height: Math.max(50, Math.floor(Math.random() * 150))
      //       });
      //     }
      //   }
      // }
      //console.log(this.state.items);
      const newItems = {
        '2018-08-09': [{ name: 'Esemény 2018-08-09 - 1' }, { name: 'Esemény 2018-08-09' }],
        '2018-08-10': [{ name: 'Esemény 2018-08-10 - 1' }, { name: 'Esemény 2018-08-10' }],
        '2018-08-11': [{ name: 'Esemény 2018-08-11 - 1' }, { name: 'Esemény 2018-08-11' }],
        '2018-08-12': [{ name: 'Esemény 2018-08-12 - 1' }, { name: 'Esemény 2018-08-12' }],
        '2018-08-13': [{ name: 'Esemény 2018-08-13 - 1' }, { name: 'Esemény 2018-08-13' }],
        '2018-08-14': [{ name: 'Esemény 2018-08-14 - 1' }, { name: 'Esemény 2018-08-14' }],
      };

      // Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
      this.setState({
        items: newItems
      });
    }, 1000);
    // console.log(`Load Items for ${day.year}-${day.month}`);
  }

  renderItem(item) {
    return (
      <View style={[styles.item, {height: item.height}]}>
        <View style={{marginTop: 5}}>
          <Text style={styles.itemText}>{item.name}</Text>
        </View>
        <View style={{marginTop: 5}}>
        <TouchableOpacity onPress={() => console.log('Add this to calendar', item)} activeOpacity={0.8}>
          <Icon size={30} name="today" color="#73BEFF"/>
        </TouchableOpacity>
        </View>
      </View>
    );
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

  render() {
      return (
          <View style={styles.container}>
            <PageHeader
              { ...this.props }
              pageTitle="Naptár"
            />
            <Text style={styles.pageTitle}>Válasszon napot!</Text>
            <View style={{ flex: 1 }}>
              <Agenda
                items={this.state.items}
                loadItemsForMonth={this.loadItems.bind(this)}
                renderItem={this.renderItem.bind(this)}
                renderEmptyDate={this.renderEmptyDate.bind(this)}
                rowHasChanged={this.rowHasChanged.bind(this)}
                firstDay={1}
                monthFormat={'yyyy. MMMM'}
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
    fontSize: 20,
    fontFamily: "YoungSerif-Regular",
    paddingLeft: 15,
    marginTop: 15,
    marginBottom: 15,
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
    fontSize: 18,
    color: '#434656',
  },
  emptyDate: {
    height: 15,
    flex:1,
    paddingTop: 30
  }
});
