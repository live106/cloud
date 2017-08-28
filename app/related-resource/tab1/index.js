import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
  ScrollView,
  ListView,
  AsyncStorage,
  Dimensions
} from 'react-native';

import {msg,connectToStore} from 'iflux-native'
import appStore from './store';

const screenWidth = Dimensions.get('window').width;
//  一些常量设置
const cols = 2;
const cellWH = 140;
const vMargin = (screenWidth - cellWH * cols) / (cols + 1);
const hMargin = 10;

class Tab1 extends Component {

  componentDidMount(){
    msg.emit('tab1:init');
  }

  render() {
    const store = appStore.data();
    if(__DEV__){
      console.log('Tab1',store);
    }

    if (store.get('noData') === false) {
      return (
        <ListView
          dataSource={store.get('dataSource')}
          renderRow={this.renderRow}
          contentContainerStyle={styles.listViewStyle}
          removeClippedSubviews={false}
        >
        </ListView>
      );
    } else {
      return (
        <View style={{flex: 1, alignItems: "center", justifyContent: "center"} }><Text
          style={{alignItems: 'center', marginTop: 300}}>暂无数据</Text></View>
      );
    }
  };

  //  单独的cell
  renderRow = (rowData) => {
    const store = appStore.data();
    return (
      <TouchableOpacity activeOpacity={0.5} onPress={() => {
        this.pushCourceInfoAction(rowData.id,window.id);
      }}>
        <View style={styles.innerViewStyle}>
          <Image source={{uri: rowData.coverUrl.replace('http', 'https')}} style={styles.iconStyle}/>
          <Text style={styles.courseName}>{rowData.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  pushCourceInfoAction = (id,userid) => {
    this.props.pushCourseInfo(id,userid);
  };
}

const styles = StyleSheet.create({
  innerViewStyle: {
    width: cellWH,
    height: cellWH,
    marginLeft: vMargin,
    marginTop: hMargin,
    //  居中
    alignItems: 'center',
    borderWidth:1,
    borderColor:'#e5e5e5',
    borderTopWidth:0
  },
  iconStyle: {
    resizeMode:'stretch',
    width: 150,
    height: 120,

  },
  listViewStyle: {
    //  改变主轴的方向
    flexDirection: 'row',
    //  多行显示
    flexWrap: 'wrap'
  },
  courseName: {
    height: 60
  }
});
export default connectToStore(appStore)(Tab1);
