import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  ScrollView,
  ListView,
  Image,
  Platform,
  View,
  TouchableOpacity,
  Alert,
  WebView,
  AsyncStorage
} from 'react-native';

import {QMHeader} from 'qmkit'
import HTMLView from 'react-native-htmlview';
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';
import Toast, {DURATION} from 'react-native-easy-toast'

const Dimensions = require('Dimensions');
const screenWidth = Dimensions.get('window').width;
const {width, height} = Dimensions.get('window');

import AskVC from '../related-resource/component/CourseAskVC';

import NetUtil from '../util/NetUtil';
import TabView from '../related-resource/component/CourceInfoTabView';
import {msg} from 'iflux-native'

const collectSelect = require('../img/collectedState.png');
const collectNormal = require('../related-resource/component/Resources/Image/collectNormal.png');

//  一些常量设置
const cols = 2;
const cellWH = 120;
const vMargin = (screenWidth - cellWH * cols) / (cols + 1);
const hMargin = 25;

export default class RelatedCourceInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      introduceData: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      saveState: 2,
      courseContentID: null,
      extensionId: null,
      videoID: null,
      playauth: null,
      coverImage: null
    };
  }

  getVideoHtml(vid, playauth, coverImage) {
    let source;
    const _source = resolveAssetSource(require('../related-resource/component/video.html'));
    if (__DEV__) {
      source = {uri: `${ _source.uri}&vid=${vid}&playauth=${playauth}&coverImage=${coverImage}`};
      return source;
    } else {
      const sourceAndroid = {uri: `file:///android_asset/video.html?vid=${vid}&playauth=${playauth}&coverImage=${coverImage}`};
      const sourceIOS = {uri: `file://${ _source.uri}?vid=${vid}&playauth=${playauth}&coverImage=${coverImage}`};
      source = Platform.OS === 'ios' ? sourceIOS : sourceAndroid;
      return source;
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <QMHeader title="课程详情"/>
        <WebView
          style={styles.playerView}
          source={this.getVideoHtml(this.state.videoID, this.state.playauth, this.state.coverImage)}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          scalesPageToFit={false}
          allowsInlineMediaPlayback={false}
          mediaPlaybackRequiresUserAction={false}
        />
        <View style={{flex: 1}}>
          <TabView introduceData={this.state.introduceData} resourceId={this.props.resourceId}/>
        </View>
        <TouchableOpacity onPress={() => {
          msg.emit('route:goToNext', {
            sceneName: 'AskVC',
            extensionId: this.state.courseContentID,
            resourceId: this.props.resourceId,
          })
        }}>
          <View style={styles.btnAsk}>
            <Text style={styles.btnAskText}>我要提问</Text>
          </View>
        </TouchableOpacity>
        <Toast ref="toast" fadeInDuration={1000}/>
      </View>
    )
  };

  componentWillMount() {
    this.getCourceInfo();
  }

  //  获取CourseID
  getCourceInfo() {
    const userId = this.props.userId;
    const courseId = this.props.resourceId;

    const pathUrl = '/api/v1/course/get-course-detail?userId=' + userId + '&courseId=' + courseId;
    NetUtil.get(pathUrl)
      .then((responseData) => {
        console.log(responseData)
        console.log(responseData.data.courseContentBeanList[0].id);
        console.log(responseData.data.courseContentBeanList[0].id);
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseData.data),
          introduceData: responseData.data.courseContentBeanList,
          courseContentID: responseData.data.courseContentBeanList[0].id,
          videoID: responseData.data.courseContentBeanList[0].resourceId,
          coverImage: responseData.data.courseContentBeanList[0].imgUrls[0],
          saveState: responseData.data.isCollected,
        });
        console.log(this.state.courseContentID)
        this.getPlayAuth();
      })
      .catch((error) => {
        console.log(error);
      })
  }

  // 获取播放令牌
  getPlayAuth() {
    var videoID = this.state.videoID;
    console.log(videoID);
    NetUtil.get('/api/v1/course/get-play-auth?videoId=' + videoID)
      .then((responseData) => {
        console.log(responseData);
        this.setState({
          playauth: responseData.data
        });
        console.log(this.state.playauth);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  getObject(key, callback) {
    AsyncStorage.getItem(key, (error, object) => {
      if (error) {
        console.log('Error:' + error.message);
      } else {
        callback(object);
      }
    })
  }

  // 收藏
  saveAction = (userId) => {
    console.log(this.state.courseContentID + '');
    var body = JSON.stringify({
      "courseContentId": this.state.courseContentID,
      "courseId": this.props.resourceId,
      "userId": userId
    });
    NetUtil.post('/api/v1/collection/course-insert', body)
      .then((responseData) => {
        if (responseData.code === 1000) {
          this.refs.toast.show('收藏成功');
          this.getCourceInfo();
        } else {
          this.refs.toast.show(responseData.message);
        }
      })
      .catch((error) => {
        console.log(error);
        this.refs.toast.show('收藏失败');
      });
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  playerView: {
    width: screenWidth,
    height: 190,
  },

  navTitle: {
    color: 'white',
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 18 : 0,
  },
  topInputStyle: {
    color: '#333333',
    width: screenWidth * 0.71,
    marginTop: Platform.OS === 'ios' ? 18 : 0,
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
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnAskText: {
    color: '#ffffff',
  },
  navScan: {
    width: 25,
    height: 25,
    marginTop: Platform.OS === 'ios' ? 20 : 0,
    justifyContent: 'center'
  },
  navSave: {
    width: 25,
    height: 25,
    marginTop: Platform.OS === 'ios' ? 20 : 0,
    justifyContent: 'center'
  }
});
module.exports = RelatedCourceInfo;


