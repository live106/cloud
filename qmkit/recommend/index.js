/**
 * Created by liuzhaoming on 15/12/28.
 */
import React from 'react';

import {View, ListView, Text, TextInput, StyleSheet, InteractionManager, AsyncStorage, Platform, Dimensions} from 'react-native';

import {msg} from 'iflux-native';
import {recommendByContent} from './webapi';
import ScrollableBar from './component/scollable-bar';
import GoodsList from './component/recommend-goods-list';
import Carousel from './component/carousel';

const {width: WIDTH, height: HEIGHT} = Dimensions.get('window');

const RecommendPanel = React.createClass({
  getDefaultProps(){
    return {
      ids: '',
      size: 12,
      row: 1,
      column: 3,
      height: 0,
      onCallback: ()=> {
      }
    };
  },


  getInitialState() {
    return {
      skus: [],
      isLoading: true,
    }
  },

  componentWillMount(){
    this._isMounted = false;

    if (__DEV__) {
      console.log("recommend componentWillMount", this.props);
    }

    InteractionManager.runAfterInteractions(() => {
      this._updateRecommend(this.props.ids);
    });
  },

  componentDidMount(){
    this._isMounted = true;
  },

  componentWillUpdate(){
    this._isMounted = false;
  },

  componentDidUpdate(){
    this._isMounted = true;
  },

  componentWillReceiveProps(nextProps){
    if (__DEV__) {
      console.log("recommend componentWillReceiveProps", nextProps, this.props);
    }

    if (nextProps.ids !== this.props.ids) {
      this.setState({isLoading: true});

      InteractionManager.runAfterInteractions(() => {
        this._updateRecommend(nextProps.ids);
      });
    }
  },

  render() {
    if (this.state.isLoading) {
      //return <View style={{flex:1, backgroundColor: '#FFF'}}><QMLoading /></View>
      return null;
    }

    const tabSize = this._getTabSize();
    if (__DEV__) {
      console.log('recommend tabsize', tabSize);
    }
    var tabIndexArray = [];
    for (var i = 0; i < tabSize; i++) {
      tabIndexArray.push(i);
    }
    var topic = (this.props.topic || 'recommend:default') + ':setSelectedBanner';

    return (
      <View style={{flex:1, backgroundColor: '#fff'}}>
        <Carousel
          tabBarPosition={false}
          style={{backgroundColor: '#FFF', height: this._getHeight()}}
          autoplay={false}
          onChangeTab={(v)=>{msg.emit(topic, v.i);}}
        >
          {
            tabIndexArray.map((index, k)=> {
              var tabData = this._getTabData(index);
              return (
                <GoodsList
                  key={k}
                  goodsList={tabData}
                  row={this.props.row}
                  column={this.props.column}
                  tabLabel={index}
                  topic={topic}
                />
              );
            })
          }
        </Carousel>
        {
          Platform.OS === 'ios' ?
            <ScrollableBar topic={topic} tabSize={tabSize}/>
            : null
        }
      </View>
    );
  },


  /**
   * 获取Tab要显示的商品数据结构
   * @param tabNo
   * @returns {Array.<T>|string|Blob|ArrayBuffer|*|Iterable<K, V>}
   * @private
   */
  _getTabData(tabNo){
    if (__DEV__) {
      console.log("recommend _getTabData ", this.props)
    }
    var from = tabNo * (this.props.column * this.props.row);
    var to = (tabNo + 1) * (this.props.column * this.props.row);
    return this.state.skus.slice(from, to);
  },


  /**
   *
   * @private
   */
  _updateRecommend(ids){
    if (ids && ids.length > 0) {
      this._getRecommendSkus(ids);
    }
    else {
      this._getViewGoodsId().then((skuIds)=> {
        this._getRecommendSkus(skuIds);
      });
    }
  },


  /**
   * 获取Tab Size
   * @private
   */
  _getTabSize(){
    var totalSize = this.props.size;
    if (this.state.skus && this.state.skus.length < totalSize) {
      totalSize = this.state.skus.length;
    }

    return parseInt(totalSize / (this.props.column * this.props.row));
  },


  async _getRecommendSkus(ids){
    let res = [];
    try {
      res = await recommendByContent({ids: ids, size: this.props.size});
      if (__DEV__) {
        console.log('recommend _getRecommendSkus receive http response', res);
      }
    } finally {
      if (this._isMounted) {
        this.props.onCallback(res.length >= this.props.row * this.props.column)
        this.setState({
          isLoading: false,
          skus: res
        });
      }
    }
  },


  _getHeight(){
    if (this.props.height) {
      return this.props.height;
    }

    if (this.props.row > 0) {
      return (WIDTH / 3 + 50) * (this.props.row - 1) + WIDTH / 3 + 40;
      //return 170 + 160 * (this.props.row - 1);
    }
  },


  /**
   * 获取缓存中得用户浏览记录
   * @returns {*}
   * @private
   */
  async _getViewGoodsId() {
    try {
      var storeData = await AsyncStorage.getItem('kstore@browseRecord');

      if (__DEV__) {
        console.log("*** get browse record ", storeData);
      }

      if (!storeData) {
        return '';
      }

      var skuArray = JSON.parse(storeData);
      var skuIdArray = skuArray.slice(skuArray.length - 5).map((v)=>v.goodsId);

      if (__DEV__) {
        console.log("*** get browse record finish", skuIdArray);
      }

      return skuIdArray.join(',');
    } catch (err) {
      return '';
    }
  }
});


export default RecommendPanel;
