/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,TouchableOpacity,Image,Dimensions
} from 'react-native';

const {width, height} = Dimensions.get('window');

const contents = [
  {resType: 1, count: 22},
  {resType: 4, count: 251},
  {resType: 2, count: 48}
];

export default class Cloud extends Component {
  render() {
    return (
      <View style={styles.container}>
        {this.renderContent()}
      </View>
    );
  }


  renderContent() {
    if(__DEV__){
      console.log('Cloud',contents)
    }
    return contents.map((content) => {
      if(content.resType==1){
        content.icon = require('../main/img/RelatedCourse.png');
        content.title = '精品课程';
      }if(content.resType==2){
        content.icon = require('../main/img/RelatedBaiKe.png');
        content.title = '课文解析';
      }if(content.resType==3){
        content.icon = require('../main/img/RelatedBook.png');
        content.title = '名师导读';
      }if(content.resType==4){
        content.icon = require('../main/img/RelatedAsk.png');
        content.title = '学霸交流';
      }

      if(__DEV__){
        console.log('Cloud',contents)
      }

      return (
        <TouchableOpacity key={content.resType} activeOpacity={0.5} onPress={() => {

        }}>
          {this.makeLog(content.title)}
          <View style={styles.innerViewStyle}>
            <Image source={require('../main/img/RelatedAsk.png')} style={styles.iconStyle} resizeMode={'stretch'}/>
            <Text style={{color: '#70bafa', marginTop: 3}}>{content.title}</Text>
            <Text style={{color: '#70bafa', marginTop: 3}}>{ '(' + content.count + ')'}</Text>
          </View>
        </TouchableOpacity>
      )
    });
  }

  makeLog(msgsd){
    console.log('has make log',msgsd);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  innerViewStyle: {
    width: width / 2 - 20,
    height: 240,
    marginLeft: 10,
    marginTop: 10,
    backgroundColor: '#ff9966'
  },
  iconStyle: {
    width: 60,
    height: 60
  },
});
