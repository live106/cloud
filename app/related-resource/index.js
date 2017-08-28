import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Alert,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
  ScrollView,
} from 'react-native';
import ScrollableTabView, {DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';
import Icon from 'react-native-vector-icons/EvilIcons';
import Map from '../map'
import {QMHeader} from 'qmkit';

import {
  msg,
  connectToStore
} from 'iflux-native';
import appStore from './store';

import RelatedCource from './tab1/index';
import Book from '../book/index'
import RelatedCourceInfo from '../related-cource-info/index';
import RelatedBookList from "../book/RelatedBookList";
import RelatedBaiKe from "../baike/component/RelatedBaiKe";
import AskQuestionHome from '../ask-question/index'
import AskQuetionVC from '../ask-question/AskQuetionVC'
import AskInfo from '../ask-question/ASKInfo'

const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');

class RelatedResources extends Component {

  render() {
    const store = appStore.data();
    return (
      <View style={styles.container}>
        <QMHeader
          title="相关资源"
          renderRight={() => {
            this._renderRight();
          }
          }/>
        <ScrollableTabView
          initialPage={Number(this.props.sourceItem)}
          style={styles.container}
          renderTabBar={() => <DefaultTabBar />}
          tabBarUnderlineStyle={styles.lineStyle}
          tabBarActiveTextColor='#2FA7FF'>
          <View
            style={styles.textStyle}
            tabLabel='精品课程'>
            <RelatedCource pushCourseInfo={(id, uuserid) => {
              msg.emit('route:goToNext', {sceneName: 'RelatedCourceInfo', resourceId: id, userId: uuserid})
            }}/>
          </View>
          <View style={styles.textStyle} tabLabel='名师导读'>
            <RelatedBookList pushBook={(id) => {
              msg.emit('route:goToNext', {sceneName: 'Book', resourceId: id})
            }}
            />
          </View>
          <View style={styles.textStyle} tabLabel='课文解析'>
            <RelatedBaiKe pushBaiKe={(id) => {
              msg.emit('route:goToNext', {sceneName: 'BaiKe', resourceId: id})
            }}
            />
          </View>
          <View style={styles.textStyle} tabLabel='学霸交流'>
            <AskQuestionHome
              pushAskQuestion={() => {
                msg.emit('route:goToNext', {sceneName: 'AskQuetionVC', fresh: this.freshAction})
              }}
              pushAskInfo={(AskId) => {
                msg.emit('route:goToNext', {sceneName: 'AskInfo', questionId: AskId});
              }}
              // freshAction={this.state.freshAction}
              freshId={store.get('freshId')}/>
          </View>
        </ScrollableTabView>
      </View>
    );
  };

  componentDidMount() {
    appStore.cursor().set('currentCourse',this.props.currentCourse);
    // this.setState({
    //   currentCourse: this.props.currentCourse
    // })
  }

  _renderRight() {
    return (
      <View style={styles.rightNavViewStyle}>
        <TouchableOpacity onPress={() => {
          msg.emit('route:goToNext', {sceneName: 'Map'})
        }}>
          <Icon name="location" size={40} color="#2FA7FF" style={styles.navSave}/>
        </TouchableOpacity>
      </View>
    )
  }

  freshAction = (id) => {
    appStore.cursor().set('freshId',id);
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navTitle: {
    color: 'white',
    flex: 1,
    marginTop: Platform.OS == 'ios' ? 18 : 0,
  },
  topInputStyle: {
    color: '#333333',
    width: width * 0.71,
    marginTop: Platform.OS == 'ios' ? 18 : 0,
    textAlign: 'center',
    fontSize: 18,
  },
  rightNavViewStyle: {
    flexDirection: 'row',
    height: 64,
    alignItems: 'center'
  },
  btnAsk: {
    backgroundColor: 'rgb(46,167,255)',
    height: 49,
    width: width,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnAskText: {
    color: '#ffffff',
  },
  navScan: {
    width: 25,
    height: 25,
    marginTop: Platform.OS == 'ios' ? 20 : 0,
    justifyContent: 'center'
  },
  navSave: {
    marginTop: Platform.OS == 'ios' ? 20 : 0,
    justifyContent: 'center'
  },
  lineStyle: {
    width: width / 4,
    height: 2,
    backgroundColor: '#2FA7FF',
  },
});
export default connectToStore(appStore)(RelatedResources);