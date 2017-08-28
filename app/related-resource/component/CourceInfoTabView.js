import React, { Component } from 'react';
import ScrollableTabView, {DefaultTabBar,ScrollableTabBar} from 'react-native-scrollable-tab-view';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  View,
  ListView,
} from 'react-native';

var Dimensions = require('Dimensions');
var ScreenWidth = Dimensions.get('window').width;

import CourseIntroduce from './CourceIntroduceList';
import CourceASK from './CourceASKList';

class TabTopView extends Component {

  constructor(props){
    super(props);
    this.state = {
      introduceData:new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2}),
    };
  }
  componentWillReceiveProps(nextProps){
    console.log(nextProps.introduceData),
    this.setState({
      introduceData:nextProps.introduceData,
    });
  }
  render() {
    return (
      <ScrollableTabView
        style={styles.container}
        renderTabBar={() => <DefaultTabBar />}
        tabBarUnderlineStyle={styles.lineStyle}
        tabBarActiveTextColor='#2FA7FF'>
        <View style={styles.textStyle} tabLabel='课程介绍'><CourseIntroduce introduceData = {this.state.introduceData} /></View>
        <View style={styles.textStyle} tabLabel='精品问答'><CourceASK resourceId = {this.props.resourceId}/></View>
      </ScrollableTabView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lineStyle: {
    width:ScreenWidth/2,
    height: 2,
    backgroundColor: '#2FA7FF',
  },
  textStyle: {
    flex: 1,
  },
});

export default TabTopView;