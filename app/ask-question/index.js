import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ListView,
  Image,
  AsyncStorage,
  Dimensions
} from 'react-native';

import NetUtil from '../util/NetUtil';
import moment from 'moment';
import  {DeviceEventEmitter} from 'react-native';

import {
  SwRefreshScrollView,
  SwRefreshListView,
  RefreshStatus,
  LoadMoreStatus
} from 'react-native-swRefresh'

const screenWidth = Dimensions.get('window').width;
let _page = 0;


export default class TSListC extends Component {

  _dataSource = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});

  constructor(props) {
    super(props);
    this.state = {
      // _dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      listItems: [],
      curListItem: [],
      noData: true,
      freshAction: null
    }
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      freshAction: nextProps.freshAction,
    });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.freshId !== undefined && nextProps.freshId !== this.props.freshId) {
      this.freshAction()
    }
  }

  freshAction = ()=> {
    this.getSecondStorage('id', 'locateCode', this.getAskList);
    this.subs
  };

  //  上拉加载
  _onLoadMore(end) {
    if (this._page === 0) {
      this._page++;
      end()
    } else {
      let timer = setTimeout(() => {
        // clearTimeout(timer);
        // this._page++;
        // this.getObject(this._page);
        // for (let i = 0; i < this.state.curListItem.length; i++) {
        //   this.state.listItems.push(this.state.curListItem[i])
        // }
        // // this.setState({
        // //   listItems: data,
        // // });
        // end()//加载成功后需要调用end结束刷新 假设加载4页后数据全部加载完毕
        // // this.refs.listView.endLoadMore(this.state.curListItem < 2)


        this.refs.listView.endRefresh();
        end()
      }, 500)
    }
  }

  //  下拉刷新
  _onListRefresh(end) {
    let timer = setTimeout(() => {
      // clearTimeout(timer);
      // this._page = 0;
      // this.getObject(this._page);
      // console.log('resetStatus')
      // this.refs.listView.resetStatus();//重置上拉加载的状态
      // end()//刷新成功后需要调用end结束刷新
      // console.log('end');
      // this.refs.listView.endRefresh() //建议使用end() 当然 这个可以在任何地方使用
      this.refs.listView.endRefresh();
      end()
    }, 500)
  }

  askListView() {
    if (this.state.noData) {
      return (
        <View style={{flex: 1, alignItems: "center", justifyContent: "center"} }><Text
          style={{alignItems: 'center', marginTop: 300}}>暂无数据</Text></View>
      );
    } else {
      return (
        <SwRefreshListView
          dataSource={ this._dataSource.cloneWithRows(this.state.listItems)}
          ref="listView"
          renderRow={this._renderRow.bind(this)}
          onRefresh={this._onListRefresh.bind(this)}
          onLoadMore={this._onLoadMore.bind(this)}
          pusuToLoadMoreTitle={'上拉加载更多'}
          nomoredatatitle={'我是有底线的'}
          loadingTitle={'加载中···'}
        />
      );
    }
  }

  render() {
    return (
      <View >
        <View style={{marginBottom: 49, height: 573}}>
          {this.askListView()}
        </View>
        <TouchableOpacity onPress={()=> {
          this.askAction()
        }}>
          <View style={styles.btnAsk}>
            <Text style={styles.btnAskText}>我要提问</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  //  返回具体的cell
  _renderRow = (rowData, sectionID, rowID, highlightRow) => {
    return (
      <TouchableOpacity activeOpacity={0.5} onPress={()=> {
        this.pushAskInfo(rowData.questionId)
      }}>
        <View>
          <View style={styles.cellView}>
            <View style={{flexDirection: 'row'}}>
              <Image source={{uri: this.dealImage(rowData.avatarUrl)}}
                     style={{width: 41, height: 41, borderRadius: 41, marginTop: 14, marginLeft: 27}}/>
              <View style={{marginTop: 14, marginLeft: 12}}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{fontSize: 15}}>{rowData.userName}</Text>
                  <Text style={{marginLeft: 12}}>{(moment(rowData.createTime).format("YYYY/MM/DD HH:mm"))}</Text>
                </View>
                <Text>{rowData.title}</Text>
              </View>
            </View>
            <View style={ styles.askDescribe}>
              <Text style={{marginLeft: 30}}>{'问题描述:' + rowData.description}</Text>
            </View>
            <View style={ styles.askSource}>
              <Text style={{marginLeft: 30}}>{'问题来源:' + rowData.source}</Text>
            </View>
            <View style={styles.askSource}>
              <Text style={{marginLeft: 30}}>{'问题位置:' + this.getAskPosition(rowData.resCategory)}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  //  头像处理
  dealImage = (imageUrl)=> {
    if (imageUrl === null) {
      return 'http://wenjiang-books.oss-cn-beijing.aliyuncs.com/user/avatar/default/student.png';
    } else {
      return imageUrl.replace('http', 'https')
    }

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
  }

  //  跳转问答详情
  pushAskInfo = (questionId)=> {
    this.props.pushAskInfo(questionId)
  };
  //  跳转到我要提问页面
  askAction() {
    this.props.pushAskQuestion();
  }

  componentWillMount() {
    this.getSecondStorage('id', 'locateCode', this.getAskList);
    this.subs
  };

  getObject(key, callback) {
    AsyncStorage.getItem(key, (error, object) => {
      if (error) {
        console.log('Error:' + error.message);
        callback(key);
      } else {
        callback(object);
      }
    })
  }

  getSecondStorage(key1, key2, callBack) {
    AsyncStorage.getItem('id', (error, userId) => {
      if (error) {
      } else {
        console.log(userId)
      }
      AsyncStorage.getItem('locateCode', (error, code) => {
        if (error) {
        } else {
          callBack(userId, code)
        }
      })
    })
  }

  getAskList = (key1, key2)=> {
    var userId = key1;
    var page = 0;
    var size = 12;
    var code = key2;
    var pathUrl = '/api/v1/qa/get-new-question?userId=' + userId + '&code=' + code + '&page=' + page + '&size=' + size;
    NetUtil.get(pathUrl).then((json) => {
      if (json.code === 1000) {
        console.log(json)
        if (json.data === null) {
          if (_page === 0) {
            this.setState({noData: true})
          } else {
            this.setState({noData: false})
            console.log('have')
          }
        } else {
          this.setState({
            noData: false,
            curListItem: json.data,
            listItems: json.data
          });
        }
      } else {
        this.refs.toast.show('' + json.message);
      }
    }, (json) => {
      console.log(json + '3333333失败了33333333333333333333333333');
    })
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  btnAsk: {
    position: 'absolute',
    backgroundColor: 'rgb(46,167,255)',
    height: 49,
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 0,

  },
  btnAskText: {
    color: '#ffffff',
  },
  cellView: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    marginTop: 8,
    marginBottom: 8,
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
  }
});


// <View >
//   <View  style={{marginBottom:49}}>
//     <ListView
//               dataSource={this.state.dataSource}  // 数据源
//               renderRow={this.renderRow}
//     />
//   </View>
//
//   <TouchableOpacity onPress={()=> {
//     this.askAction()
//   }}>
//     <View style={styles.btnAsk} >
//       <Text style={styles.btnAskText}>我要提问</Text>
//     </View>
//   </TouchableOpacity>
// </View>