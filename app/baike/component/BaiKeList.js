/**
 * Created by TaoLee on 2017/8/1.
 */
import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  ListView,
  Image,
  Alert,
  Text,
  TouchableOpacity,
  AsyncStorage,
} from 'react-native';
import {
  SwRefreshScrollView,
  SwRefreshListView,
  RefreshStatus,
  LoadMoreStatus
} from 'react-native-swRefresh'
import HTMLView from 'react-native-htmlview';
import HTTPUtil  from '../../util/NetUtil'
import moment from 'moment';
import Toast, {DURATION} from 'react-native-easy-toast'
let userId = '';
let _page = 0;
export default class BaiKeList extends Component {

  _dataSource = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});

  constructor(props) {
    super(props);
    this.state = {
      listItems: [],
      curListItem: [],
      noData: true,
      nodDataText: '暂无数据'
    };
  }

  componentWillMount() {
    this.initData();
  }

  initData() {
    const size = 12;
    console.log(this.props.BaiKeId + '1111111111111111111111111111111111' + this.props.userId);
    const urlPath = `/api/v1/qa/get-new-questions/${this.props.baikeId}?userId=${this.props.userId}&resCategory=4&page=${_page}&size=${size}`;
    HTTPUtil.get(urlPath).then((json) => {
      if (json.code === 1000) {
        console.log(+'1111111111111111111111111111111111');
        if (json.data === null) {
          console.log(json.data + '22222222222222222222222222222222222222');
          if (_page === 0) {
            this.setState({noData: true})
          } else {
            this.setState({noData: false})
          }
        } else {
          this.setState({noData: false})
          this.setState({curListItem: json.data});
          this.setState({listItems: json.data});
        }
      } else {
        console.log(json.message + '333333333333333333333333333333333');
      }
    }, (json) => {
      this.refs.toast.show(json);
      this.setState('点击重试')
    })
  }

  _renderRow(rowData) {
    return (
      <View style={styles.cell}>
        <View style={styles.container}>
          <Image source={{uri: rowData.avatarUrl, cache: 'force-cache'}} defaultSource={require('../../img/default.jpg')}
                 style={styles.image}/>
          <View style={styles.container_right}>
            <View style={styles.top}>
              <Text style={styles.name}>{rowData.userName}</Text>
              <Text style={styles.time}>{moment(rowData.createTime).format("YYYY/MM/DD HH:mm")}</Text>
            </View>
            <View style={styles.content}>
              <HTMLView
                value={rowData.description}
                stylesheet={styles}
              />
            </View>
          </View>
        </View>
      </View>)
  }

  _onListRefresh(end) {
    let timer = setTimeout(() => {
      // clearTimeout(timer);
      // this._page = 0;
      // this.initData(this._page);
      // this.refs.listView.resetStatus();
      // end()

      this.refs.listView.endRefresh();
      end()
    }, 500)
  }

  _onLoadMore(end) {
    let timer = setTimeout(() => {
      // clearTimeout(timer);
      // this._page++;
      // this.initData(this._page);
      // for (let i = 0; i < this.state.curListItem.length; i++) {
      //   this.state.listItems.push(this.state.curListItem[i])
      // }
      // this.refs.listView.endLoadMore(this.state.curListItem < 5)

      this.refs.listView.endRefresh();
      end()
    }, 500)
  }

  render() {
    if (this.state.noData) {
      return (
        <TouchableOpacity onPress={() => this.componentWillMount()}>
          <View style={{flex: 1, alignItems: "center", justifyContent: "center"} }>
            <Text
              style={{alignItems: 'center'}}>{this.state.nodDataText}
            </Text>
          </View>
          <Toast ref="toast"/>
        </TouchableOpacity>
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
        >
          <Toast ref="toast"/>
        </SwRefreshListView>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    marginBottom: 14,
    paddingBottom: 14
  },
  image: {
    borderRadius: 45,
    width: 34,
    height: 34,
    marginLeft: 30,
    marginTop: 14,
  },
  container_right: {
    flex: 1,
    marginTop: 14,
    marginLeft: 16,
    marginRight: 30
  },
  top: {
    flexDirection: 'row',
  },
  name: {
    textAlign: 'left'
  },
  time: {
    fontSize: 12,
    color: '#d6d7da',
    flex: 1,
    textAlign: 'right'
  },
  p: {

    fontSize: 12,
    lineHeight: 20
  }, content: {}
})







