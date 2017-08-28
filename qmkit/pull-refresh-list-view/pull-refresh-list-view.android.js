/**
 * PullRefreshListView组件
 *
 * 下拉刷新，无限分页
 */
import React from 'react';

import {ActivityIndicator, TouchableOpacity, InteractionManager, PixelRatio, RefreshControl, StyleSheet, ListView, View, Text, Image} from 'react-native';
import {fromJS, is} from 'immutable';
import fetch from './../fetch';
import QMLoading from './../loading';
import QMSwipeRefreshView from '../swipe-refresh-view';

//每页显示的数量
const PAGE_SIZE = 10;
//just do nothing
const noop = () => {};

//当前屏幕的宽度
const {width: SCREEN_WIDTH}  = require('Dimensions').get('window');


/**
 * 封装renderRow的container,主要为了自动的加上
 * overflow:hidden
 * 便于View的removeClippedSubviews={true}
 */
class ListItem extends React.Component{
  shouldComponentUpdate(nextProps){
    return !is(fromJS(nextProps), fromJS(this.props));
  }

  render() {
    return (
      <View>
        {this.props.children}
      </View>
    );
  }
}


class BackToTop extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      visible: this.props.backToTop
    }
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.visible != this.props.visible) {
      this.requestAnimation = requestAnimationFrame(() => {
        this.setState({
          visible: nextProps.visible
        });
      });
    }
  }

  componentWillUnmount(){
    this.requestAnimation&&cancelAnimationFrame(this.requestAnimation);
  }


  render() {
    const visible = this.state.visible;
    return (
      visible ? this._renderBtn() : null
    );
  }


  _renderBtn(){
    return (
      <TouchableOpacity
        style={styles.backToTop}
        activeOpacity={0.8}
        onPress={this.props.back}>
        <Image
          style={{width: 50, height: 50}}
          source={require('./../img/top.png')}/>
      </TouchableOpacity>
    );
  }

  changeVisible(isShow) {
    this.setState({
      visible: isShow
    });
  }
}


/**
 * Usage
 * var {QMPullRefreshListView} = require('qmkit');
 *
 * React.renderClass({
 *  render() {
 *    return (
 *      <PullRefreshListView
 *        url: '/your remote url/',
 *        style={}
 *        renderRow={}
 *      />
 *    );
 *  }
 * });
 */
class PullRefreshListView extends React.Component{
  static propTypes = {
    url: React.PropTypes.string.isRequired
  };

  static defaultProps = {
    //ajax的url
    url: '',
    //覆盖默认的ListView的样式
    style: null,
    //是否开启post方法
    postMethod: false,
    //post方法传递的参数
    postBody: {},
    //默认当前的pageSize
    pageSize: PAGE_SIZE,
    //是否显示返回顶部
    backToTop: false,
    renderHeader: null,
    renderEmpty: null,
    renderFooter: null,
    //数据回来的callback，
    //便于外界拿到数据去setState
    onDataReceive: noop,
    needRefresh: true,
    emptyText: '暂无数据，下拉可刷新'
  };

  /**
   * 初始化当前的状态
   */
  
  constructor(props){
    super(props);
    this.state = {
      //pull-to-refresh-view 正在刷新
      isRefreshing: false,
      /*是不是loading到结尾*/
      isLoadTail: false,
      /*是不是第一次loading*/
      isInitLoading: true,
      /*数据源*/
      dataSource: [],
      /*是否显示返回顶部*/
      showBackToTop: false
    };
    this._renderEmptyView= this._renderEmptyView.bind(this);
    this._handleOnRefresh= this._handleOnRefresh.bind(this);
    this._renderListView= this._renderListView.bind(this);
    this._renderRow= this._renderRow.bind(this);
    this._renderFooter= this._renderFooter.bind(this);
    this._getURL= this._getURL.bind(this);
    this._handlePagination= this._handlePagination.bind(this);
    this._http= this._http.bind(this);
    this._onRefresh= this._onRefresh.bind(this);
    this._init= this._init.bind(this);
    this._backToTop= this._backToTop.bind(this);
    this.refreshListView= this.refreshListView.bind(this);

  }

  /**
   * 设置缓存对象
   *
   * @returns {boolean}
   */
  componentWillMount(){
    //当前页
    this._page = 0;

    //当前是不是处于请求数据刷新状态
    this._isLoading = false;
    //swipe-refresh的状态
    this._swipeRefreshStatus = '';
    //当前swipe滑动的索引
    //ListView
    this._ds = new ListView.DataSource({
      rowHasChanged(r1, r2) {
        return r1 != r2;
      }
    });
  }


  /**
   * 属性变化直接刷新
   */
  componentWillReceiveProps(nextProps) {
    const nextReqParam = {
      url: nextProps.url,
      pageSize: nextProps.pageSize,
      postMethod: nextProps.postMethod,
      postBody: nextProps.postBody
    };

    const {pageNum, ...others} = this.props.postBody;
    const curReqParam = {
      url: this.props.url,
      pageSize: this.props.pageSize,
      postMethod: this.props.postMethod,
      postBody: others
    };

    //影响url的参数变化时候,重新init
    if (!is(fromJS(nextReqParam), fromJS(curReqParam))) {
      this.setState({
        isInitLoading: true
      });

      InteractionManager.runAfterInteractions(() => {
        this._init();
      });
    }
  }


  /**
   * 组件将要完成首次加载，获取数据
   */
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this._init();
    });
  }


  render() {
    // 如果没有数据，显示暂无数据
    var isEmpty = this.state.isLoadTail && this.state.dataSource.length == 0;
    return isEmpty ? this._renderEmptyView() : this._renderListView();
  }


  _renderEmptyView() {
    return (
      <QMSwipeRefreshView
        needInitLoading={false}
        contentContainerStyle={{flex: 1}}
        onRefreshStart={this._handleOnRefresh}>
        <View style={styles.noDataContainer}>
          {
            this.props.icon ?
              <Image style={[styles.emptyIcon, {marginBottom: 50}]} source={this.props.icon}/> :
              <View />
          }
          <Text style={[styles.txt, {marginBottom: 50}]} allowFontScaling={false}>{this.props.emptyText}</Text>
        </View>
      </QMSwipeRefreshView>
    );
  }

  _handleOnRefresh(onRefreshEnd){
    this._init();
    if (onRefreshEnd) {
      onRefreshEnd();
    }
  }


  _renderListView() {
    //如果是初始loading,显示loading的效果
    if (this.state.isInitLoading) {
      return (<QMLoading/>);
    }

    return (
      <View
        style={[styles.container, this.props.style]}>
          <ListView
            style={this.props.listStyle}
            refreshControl={
              <RefreshControl
                refreshing={this.state.isRefreshing}
                onRefresh={this._onRefresh}
                // tintColor="#ff0000"
                // title="Loading..."
                // titleColor="#00ff00"
                // colors={['#ff0000', '#00ff00', '#0000ff']}
                // progressBackgroundColor="#ffff00"
              />}
            ref={(listView) => this._listView = listView}
            pageSize={PAGE_SIZE}
            initialListSize={PAGE_SIZE}
            onEndReachedThreshold={100}
            scrollRenderAheadDistance={1000}
            scrollEventThrottle={60}
            keyboardShouldPersistTaps='never'
            removeClippedSubviews={true}
            onEndReached={this._handlePagination}
            dataSource={this._ds.cloneWithRows(this.state.dataSource)}
            renderHeader={this.props.renderHeader}
            renderRow={this._renderRow}
            renderEmpty={this.props.renderEmpty || this._renderEmptyView}
            renderFooter={this.props.renderFooter || this._renderFooter}
            showsVerticalScrollIndicator={true}
            automaticallyAdjustContentInsets={false}
            contentContainerStyle={[this.props.contentContainerStyle]}/>
          <BackToTop
            ref={(backToTop) => this._refbackToTop = backToTop}
            back={this._backToTop}
            visible={true}
          />
      </View>
    );
    // 渲染ListView
  }


  /**
   * 渲染each row
   * @param row
   * @param _
   * @param index
   * @returns {XML}
   * @private
   */
  _renderRow(row, _, index){
    return (
      <ListItem key={index}>
        {
         this.props.renderRow(row, _, index)
        }
      </ListItem>
    );
  }

  /**
   * 渲染ListView的footer
   */
  _renderFooter(){
    // 如果没有获取任何数据不显示footer
    if (this.state.isLoadTail || this.state.dataSource.length == 0) {
      return null;
    } else {
      return (
        <View style={styles.footer}>
          <ActivityIndicator color="#CCCCCC" size="large" style={styles.progress}/>
          <Text style={[styles.name,styles.text,{marginLeft: 5}]} allowFontScaling={false}>正在加载</Text>
        </View>
      );
    }
  }


  /**
   * 获取url
   */
  _getURL(){
    let url = this.props.url;

    if (!this.props.usePostMethod) {
      if (url.indexOf('?') != -1) {
        url += '&page=' + this._page+'&size=12';
      } else {
        url += '?page=' + this._page+'&size=12';
      }
    }

    if (__DEV__) {
      console.log(url);
    }

    return url;
  }

  /**
   * 处理分页
   */
  async _handlePagination(e) {
    //1. 屏蔽不是ScrollView滚动到底部产生的事件
    //2. 如果当前的状态是不是正在获取更新，不去分页获取
    //3. 是不是在pull,push,refresh
    //4. 是不是已经加载到最后一页
    if (!e || this._isLoading || this._swipeRefreshStatus || this.state.isLoadTail) {
      return false;
    }

    let res = {};

    try {

      this._isLoading = true;
      this._page++;

      res = await this._http();
    } finally {
      this._isLoading = false;
      this._refbackToTop.changeVisible(this._page > 1);

      //最后一页
      if (res.data.length === 0) {
        this._page--;
      }

      this.setState({
        dataSource: this.state.dataSource.concat(res.data),
        isLoadTail: res.data.length < this.props.pageSize
      }, () => this.props.onDataReceive(res));
    }
  }
  
  /**
   * 将Fetch操作抽取出来,支持POST方法
   * @private
   */
  _http(){
    //如果是post方法获取数据
    if (this.props.postMethod) {
      const postBody = this.props.postBody();
      postBody['pageNum'] = this._page;
      if(__DEV__){
        console.log('GoodsPullRefreshList : postBody'+JSON.stringify(postBody));
      }
      return fetch(this.props.url, {
        method: 'POST',
        body: JSON.stringify(postBody)
      });
    } else {
      //GET方法
      return fetch(this._getURL());
    }
  }

  async _onRefresh() {
    //当前的页
    this._page = 0;

    let res = {};
    let dataSource = [];
    let isLoadTail = true;

    try {
      this.setState({
        isRefreshing: true
      });

      this._isLoading = true;
      //获取数据
      res = await this._http();

      dataSource = res.data;
      isLoadTail = res.data.length < this.props.pageSize;
    } finally {
      this._isLoading = false;

      InteractionManager.runAfterInteractions(() => {
        this.setState({
          isRefreshing: false,
          dataSource: dataSource,
          isLoadTail: isLoadTail
        }, () => this.props.onDataReceive(res));
      });
    }
  }

  /**
   * 初始化获取数据
   */
  _init() {
    this._page = 0;
    let res = {};
    let dataSource = [];
    let isLoadTail = true;
    this.setState({
      isInitLoading: true
    }, async () => {
      try {
        //获取数据
        res = await this._http();

        dataSource = res.data;
        isLoadTail = res.data.length < PAGE_SIZE;
      } finally {
        this.setState({
          isInitLoading: false, //取消loading
          dataSource: dataSource,
          isLoadTail: isLoadTail
        }, () => {
          console.log('调用父组件 _onDataReceive ');
          this.props.onDataReceive(res)});
      }
    });
  }
  
  /**
   * 返回顶部
   */
  _backToTop() {
    this._listView.getScrollResponder().scrollTo(0, 0);
  }


  /**
   * 刷新指定列表
   */
  refreshListView() {
    InteractionManager.runAfterInteractions(() => {
      this._init();
    });
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  footer: {
    width: SCREEN_WIDTH,
    height: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  txt: {
    fontSize: 16,
    color: '#666'
  },
  text: {
    fontSize: 14,
    color: '#939495'
  },
  face: {
    width: 93,
    height: 93,
    marginBottom: 15
  },
  foot: {
    alignSelf: 'stretch',
    justifyContent: 'flex-end',
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10
  },
  button: {
    backgroundColor: '#e63a59',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 5
  },
  cont: {
    fontSize: 16,
    color: '#FFF'
  },
  emptyIcon: {
    width: 110,
    height: 110,
    marginBottom: 10
  },
  backToTop: {
    position: 'absolute',
    right: 20,
    bottom: 120,
    backgroundColor: 'transparent'
  }
});

export default PullRefreshListView;
