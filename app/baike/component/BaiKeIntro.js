/**
 * Created by TaoLee on 2017/8/1.
 */
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  AsyncStorage,
  ScrollView,
} from 'react-native';
import HTMLView from 'react-native-htmlview';
import NetUtil  from '../../util/NetUtil'
let userId = '';

export default class BaiKeIntro extends Component {
  constructor(props) {
    super(props);
    this.state = {
      extensionId: '',
      jumpToAsk: null,
      courseItemsOne: [],
      courseItems: [],
      catalog: [],

    };
  }

  componentWillMount() {
    AsyncStorage.getItem('id', (error, result) => {
      if (error) {
      } else {
        userId = result;
        this.initData()
      }
    });
  }

  initData() {
    console.log('333333333333333333333333' + userId + '&baiKeId=5993a96002862324d190bcef');
    const urlPath = '/api/v/baike/get-baike-detail?userId=599395cb02862321fc59c806&baiKeId=5993a96002862324d190bcef'//+ this.props.baikeId+'';
    NetUtil.get(urlPath).then((json) => {
      if (json.code === 1000) {
        console.log('百客介绍获取成功');
        const courseItems = json.data.resourceContentExtensionBeanList.map((item, index) => {
          this.state.catalog.push(item.extensionName);
          return (
            <View style={styles.item} key={index}>
              <View style={styles.title}>
                <Text style={styles.author}>{item.extensionName}</Text>
                <TouchableOpacity style={styles.touchCollection} onPress={() => this.collection()}>
                  <Text style={styles.collection}>收藏</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.touch} onPress={() => {
                  this.back()
                }}>
                  <Text style={styles.ask}>提问</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.content}>
                <HTMLView
                  value={item.content}
                  STYLESHEET={styles}
                />
              </View>
            </View>
          );
        });
        const courseItemsOne = [1].map((item, index) => {
          return (
            <View style={styles.item } key={index}>
              <View style={styles.title}>
                <Text style={styles.author}>{json.data.baiKeBean.title}</Text>
              </View>
              <View style={styles.content}>
                <HTMLView
                  value={json.data.baiKeBean.introduce}
                  STYLESHEET={styles}
                />
              </View>
              {json.data.resourceIntroduceTocBeanList.map((item, index) => {
                return (
                  <View style={styles.chileRow} key={index}>
                    <Text style={styles.chileList}>{item.introduceChildrenTocName + ':'}
                      <Text style={styles.chileText}>{item.content}
                      </Text>
                    </Text>
                  </View>
                );
              })
              }
            </View>
          );
        });
        this.setState({courseItemsOne: courseItemsOne});
        this.setState({courseItems: courseItems});
      }
      else {
        this.refs.toast.show('' + json.message);
      }
    });
  }

  back() {
    this.props.jumpToAsk()
  }

  collection() {
    const urlPath = `/api/v1/collection/add-baike`;
    const body = JSON.stringify({
      baiKeId: this.state.baiKeId,
      extensionId: this.state.extensionId,
      userId: userId
    });
    NetUtil.post(urlPath).then((json) => {
      if (json.code === 1000) {
        this.refs.toast.show('收藏成功');
      }
    });

  };

  render() {
    return (
      <ScrollView style={styles.container}>
        {this.state.jsonData}
        {this.state.courseItems}
      </ScrollView>
    )
  }
}

let Dimensions = require('Dimensions');
let ScreenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
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
    flex: 3
  },
  container: {
    flex: 1
  },
  collection: {
    alignSelf: 'center',
    color: 'white',
    textAlign: 'center',
  },
  lineStyle: {
    width: ScreenWidth / 2,
    height: 2,
    backgroundColor: '#2FA7FF',
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

