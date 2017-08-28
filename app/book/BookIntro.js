/**
 * Created by TaoLee on 2017/8/5.
 */
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import HTMLView from 'react-native-htmlview';
export default class BookIntro extends Component {
  render() {
    return (
      <ScrollView style={styles.content}>
        <Text style={styles.name}>图书名称:{this.props.name}</Text>
        <Text style={styles.name}>作        者:{this.props.author}</Text>
        <Text style={styles.name}>出  版  社:{this.props.publisher}</Text>
        <HTMLView
          value={this.props.content}
          stylesheet={styles}
        />
        <Image source={{uri: this.props.coverUrl}  } style={{height: 150, marginTop: 20,marginBottom:10}}/>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    paddingLeft: 24,
    paddingRight: 24,
  },
  name: {

    lineHeight: 30
  }
  , p: {
    lineHeight: 30
  }
});

