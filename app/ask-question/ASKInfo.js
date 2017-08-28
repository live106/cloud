import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  TouchableOpacity,
  ListView,
  Alert,
  AsyncStorage,
  Dimensions
} from 'react-native';
import {QMHeader} from 'qmkit'

const {width, height} = Dimensions.get('window');

import Toast, {DURATION} from 'react-native-easy-toast';
import NetUtil from '../util/NetUtil';
import AskAnswer from './ask-answer';
import Netutil from '../util/NetUtil'
import moment from 'moment';

var collectNormal = require('../img/collectNor.png');
var collectSelect = require('../img/collectSelect.png');

export default class ASKInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      askInfoData: null,
      aaskListData: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      askIcon: null,
      askName: null,
      askTime: null,
      askTitle: null,
      askDescribe: null,
      askSource: null,
      resCategory: null
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <QMHeader title="问答详情"/>
        <View style={styles.infoView}>
          <View style={{flexDirection: 'row'}}>
            <Image source={{uri: String(this.state.askIcon)}}
                   style={{width: 41, height: 41, borderRadius: 41, marginTop: 14, marginLeft: 27}}/>
            <View style={{marginTop: 14, marginLeft: 12}}>
              <View style={{flexDirection: 'row'}}>
                <Text style={{fontSize: 15}}>{this.state.askName}</Text>
                {/*<Text style={{marginLeft: 12}}>{this.state.askTime}</Text>*/}
                <Text style={{marginLeft: 12}}>{(moment(this.state.askTime).format("YYYY/MM/DD HH:mm"))}</Text>
              </View>
              <Text>{this.state.askTitle}</Text>
            </View>
          </View>
          <View style={ styles.askDescribe}>
            <Text style={{marginLeft: 30}}>{'问题描述:' + this.state.askDescribe}</Text>
          </View>
          <View style={ styles.askSource}>
            <Text style={{marginLeft: 30}}>{'问题来源:' + this.state.askSource}</Text>
          </View>
          <View style={styles.askSource}>
            <Text style={{marginLeft: 30}}>{'问题位置:' + this.getAskPosition(this.state.resCategory)}</Text>
          </View>
        </View>
        <View style={{height: 40, justifyContent: 'center', marginLeft: 27}}>
          <Text >最新回答</Text>
        </View>
        <ListView
          dataSource={this.state.aaskListData}  // 数据源
          renderRow={this.renderRow}
        />
        <TouchableOpacity onPress={() => {
          this.ansWerAction()
        }}>
          <View style={styles.btnAsk}>
            <Text style={styles.btnAskText}>我要回答</Text>
          </View>
        </TouchableOpacity>
        <Toast ref="toast" fadeInDuration={1000}/>
      </View>
    );
  }

  //问题位置处理
  getAskPosition = (resCategory)=> {
    if (resCategory === 1) {
      return '课程'
    } else if (resCategory === 2) {
      return '图书'
    } else if (resCategory === 4) {
      return '百科'
    } else if (resCategory === 5) {
      return '问题'
    }
  };

  ansWerAction = ()=> {
    this.props.navigator.push(
      {
        component: AskAnswer,
        params: {
          questionId: this.props.questionId,
          fresh: this.freshAction
        },
      }
    );
  };
  freshAction = ()=> {
    this.loadInfoData();
    this.getUseId('id', this.loadAnswerList);
  };

  renderRow = (rowData, sectionID, rowID, highlightRow) => {
    return (
      <TouchableOpacity activeOpacity={0.5}>
        <View style={styles.cellView}>
          <View style={{flexDirection: 'row',}}>
            <Image source={{flex: 1, uri: rowData.avatarUrl.replace('http', 'https')}}
                   style={{width: 41, height: 41, borderRadius: 45, marginTop: 15, marginLeft: 27,}}/>
            <Text style={{fontSize: 15, flex: 2, marginTop: 20}}>{rowData.userName}</Text>
            <Text style={{
              flex: 2,
              marginLeft: 5,
              marginTop: 20
            }}>{(moment(rowData.createTime).format("YYYY/MM/DD HH:mm"))}</Text>

            <View style={{flex: 1, alignItems: 'flex-end'}}>
              <TouchableOpacity onPress={() => {
                this.getObject(rowData.answerId, 'id', this.saveAction)
              }}>
                <Image source={this.getCollectImage(rowData.isCollected)}
                       style={{width: 21, height: 21, marginTop: 10, marginRight: 10, resizeMode: 'cover'}}/>
              </TouchableOpacity>
            </View>
          </View>
          <View style={ styles.askDescribe}>
            <Text style={{marginLeft: 30}}>{rowData.answerContent}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  getCollectImage = (isCollected)=> {
    if (isCollected === 2) {
      return collectNormal;
    } else {
      return collectSelect;
    }
  }
  //获取数据
  getObject(askId, key, callback) {
    AsyncStorage.getItem(key, (error, object) => {
      if (error) {
        console.log('Error:' + error.message);
      } else {
        callback(object, askId);
      }
    })
  };

  getUseId = (key, callback)=> {
    AsyncStorage.getItem(key, (error, object) => {
      if (error) {
        // console.log('Error:' + error.message);
        callback(key);
      } else {
        callback(object);
      }
    })
  };

  //  收藏
  saveAction = (userId, ansWerId) => {
    var body = JSON.stringify({
      "answerId": ansWerId,
      "questionId": this.props.questionId,
      "userId": userId
    });
    console.log(body)
    Netutil.post('/api/v1/collection/qa-insert', body)
      .then((responseData) => {
        console.log(responseData.code);
        if (responseData.code == 1000) {
          this.refs.toast.show('收藏成功!');
          //  刷新数据
          this.getUseId('id', this.loadAnswerList);
        } else {
          this.refs.toast.show(responseData.message);
        }
      })
      .catch((error) => {
        console.log(error);
        Alert.alert('Error');
      })
  };

  componentWillMount() {
    this.loadInfoData();
    this.getUseId('id', this.loadAnswerList);
  }

  //  获取问题详情
  loadInfoData = () => {
    let quetionId = this.props.questionId;
    console.log(quetionId);
    NetUtil.get('/api/v1/qa/get-question-detail?questionId=' + quetionId)
      .then((responseData) => {
        console.log(responseData.data);
        this.setState({
          askInfoData: responseData.data,
          askIcon: responseData.data.avatarUrl.replace('http', 'https'),
          askName: responseData.data.userName,
          askTime: responseData.data.createTime,
          askTitle: responseData.data.title,
          askDescribe: responseData.data.description,
          askSource: responseData.data.source,
          resCategory: responseData.data.resCategory
        });
      })
      .catch((error) => {
        console.log(error);
        Alert.alert('Error');
      });
  };
  //  获取回答列表
  loadAnswerList = (user) => {
    let quetionId = this.props.questionId;
    const userId = user
    console.log(quetionId);
    const urlPath = '/api/v1/qa/get-all-answer?userId=' + userId + '&questionId=' + quetionId;
    NetUtil.get(urlPath)
      .then((responseData) => {
        console.log(responseData.data);
        this.setState({
          aaskListData: this.state.aaskListData.cloneWithRows(responseData.data),
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cellView: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    marginTop: 8,
    marginBottom: 8,
  },
  infoView: {
    borderBottomWidth: 5,
    borderBottomColor: '#E5E5E5',
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
  askDescribe: {
    borderTopWidth: 0.05,
    borderTopColor: '#E5E5E5',
    marginTop: 8,
    marginBottom: 12
  },
  askSource: {
    borderTopWidth: 0.05,
    borderTopColor: '#E5E5E5',
    marginBottom: 12
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
});

