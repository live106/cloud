/**
 * Created by TaoLee on 2017/8/5.
 */
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  AsyncStorage,
  Alert,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import {msg} from 'iflux-native';
import {QMHeader} from 'qmkit';


import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view';
import BookIntro from './BookIntro';
import BaiKeAsk from '../baike/component/BaiKeAsk'
import BookList from './BookList';
import NetUtil  from '../util/NetUtil'
import EpubReader from '../epub-reader/index'
import Toast, {DURATION} from 'react-native-easy-toast'

let ebookId = '';
let userId = '';
let Dimensions = require('Dimensions');
let ScreenWidth = Dimensions.get('window').width;

class Book extends Component {

  constructor(props) {
    super(props);
    this.state = {
      location: '七年级上册第一单元第一课《春》',
      jsonData: [],
      coverResourceId: '',
      bookName: '',
      isCollected: '2',
      locateC: '',
      author: '',
      bookUrl: ''
    };
  }

  componentWillMount() {
    ebookId = this.props.resourceId;
    AsyncStorage.getItem('id', (error, result) => {
      if (error) {
        this.refs.toast.show(error);
      } else {
        userId = result;
      }
    });
    AsyncStorage.getItem('locate', (error, result) => {
      if (error) {
        this.refs.toast.show(error);
      } else {
        this.setState({location: result});
      }
    });
    AsyncStorage.getItem('locateCode', (error, result) => {
      if (error) {
        this.refs.toast.show(error);
      } else {
        this.setState({locateC: result});
        this.initData();
        this.getBookUrl();
      }
    });
  }

  initData() {
    const url = '/api/v1/ebook/get-detail?userId=' + userId + '&eBookId=' + ebookId;
    NetUtil.get(url).then((json) => {
      if (json.code === 1000) {
        this.setState({
          jsonData: json.data,
          coverResourceId: json.data.coverUrl,
          isCollected: json.data.isCollected,
          author: json.data.authors,
        });
        console.log(json.data.isCollected + '##############################' + this.state.isCollected)
      } else {
        this.refs.toast.show(json.message);
      }
    }, (json) => {
      this.refs.toast.show('获取数据失败');
    })
  }

  getBookUrl() {
    console.log(userId + '##############################' + ebookId)
    const url = `/api/v1/ebook/query-download-info?userId=${userId}&eBookId=${ebookId}`;
    NetUtil.get(url).then((json) => {
      if (json.code === 1000) {
        this.setState({
          bookUrl: json.data.ebookUrl,
        });
        console.log('############213##################' + json.data.ebookUrl)
      } else {
        this.refs.toast.show(json.message);
      }
    }, (json) => {
      this.refs.toast.show('获取数据失败');
    })
  }

  collection = () => {
    if (this.state.isCollected === 1) {
      this.refs.toast.show('已经收藏过啦');
    } else {
      const urlPath = `/api/v1/collection/ebook-insert`;
      const body = JSON.stringify({
        ebookId: ebookId,
        userId: userId,
      });
      NetUtil.post(urlPath, body).then((json) => {
        if (json.code === 1000) {
          this.setState({isCollected: 2});
          this.refs.toast.show('收藏成功');
        } else {
          this.setState({isCollected: 1});
          this.refs.toast.show('收藏失败' + json.message);
        }
      })
    }
  };

  render() {
    return (
      <View style={styles.locateView}>
        <QMHeader title="图书详情"/>
        <Image style={styles.bookCover}
               source={{uri: this.state.coverResourceId}}/>
        <Text style={styles.textStyle}>图书来源：{this.state.location}</Text>
        <ScrollableTabView
          style={styles.container}
          renderTabBar={() => <DefaultTabBar />}
          tabBarUnderlineStyle={styles.lineStyle}
          tabBarActiveTextColor='#2FA7FF'>
          <BookIntro tabLabel='图书介绍'
                     name={this.state.jsonData.name}
                     author={this.state.jsonData.authors }
                     content={this.state.jsonData.introduce}
                     coverUrl={this.state.jsonData.author}
                     publisher={'人民出版社'}
          />
          <BookList tabLabel='图书问答'
                    userId={userId}
                    ebookId={ebookId}
          />
        </ScrollableTabView>
        <View style={styles.bottom}>
          <TouchableOpacity
            onPress={
              () => {
                msg.emit('route:goToNext', {sceneName: 'BaiKeAsk', ebookId: ebookId, type: 2})
              }
            }
            style={{alignItems: 'center', flex: 1,}}>
            <Text style={styles.buttonLeft}>
              我要提问
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              msg.emit('route:goToNext', {sceneName: 'EpubReader', url: this.state.bookUrl,})
            }}
            style={{alignItems: 'center', flex: 1, backgroundColor: '#2FA7FE'}}>
            <Text style={styles.buttonRight}>
              立即阅读
            </Text>
          </TouchableOpacity>
        </View>
        <Toast ref="toast"/>
      </View>
    )
  }
}


const styles = StyleSheet.create({

  navScan: {
    width: 25,
    height: 25,
    marginTop: Platform.OS === 'ios' ? 20 : 0,
    justifyContent: 'center'
  },
  topInputStyle: {
    color: '#333333',
    width: ScreenWidth * 0.71,
    marginTop: Platform.OS === 'ios' ? 18 : 0,
    textAlign: 'center',
    fontSize: 18,
  },
  rightNavViewStyle: {
    flexDirection: 'row',
    height: 64,
    alignItems: 'center'
  },
  navSave: {
    width: 25,
    height: 25,
    marginTop: Platform.OS === 'ios' ? 20 : 0,
    justifyContent: 'center'
  },
  locateView: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  bottom: {
    borderTopColor: '#d6d7da',
    borderTopWidth: 1,
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  buttonLeft: {
    flex: 1,
    textAlignVertical: 'center',
    fontSize: 16,
    marginTop: 10,
    justifyContent: 'center'
  },
  buttonRight: {
    fontSize: 16,
    textAlignVertical: 'center',
    marginTop: 10,
    flex: 1
  },
  bookCover: {
    resizeMode: 'contain',
    height: 191
  },
  container: {
    flex: 1,
    marginTop: 10
  }, send: {
    height: 25,
    width: 25,
    marginRight: 14
  },
  image: {
    height: 26,
    width: 20,
    marginLeft: 25
  },
  lineStyle: {
    width: ScreenWidth / 2,
    height: 2,
    backgroundColor: '#2FA7FF',
  },
  textStyle: {
    borderLeftColor: '#ffffff',
    borderRightColor: '#ffffff',
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    fontSize: 15,
    marginTop: 10,
    textAlignVertical: 'center',
    height: 40,
    textAlign: 'center',
  },
});
export default Book;
