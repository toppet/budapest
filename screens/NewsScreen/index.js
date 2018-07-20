import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

import PageHeader from '../../components/PageHeader';

export default class NewsScreen extends Component {
  render() {
    return (
      <View style={styles.container}>

        <PageHeader {...this.props} />

        <View style={styles.content}>
          <Text style={styles.title}>Hírek</Text>  
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
    color: '#434656'
  },
});

