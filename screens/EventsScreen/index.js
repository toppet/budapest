import React, { Component } from 'react';
import _ from 'lodash';
import {
  View,
  Text,
  StyleSheet,
  Button,
  ImageBackground,
  ScrollView,
  Picker,
  TouchableOpacity,
  Modal,
  Image,
  SectionList,
} from 'react-native';
import PageHeader from '../../components/PageHeader';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import {  ListItem, Left, Body, Right, Title } from "native-base";

const latestEvents = [
  {
    id: 0,
    eventDesc: 'Legközelebbi esemény címe, amely ilyen hosszú lehet.',
    date: '2018-09-11',
    imageSrc: require('../../assets/images/budapest.jpg'),
    location: 'Budapest',
    startTime: '2018-09-11 08:00',
    endTime: '2018-09-11 17:00',
  },
  {
    id: 1,
    eventDesc: 'Ez meg pont egy masik esemeny, ami nemsokora lesz.',
    date: '2018-10-05',
    imageSrc: require('../../assets/images/budapest.jpg'),
    location: 'Jászfelsőszentgyörgy',
    startTime: '2018-09-11 12:00',
    endTime: '2018-09-11 17:00',
  },
  {
    id: 2,
    eventDesc: 'Ez meg mondjuk egy harmadik esemeny.',
    date: '2018-11-01',
    imageSrc: require('../../assets/images/budapest.jpg'),
    location: 'Kiskunszentmárton',
    startTime: '2018-09-11 12:00',
    endTime: '2018-09-11 17:00',
  },
  {
    id: 3,
    eventDesc: 'Ez lesz a negyedik.',
    date: '2019-12-24',
    imageSrc: require('../../assets/images/budapest.jpg'),
    location: 'Balatonakarattya',
    startTime: '2018-09-11 12:00',
    endTime: '2018-09-11 17:00',
  },
  {
    id: 4,
    eventDesc: 'Na még egyet a végére, hogy meglegyen az öt darab.',
    date: '2019-01-23',
    imageSrc: require('../../assets/images/budapest.jpg'),
    location: 'Budapest',
    startTime: '2018-09-11 12:00',
    endTime: '2018-09-11 17:00',
  },
];

// const listOfEvents = {
//   '2018-07-21': [
//     {
//       id: 0,
//       date: '2018-07-21',
//       time: '2018-07-21 16:00',
//       eventDesc: 'Az esemény címe, amely ennél is hosszabb lehet, körülbelül ennyire',
//       eventLoc: 'Dohány utcai Zsinagóga',
//       eventCity: 'Budapest',
//     },
//     {
//       id: 1,
//       date: '2018-07-21',
//       time: '2018-07-21 18:25',
//       eventDesc: 'Az esemény címe, amely ennél is hosszabb lehet, körülbelül ennyire',
//       eventLoc: 'Dohány utcai Zsinagóga',
//       eventCity: 'Budapest',
//     },
//   ],
//   '2018-08-05': [
//     {
//       id: 2,
//       date: '2018-08-05',
//       time: '2018-08-05 08:00',
//       eventDesc: 'Az esemény címe, amely ennél is hosszabb lehet, körülbelül ennyire',
//       eventLoc: 'Kiss Dobos utca',
//       eventCity: 'Balatonakarattya',
//     },
//     {
//       id: 3,
//       date: '2018-08-05',
//       time: '2018-08-05 13:00',
//       eventDesc: 'Az esemény címe, amely ennél is hosszabb lehet, körülbelül ennyire',
//       eventLoc: 'Kiss Dobos utca',
//       eventCity: 'Balatonakarattya',
//     },
//     {
//       id: 4,
//       date: '2018-08-05',
//       time: '2018-08-05 19:45',
//       eventDesc: 'Az esemény címe, amely ennél is hosszabb lehet, körülbelül ennyire',
//       eventLoc: 'Kiss Dobos utca',
//       eventCity: 'Balatonakarattya',
//     },
//   ],
// }

const eventList = [
  {
    title: '2018-07-23',
    data: [
      {
        id: 0,
        date: '2018-07-21',
        time: '2018-07-21 16:00',
        eventDesc: 'Az esemény címe, amely ennél is hosszabb lehet, körülbelül ennyire',
        eventLoc: 'Dohány utcai Zsinagóga',
        eventCity: 'Budapest',
      },
      {
        id: 1,
        date: '2018-07-22',
        time: '2018-07-22 17:30',
        eventDesc: 'Az esemény címe, körülbelül ilyen hosszu',
        eventLoc: 'Dohány utcai Zsinagóga',
        eventCity: 'Budapest',
      }
    ]
  },
  {
    title: '2018-08-01',
    data: [
      {
        id: 0,
        date: '2018-08-01',
        time: '2018-08-01 06:00',
        eventDesc: 'Az esemény címe, amely ennél is hosszabb lehet, körülbelül ennyire',
        eventLoc: 'Dohány utcai Zsinagóga',
        eventCity: 'Budapest',
      },
      {
        id: 1,
        date: '2018-08-01',
        time: '2018-08-01 10:30',
        eventDesc: 'Az esemény címe, körülbelül ilyen hosszu',
        eventLoc: 'Dohány utcai Zsinagóga',
        eventCity: 'Budapest',
      },
      {
        id: 2,
        date: '2018-08-01',
        time: '2018-08-01 12:30',
        eventDesc: 'Az esemény címe, körülbelül ilyen hosszu',
        eventLoc: 'Dohány utcai Zsinagóga',
        eventCity: 'Budapest',
      }
    ]
  }
]

export default class EventsScreen extends Component {
  constructor(props){
    super(props);  
    this.state = {
      locationFilter: 'Budapest',
      locations: [],
      locationModalVisible: false,
      datePickerModalVisible: false,
      eventListHeaders: [],
    }
  }

  componentWillMount() {
    // const tmpLocations = [];
    // const tmpEventHeaders = [];

    // latestEvents.map((e) => {
    //   if (tmpLocations.indexOf(e.location) === -1) {
    //     tmpLocations.push(e.location);
    //   }
    // });

    // listOfEvents.map((event) => {
    //   if(tmpEventHeaders.indexOf(event.date) === -1) {
    //     tmpEventHeaders.push(event.date);
    //   }
    // });

    // this.setState({ eventListHeaders: tmpEventHeaders , locations: tmpLocations }, () => console.log('eventListHeaders', tmpEventHeaders, 'locations', tmpLocations));
  }

  // renderItem = ({ item }) => {
  //   console.log(item);
  //   return (
  //     <ListItem style={{ marginLeft: 0 }}>
  //       <Body>
  //         <Text>{item.id} - {item.date}</Text>
  //       </Body>
  //     </ListItem>
  //   );
  //   // return <Text>Hello</Text>
  // }


  render() {
    const { locations, locationFilter } = this.state;
    const locationPlaceholder = "Összes";
    const tmpLocations = [];

    const events = latestEvents.map((e) => (
      <View style={[styles.cardShadow, { width: 315 }]} key={e.id}>
        <View style={styles.eventsCard}>
          
          <View style={styles.imageBgBox}>
            <ImageBackground source={e.imageSrc} style={{width: '100%', height: '100%'}}/>
          </View>

          <View style={styles.eventCard}>

            <View style={styles.eventCardInfoView}>
              <View style={styles.eventDayView}>
                <Text style={styles.eventDay}>{moment(e.date).format('DD')}</Text>
              </View>
              <View style={{flex: 1, marginRight: 'auto'}}>
                <Text style={styles.eventMonth}>{moment(e.date).format('MMMM').replace(/^\w/, c => c.toUpperCase())}</Text>
                <Text style={styles.eventYear}>{moment(e.date).format('YYYY')}</Text>
              </View>
              <View style={{width: 150, alignItems: 'flex-end'}}>
                <Text style={styles.eventTime}>{moment(e.startTime).format('HH:mm')} - {moment(e.endTime).format('HH:mm')}</Text> 
                <Text style={styles.eventLocationText}>{e.location}</Text> 
              </View>
            </View>

            <Text style={styles.eventCardDesc}>{e.eventDesc}</Text>

          </View>
        </View>
      </View>
    ));

    let locationPickers;
    let locationFilterCancelBtn = null;

    if(locations.length > 0) {
      locationPickers = locations.sort(function(a, b){
        if(a < b) return -1;
        if(a > b) return 1;
        return 0;
      }).map((l, i) => (
        <Picker.Item key={`${l}`} label={`${l}`} value={`${l}`} />
      ));
    }

    if(locationFilter !== locationPlaceholder) {
      locationFilterCancelBtn = (
        <TouchableOpacity onPress={() => this.setState({locationFilter: locationPlaceholder})}>
            <Icon name="cancel" size={20} />
        </TouchableOpacity>
      );
    }
    
    const eventListItems = (
      <SectionList
        renderItem={({item, index, section}) => (
          <TouchableOpacity key={index} activeOpacity={0.8} onPress={() => {console.log('item', item); this.props.navigation.navigate('EventDetail', { item })}} style={styles.eventListItem}>
            <View style={{flex: 1, paddingRight: 50}}>
              <Text style={styles.eventListItemDesc}>{item.eventDesc}</Text>
              <View style={{flexDirection: 'row'}}>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginRight: 20 }}>
                  <Icon name="watch-later" size={13} color="#73beff" style={{marginRight: 5}}/> 
                  <Text style={styles.eventListItemText}>{moment(item.time).format('HH:mm')}</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                  <Icon name="near-me" size={13} color="#c49565" style={{marginRight: 5}}/> 
                  <Text style={styles.eventListItemText}>{item.eventLoc}</Text>
                </View>
              </View>
            </View>
            <View style={{alignItems: 'center', justifyContent: 'center', width: 30, marginRight: 15}}>
              <Icon name="keyboard-arrow-right" size={25} color="#d8d8d8" />
            </View>
          </TouchableOpacity>
        )}
        renderSectionHeader={({section: {title}}) => (
          <Text style={styles.listItemHeaderText}>{moment(title).format('dddd - MMMM DD.')}</Text>
        )}
        // sections={[
        //   {title: 'title1', data: ['item1','item2']},
        //   {title: 'title2', data: ['item1','item2']}
        // ]}
        sections={eventList}
        keyExtractor={(item, index) => item.id + index}
      >
      </SectionList>
    )
    

    return (
      <View style={styles.container}>
        <PageHeader 
          { ...this.props }
          pageTitle="Események"
        />

          <ScrollView 
            showsHorizontalScrollIndicator={false}
            style={styles.content}
            // stickyHeaderIndices={[3]}
          >
            <Text style={styles.title}>Közelgő események</Text>
            <ScrollView horizontal showsVerticalScrollIndicator={false} style={{paddingBottom: 10}}>
              {events}
            </ScrollView>

            <Text style={styles.title}>Összes esemény</Text>

            <View style={styles.filterRow}>
              <View style={{flex: 1, padding: 10, borderRightWidth: 1, borderColor: '#ededed' }}>
                <TouchableOpacity onPress={() => this.setState({datePickerModalVisible: true})} style={styles.locationFilter}>
                  <Icon name="date-range" size={20} />
                  <Text style={[styles.locationFilterText, { color: '#434656'} ]}>Dátum</Text>
                </TouchableOpacity>
              </View>
              <View style={{flex: 1, padding: 10, marginLeft: 15,}}>
                <TouchableOpacity onPress={() => this.setState({locationModalVisible: true})} style={styles.locationFilter}>
                  <Image source={require('../../assets/images/fill204.png')}/>
                  <Text style={styles.locationFilterText}>{locationFilter.length > 10 ? `${locationFilter.slice(0,10)}...` : locationFilter}</Text>
                  {locationFilterCancelBtn}
                </TouchableOpacity>
              </View>
            </View>

            <View style={{marginBottom: 25}}>
              {eventListItems}
            </View>


            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.locationModalVisible}
              transparent
              onRequestClose={() => {
                alert('Modal has been closed.');
              }}>
              <View style={{marginTop: 22, backgroundColor: '#fafafa', position: 'absolute', bottom: 0, width: '100%' }}>
                <View>
                  <Picker
                    selectedValue={locationFilter}  
                    onValueChange={(itemValue, itemIndex) => this.setState({locationFilter: itemValue})}>
                    {/* <Picker.Item label="" value="" /> */}
                    {locationPickers}
                  </Picker>
                  <Button
                    title="Bezár"
                    onPress={() => this.setState({ locationModalVisible: false }) } />
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
    padding: 10,
  },
  title: {
    fontFamily: "YoungSerif",
    fontSize: 26,
    color: '#434656',
    marginBottom: 15,
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
    fontSize: 13
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
  filterRow: {
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 3,
    borderColor: '#ededed',
    backgroundColor: '#fff',
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 15,
  }, 
  locationFilter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationFilterText: {
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
  }
});

