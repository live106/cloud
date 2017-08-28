/**
 * PullRefreshListView组件
 *
 * 下拉刷新，无限分页
 */
import React from 'react';

import {
  ActivityIndicatorIOS,
  TouchableOpacity,
  InteractionManager,
  PixelRatio,
  StyleSheet,
  ListView,
  addons,
  View,
  Text,
  Image,
  findNodeHandle
} from 'react-native';
import {fromJS, is} from 'immutable';
import fetch from './../fetch';
import QMLoading from './../loading';
import QMSwipeRefreshView from '../swipe-refresh-view';
import SwipeOut from 'react-native-swipeout';

//每页显示的数量
const PAGE_SIZE = 10;
//just do nothing
const noop = () => {
};

//当前屏幕的宽度
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT}  = require('Dimensions').get('window');


const listItemStyle = StyleSheet.create({
  container: {
    //overflow: 'hidden'
  }
});


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
      <View style={listItemStyle.container}>
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
const PullRefreshListView = React.createClass({
  propTypes: {
    //url必填
    url: React.PropTypes.string.isRequired
  },


  /**
   * 默认属性
   */
  getDefaultProps() {
    return {
      //ajax的url
      url: '',
      //动画消失时间
      duration: 400,
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
      renderSwipeOutBtns: null,
      autoSwipeOut: true,
      needRefresh: true,
      emptyText: '暂无数据，下拉可刷新'
    }
  },


  /**
   * 初始化当前的状态
   */
  getInitialState() {
    return {
      /*是不是loading到结尾*/
      isLoadTail: false,

      /*是不是第一次loading*/
      isInitLoading: true,

      /*数据源*/
      dataSource: [],

      /*是否显示返回顶部*/
      showBackToTop: false
    };
  },


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
    this._openSwipeIndex = -1;

    //ListView
    this._ds = new ListView.DataSource({
      rowHasChanged(r1, r2) {
        return r1 != r2;
      }
    });
  },


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

    InteractionManager.runAfterInteractions(() => {
      if (this._openSwipeIndex != -1) {
        // this._listView.refs.listviewscroll && this._listView.refs.listviewscroll.changeScrollEnable(true);
        this['_swipeOut' + this._openSwipeIndex] && this['_swipeOut' + this._openSwipeIndex]._close();
        this._openSwipeIndex = -1;
      }
    });
  },


  /**
   * 组件将要完成首次加载，获取数据
   */
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this._init();
    });
  },


  render() {
    // 如果没有数据，显示暂无数据
    var isEmpty = this.state.isLoadTail && this.state.dataSource.length == 0;
    return isEmpty ? this._renderEmptyView() : this._renderListView();
  },


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
  },


  _handleOnRefresh(onRefreshEnd){
    this._init();
    if (onRefreshEnd) {
      onRefreshEnd();
    }
  },


  _renderListView() {
    //如果是初始loading,显示loading的效果
    if (this.state.isInitLoading) {
      return (<QMLoading/>);
    }


    // 渲染ListView
    return (
      <View
        style={[styles.container, this.props.style]}
        onStartShouldSetResponderCapture={(e) => {
          this._handleCapture(e);
          return false;
        }}>
        <ListView
          style={this.props.listStyle}
          ref={(listView) => this._listView = listView}
          pageSize={PAGE_SIZE}
          initialListSize={PAGE_SIZE}
          onEndReachedThreshold={100}
          scrollRenderAheadDistance={1000}
          scrollEventThrottle={60}
          keyboardShouldPersistTaps='never'
          removeClippedSubviews={true}
          renderScrollComponent={(props) => (
            <QMSwipeRefreshView
              duration={this.props.duration}
              {...props}
            />
          )}
          onRefreshStart={(onRefreshEnd) => {
            this._isLoading = true;
            this._handleMomentumScrollEnd(onRefreshEnd);
          }}
          onModeChange={(mode) => this._swipeRefreshStatus = mode}
          refreshEnd={(result) => this._isLoading = false}
          onEndReached={this._handlePagination}
          dataSource={this._ds.cloneWithRows(this.state.dataSource)}
          renderHeader={this.props.renderHeader}
          renderRow={this._renderRow}
          renderEmpty={this.props.renderEmpty || this._renderEmptyView}
          renderFooter={this.props.renderFooter || this._renderFooter}
          showsVerticalScrollIndicator={true}
          automaticallyAdjustContentInsets={false}
          contentContainerStyle={[this.props.contentContainerStyle]}
          onScroll={this._handleScroll}/>

        <BackToTop
          ref={(backToTop) => this._refbackToTop = backToTop}
          back={this._backToTop}
          visible={this.props.backToTop}/>
      </View>
    );
  },


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
          this.props.autoSwipeOut && this.props.renderSwipeOutBtns ?
            <SwipeOut
              backgroundColor='#fff'
              rowID={index}
              right={this.props.renderSwipeOutBtns(row, _, index)}
              autoClose={true}
              scroll={(isStop) => {
                if (this._listView.refs.listviewscroll) {
                  this._listView.refs.listviewscroll.changeScrollEnable(isStop);
                }
                this._openSwipeIndex = index; // 获取当前打开的SwipeIndex
              }}
              onOpen={(sectionID, rowID) => this._setRowId(_, rowID)}
              ref={(swipeOut) => this['_swipeOut' + index] = swipeOut}
            >
              {this.props.renderRow(row, _, index)}
            </SwipeOut>
            : this.props.renderRow(row, _, index)
        }
      </ListItem>
    );
  },

  _setRowId(_, rowID) {
    this.rowID = rowID;
    this.row = this.state.dataSource[this.rowID];
  },


  _handleCapture(e){
    if (this._listView.refs.listviewscroll) {
      this._listView.refs.listviewscroll.changeScrollEnable(true);
    }
    if (this._openSwipeIndex != -1) {
      if (e.nativeEvent.target != findNodeHandle(this['_swipeOut' + this._openSwipeIndex])) {
        this['_swipeOut' + this._openSwipeIndex] && this['_swipeOut' + this._openSwipeIndex]._close();
        this._openSwipeIndex = -1;
      }
    }
  },


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
          <ActivityIndicatorIOS size='small'/>
          <Text style={[styles.name, styles.text, {marginLeft: 5}]} allowFontScaling={false}>正在加载</Text>
        </View>
      );
    }
  },


  /**
   * 获取url
   */
  _getURL(){
    var url = this.props.url;

    if (!this.props.usePostMethod) {
      if (url.indexOf('?') != -1) {
        url += '&pageNum=' + this._page;
      } else {
        url += '?pageNum=' + this._page;
      }
    }

    if (__DEV__) {
      console.log(url);
    }

    return url;
  },


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

      //最后一页
      if (res.data.length === 0) {
        this._page--;
      }

      this.setState({
        dataSource: this.state.dataSource.concat(res.data),
        isLoadTail: res.data.length < this.props.pageSize
      }, () => this.props.onDataReceive(res));
    }
  },


  /**
   * 将Fetch操作抽取出来,支持POST方法
   * @private
   */
  _http(){
    //如果是post方法获取数据
    if (this.props.postMethod) {
      const postBody = this.props.postBody;
      postBody['pageNum'] = this._page;

      return fetch(this.props.url, {
        method: 'POST',
        body: JSON.stringify(postBody)
      });
    } else {
      //GET方法
      return fetch(this._getURL());
    }
  },


  async _handleMomentumScrollEnd(onRefreshEnd) {
    //当前的页
    this._page = 0;

    let res = {};
    let dataSource = [];
    let isLoadTail = true;

    try {
      this._isLoading = true;
      //获取数据
      res = await this._http();

      dataSource = res.data;
      isLoadTail = res.data.length < this.props.pageSize;
    } finally {
      onRefreshEnd();
      this._isLoading = false;

      InteractionManager.runAfterInteractions(() => {
        this.setState({
          dataSource: dataSource,
          isLoadTail: isLoadTail
        }, () => this.props.onDataReceive(res));
      });
    }
  }
  ,


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
    }, async() => {
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
        }, () => this.props.onDataReceive(res));
      }
    });
  },

  /**
   * 判断滚动一定距离显示返回顶部
   */
  _handleScroll(e) {
    const offsetY = e.nativeEvent.contentOffset.y + e.nativeEvent.contentInset.top;
    this._refbackToTop.changeVisible(offsetY > 300);
  },

  /**
   * 返回顶部
   */
  _backToTop() {
    this.scrollTo(0, 0);
  },


  /**
   * 刷新指定列表
   */
  refreshListView() {
    InteractionManager.runAfterInteractions(() => {
      this._init();
    });
  },

  scrollTo(x, y){
    this._listView.getScrollResponder().scrollTo(x, y);
  },


  changeScrollEnable(enabled){
    this._listView.refs.listviewscroll.changeScrollEnable(enabled);
  }
});


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
  arrow: {
    width: 20,
    height: 20
  },
  emptyIcon: {
    width: 110,
    height: 110,
    marginBottom: 10
  },
  backToTop: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: 'transparent'
  }
});

export default PullRefreshListView;
