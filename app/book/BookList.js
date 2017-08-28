/**
 * Created by TaoLee on 2017/8/1.
 */
import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  ListView,
  Image,
  Text,
} from 'react-native';
import {
  SwRefreshScrollView,
  SwRefreshListView,
  RefreshStatus,
  LoadMoreStatus
} from 'react-native-swRefresh'
import HTMLView from 'react-native-htmlview';
import HTTPUtil  from '../util/NetUtil'
import Toast, {DURATION} from 'react-native-easy-toast'
import moment from 'moment';
let _page = 0;
export default class BookList extends Component {
  _dataSource = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});

  constructor(props) {
    super(props);
    this.state = {
      listItems: [],
      curListItem: [],
      noData: true,
    };
  }

  componentWillMount() {
    this.initData();
  }

  initData() {
    const size = 12;
    const urlPath = '/api/v1/qa/get-new-questions/' + this.props.ebookId + '?userId=' + this.props.userId + '&resCategory=2&page=' + _page + '&size=' + size;
    console.log(urlPath);
    HTTPUtil.get(urlPath).then((json) => {
      if (json.code === 1000) {
        if (json.data === null) {
          if (_page === 0) {
            this.setState({noData: true})
          } else {
            this.setState({noData: false})
          }
          console.log(json.data + '111111111111111111111111111111111111111111' + json.message);
        } else {
          this.setState({noData: false});
          this.setState({curListItem: json.data});
          this.setState({listItems: json.data});
          console.log(json.data + '22222222222222222222222222222222222');
        }
      } else {
        console.log(json.message + '333333333333333333333333333333333');
        this.refs.toast.show('' + json.message);
      }
    }, (json) => {
      console.log(json + '3333333失败了33333333333333333333333333');
    })
  }

  _onListRefresh(end) {
    let timer = setTimeout(() => {
      // clearTimeout(timer);
      // this._page = 0;
      // this.initData(this._page);
      // this.refs.listView.resetStatus();//重置上拉加载的状态
      // end()//刷新成功后需要调用end结束刷新
      // // this.refs.listView.endRefresh() //建议使用end() 当然 这个可以在任何地方使用

      this.refs.listView.endRefresh();
      end()
    }, 1500)
  }

  _onLoadMore(end) {
    if(this._page===0){
      this._page++;
      end()
    }else {
      let timer = setTimeout(() => {
        // clearTimeout(timer);
        // this._page++;
        // this.initData(this._page);
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

  render() {

    if (this.state.noData) {
      return (
        <View style={{flex: 1, alignItems: "center", justifyContent: "center"} }><Text style={{alignItems: 'center'}}>暂无数据</Text></View>
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

  _renderRow(rowData) {
    console.log(rowData + '*****************************');
    return (
      <View style={styles.cell}>
        <View style={styles.container}>
          <Image source={{uri: rowData.avatarUrl, cache: 'force-cache'}} style={styles.image}/>
          <View style={styles.container_right}>
            <View style={styles.top}>
              <Text style={styles.name}>{rowData.userName}</Text>
              <Text style={styles.time}>{moment(rowData.createTime).format("YYYY/MM/DD HH:mm")}</Text>
            </View>
            <HTMLView
              value={rowData.description}
              stylesheet={styles}
            />
          </View>
        </View>
      </View>)
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
  content: {
    fontSize: 12,
    lineHeight: 20
  }
});







