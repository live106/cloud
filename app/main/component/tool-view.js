import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  ListView,
  Image,
  Platform,
  View,
  TouchableOpacity,
  Alert,
  AsyncStorage,
  Dimensions
} from 'react-native';


import {
  msg,
} from 'iflux-native';

const {width} = Dimensions.get('window');

const toolData = {
  "data": [
    {
      icon: require('../img/RelatedCourse.png'),
      title: '精品课程',
    },
    {
      icon: require('../img/RelatedBaiKe.png'),
      title: '课文解析',
    },
    {
      icon: require('../img/RelatedBook.png'),
      title: '名师导读',
    },
    {
      icon: require('../img/RelatedAsk.png'),
      title: '学霸交流',
    },
  ],
};

//  一些常量设置
const cols = 2;
const cellWH = 140;
const vMargin = (width - cellWH * cols) / (cols + 1);
const hMargin = 15;


class HomeToolView extends Component {

  itemClickAction = (sectionID) => {
    this.props.pushResource(sectionID);
  };

  render() {
    const {courseCount, baiKeCount, bookCount, askCount} = this.props;

    return (
      <View>
        <View style={{flexDirection: 'row'}}>
          {this.resourceView(toolData.data[0].icon, toolData.data[0].title, courseCount, 0)}
          {this.resourceView(toolData.data[1].icon, toolData.data[1].title, baiKeCount, 2)}
        </View>
        <View style={{flexDirection: 'row'}}>
          {this.resourceView(toolData.data[2].icon, toolData.data[2].title, bookCount, 1)}
          {this.resourceView(toolData.data[3].icon, toolData.data[3].title, askCount, 3)}
        </View>
      </View>
    );
  };

  resourceView = (icon, title, count, rowID) => {
    return (
      <View>
        <TouchableOpacity activeOpacity={0.5} onPress={() => {
          this.itemClickAction(rowID)
        }}>
          <View style={styles.innerViewStyle}>
            <Image source={icon} style={styles.iconStyle}/>
            <Text style={{color: '#70bafa', marginTop: 3}}>{title}</Text>
            <Text style={{color: '#70bafa', marginTop: 3}}>{ '(' + count + ')'}</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  innerViewStyle: {
    width: cellWH,
    height: cellWH,
    marginLeft: vMargin,
    marginTop: hMargin,
    //  居中
    alignItems: 'center'
  },
  iconStyle: {
    width: 60,
    height: 60
  },
  listViewStyle: {
    flexDirection: 'row',
    //  多行显示
    flexWrap: 'wrap'
  },
});

export default HomeToolView;