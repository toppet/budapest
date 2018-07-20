import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Picker,
} from 'react-native';
import PageHeader from '../../components/PageHeader';
export default class EventsScreen extends Component {
  state = {
    language: '',
  }

  render() {
    return (
      <View style={styles.container}>
        <PageHeader { ...this.props } />

          <View style={styles.content}>
            <Text style={styles.title}>Közelgő események</Text>
            <Picker
              selectedValue={this.state.language}
              style={{ height: 50, width: 100 }}
              onValueChange={(itemValue, itemIndex) => this.setState({language: itemValue})}>
              <Picker.Item label="Java" value="java" />
              <Picker.Item label="JavaScript" value="js" />
            </Picker>
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
  content: {
    padding: 10,
  },
  title: {
    fontFamily: "YoungSerif",
    fontSize: 26,
    color: '#434656',
  },
});

