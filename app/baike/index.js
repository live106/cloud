/**
 * Created by TaoLee on 2017/7/28.
 */
import React, {Component} from 'react';
import {
  StyleSheet,
  Platform,
  TouchableOpacity,
  AsyncStorage,
  ToastAndroid,
  Image,
  Alert,
  Link,
  ScrollView,
  Text,
  View,
  FlatList,
  JsonUtils,
  Dimensions
} from 'react-native';
import {QMHeader} from 'qmkit';

import {msg} from 'iflux-native'
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view';
import BaiKeList from './component/BaiKeList'
import HTMLView from 'react-native-htmlview';
import BaiKeAsk from './component/BaiKeAsk'
import NetUtil  from '../util/NetUtil'
import {MenuContext} from 'react-native-popup-menu';
import Toast, {DURATION} from 'react-native-easy-toast'
let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height - 20;

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
let userId = '';
let BaiKeId = '';
class BaiKe extends Component {

  constructor(props) {
    super(props);
    this.state = {
      location: '',
      imageSetting: false,
      isOpen: false,
      /////
      extensionId: '',
      jumpToAsk: null,
      jsonData: [],
      courseItems: [],
      catalog: [],
      listData: [],
      itemOneList: [],
      baiKeTitle: '',
      baiKeFrom: ['人教版高中必修1第一单元']
    };
  }

  componentWillMount() {
    BaiKeId = this.props.resourceId;
    AsyncStorage.getItem('locate', (error, result) => {
      if (error) {
      } else {
        this.setState({location: result});
      }
    });
    AsyncStorage.getItem('id', (error, result) => {
      if (error) {
      } else {
        userId = result;
        this.initData()
      }
    });
  }

  initData = () => {
    console.log(userId + '@@@@@@@@@@@@@@@@@@@@' + this.props.resourceId);
    const urlPath = `/api/v1/baike/get-baike-detail?userId=${userId}&baiKeId=${this.props.resourceId}`;
    NetUtil.get(urlPath).then((json) => {
      if (json.code === 1000) {
        if (json.data.resourceContentExtensionBeanList !== null) {
          const courseItems = json.data.resourceContentExtensionBeanList.map((item, index) => {
            this.state.catalog.push(item.extensionName);
          });
          const catalog = this.state.catalog.map((item, index) => {
            let scroll = this.state.catalog.length - 1 === index ? this._flatList.scrollToEnd() : this._flatList.scrollToIndex({
              viewPosition: 0,
              index: index
            });
            return (
              <MenuOption
                customStyles={{
                  right: 0,
                  optionWrapper: {
                    backgroundColor: '#fff',
                    marginTop: 5,
                  },
                }}
                onSelect={() => scroll}
                key={index}>
                <Text style={{justifyContent: 'center', alignSelf: 'center'}}>{item}</Text>
              </MenuOption>
            );
          });
          if (json.data.resourceIntroduceTocBeanList !== null) {
            const itemOneList = json.data.resourceIntroduceTocBeanList.map((item, index) => {
              return (
                <View style={styles.chileRow} key={index}>
                  <Text style={styles.chileList}>{item.introduceChildrenTocName + ':'}
                    <Text style={styles.chileText}>{item.content}
                    </Text>
                  </Text>
                </View>
              );
            });
            this.setState({itemOneList: itemOneList});
          }
          this.setState({catalog: catalog});
        }
        this.setState({
          jsonData: json,
          courseItems: json.data.resourceContentExtensionBeanList,
          baiKeTitle: json.data.baiKeBean.title,
        });
        this.state.listData.push(this.state.jsonData);
        this.state.listData.push(this.state.courseItems);
        let baiKeFrom = [];
        if (json.data.baiKeBean.locationNames !== null) {
          for (let i = 0; i < json.data.baiKeBean.locationNames[0].length; i++) {
            console.log(json.data.baiKeBean.locationNames[0][i].locationName);
            baiKeFrom.push(json.data.baiKeBean.locationNames[0][i].locationName)
          }
          this.setState({baiKeFrom: baiKeFrom});
        } else {
        }
      }
      else {
        this.refs.toast.show('' + json.message);
      }
    });
  };

  jumpToAsk = (id) => {
    this.props.navigator.push(
      {
        component: BaiKeAsk,
        params: {
          baiKeId: BaiKeId,
          type: 4,
          extensionId: id,
        }
      }
    );
  };

  _flatList;
  _renderItem = (item) => {
    if (item.index === 0) {
      if (this.state.jsonData.data.resourceIntroduceTocBeanList !== null) {
        return (
          <View style={styles.item } key={item.index}>
            <View style={styles.title}>
              <Text style={styles.author}>{this.state.jsonData.data.baiKeBean.title}</Text>
            </View>
            <View style={styles.content}>
              <HTMLView
                value={this.state.jsonData.data.baiKeBean.introduce}
                STYLESHEET={styles}
              />
            </View>
            {this.state.itemOneList}
          </View>
        );
      }
    } else {
      let coll = item.item.isCollected === 1 ? '已收藏' : '收藏';
      return (
        <View style={styles.item} key={item.index}>
          <View style={styles.title}>
            <Text style={styles.author}>{item.item[0].extensionName}</Text>
            <TouchableOpacity style={styles.touchCollection} onPress={() => this.collection(coll, item.item[0].id)}>
              <Text style={styles.collection}>{coll}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.touch} onPress={() => {
              msg.emit('route:goToNext',
                {
                  sceneName: 'BaiKeAsk',
                  baiKeId: BaiKeId,
                  type: 4,
                  extensionId: item.item[0].id,
                });
            }}>
              <Text style={styles.ask}>提问</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.content}>
            <HTMLView
              value={item.item[0].content}
              STYLESHEET={styles}
            />
          </View>
        </View>
      );
    }
  };

  collection(coll, id) {
    if (coll === '已收藏') {
      this.refs.toast.show('已收藏');
    } else {
      const urlPath = `/api/v1/collection/add-baike`;
      const body = JSON.stringify({
        baiKeId: this.props.resourceId,
        extensionId: id,
        userId: userId
      });
      NetUtil.post(urlPath, body).then((json) => {
        if (json.code === 1000) {
          this.refs.toast.show('收藏成功');
          coll = '已收藏'
        } else {
          this.refs.toast.show('收藏失败' + json.message);
        }
      });
    }
  };

  render() {
    return (
      <MenuContext>
        <View style={styles.locateView}>
          <QMHeader title="百科详情"/>
          <View style={styles.titleView}><Text style={styles.textStyle}>百科标题：{this.state.baiKeTitle}</Text></View>
          <View style={styles.titleView}><Text style={styles.textStyle}>百科来源：{this.state.baiKeFrom}</Text></View>

          <ScrollableTabView
            style={styles.container}
            renderTabBar={() => <DefaultTabBar />}
            tabBarUnderlineStyle={styles.lineStyle}
            tabBarActiveTextColor='#2FA7FF'>
            <FlatList
              tabLabel='百科介绍'
              ref={(flatList) => this._flatList = flatList}
              data={this.state.listData}
              renderItem={this._renderItem}
              // getItemLayout={(data, index) => (
              //   // 120 是被渲染 item 的高度 ITEM_HEIGHT。
              //   {length: 120, offset: 120 * index, index}
              // )}
            >
            </FlatList>
            <BaiKeList
              tabLabel='百科问答'
              userId={userId}
              baikeId={BaiKeId}/>
          </ScrollableTabView>
          <TouchableOpacity
            onPress={this.imageSetting}
            style={[styles.bottom, {right: 0, bottom: 55}]}>
            <Menu
              onBackdropPress={() => {
              }}>
              <MenuTrigger ><Text style={styles.text}>目录</Text></MenuTrigger>
              <MenuOptions customStyles={{
                width: 100,
              }}>
                <MenuOption customStyles={{
                  backgroundColor: '#2FA7FF',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}><Text style={{justifyContent: 'center', alignSelf: 'center', color: '#333'}}>百科目录</Text></MenuOption>
                {this.state.catalog}
              </MenuOptions>
            </Menu>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this._flatList.scrollToOffset({animated: true, offset: 0})}
            style={[styles.bottom, {right: 0, bottom: 10}]}>
            <Text style={styles.text}> 置顶</Text>
          </TouchableOpacity>
        </View>
        <Toast ref="toast"/>
      </MenuContext>
    )
  }
}


const styles = StyleSheet.create({

  navScan: {
    width: 25,
    height: 25,
    marginTop: Platform.OS === ' ios' ? 20 : 0,
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
  container: {
    flex: 1,
    marginTop: 10
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
    color: '#333',
    fontSize: 15,
    textAlign: 'center',
  },
  titleView: {
    height: 35,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    borderTopColor: '#E5E5E5',
    borderTopWidth: 1, justifyContent: 'center',
  },
  bottom: {
    position: 'absolute',
    backgroundColor: '#2FA7FF',
    height: 40,
    width: 45,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
    color: '#fff',
  },
  ////
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 29,
    paddingRight: 20,
    height: 30,
    backgroundColor: '#2FA7FF',

  }, chileRow: {
    marginLeft: 24,
    marginRight: 24,
    marginBottom: 26,
  },
  chileList: {
    textAlign: 'left'
  },
  chileText: {
    color: '#2FA7FF',
  },
  author: {
    color: '#ffffff',
    flex: 3
  },
  collection: {
    alignSelf: 'center',
    color: 'white',
    textAlign: 'center',
  },
  touchCollection: {
    alignSelf: 'center',
    borderRadius: 0,
    marginRight: 5,
    borderWidth: 1,
    borderColor: '#ffffff',
    flex: 1,
  },
  touch: {
    alignSelf: 'center',
    borderRadius: 0,
    borderWidth: 1,
    borderColor: '#ffffff',
    flex: 1,
  },
  ask: {
    alignSelf: 'center',
    color: 'white',
    textAlign: 'center',
  },
  item: {
    margin: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',

  },
  p: {
    lineHeight: 40,
    fontSize: 15
  }
  , content: {
    marginTop: 26,
    marginLeft: 24,
    marginRight: 24,
    marginBottom: 26,
  }

});
export default BaiKe;
