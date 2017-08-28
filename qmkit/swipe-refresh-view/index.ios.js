/**
 * Created by hufeng on 12/22/15.
 *
 * 人生最困难的就是不断的超越自己.
 */
import React from 'react';

import {ScrollView, Animated, View, Text, StyleSheet} from 'react-native';
import QMLoading from '../loading';
import {Indicator, LOADING_HEIGHT} from './indicator';
//do nothing.
const noop = () => {};


/**
 * 下拉刷新的公共组件
 */
export default class SwipeRefreshView extends React.PureComponent{

  constructor(props) {
    super(props);
    state =  {
      //当前提示框的状态
      mode: 'refresh',
      //当前的提示的高度
      height: 0,

      //是不是可以滚动
      scrollEnabled: true
    };

    this._handleResponseRelease = this._handleResponseRelease.bind(this);
    this._handleScroll = this._handleScroll.bind(this);
    this._handleScrollEnd = this._handleScrollEnd.bind(this);
  }

  /**
   * 设置默认属性
   * @returns {{needInitLoading: boolean}}
   */
  static defaultProps = {

      needInitLoading: false,
      //默认动画消失时间,600ms
      duration: 600,
      onModeChange: noop

  }


  /**
   * 初始化状态
   */


  /**
   * render
   */
  render() {
    if (this.props.needInitLoading) {
      return (<QMLoading />);
    }

    return (
      <ScrollView
        ref={(swipeRefreshView) => this._swipeRefreshView = swipeRefreshView}
        style={[styles.container, this.props.style]}
        scrollEventThrottle={60}
        removeClippedSubviews={true}
        keyboardDismissMode='on-drag'
        onTouchStart={(e) => this._isTouch = true}
        onTouchEnd={(e) => this._isTouch = false}
        onScroll={this._handleScroll}
        scrollEnabled={this.state.scrollEnabled}
        showsVerticalScrollIndicator={true}
        automaticallyAdjustContentInsets={false}
        contentContainerStyle={this.props.contentContainerStyle}
        onResponderRelease={this._handleResponseRelease}
        onMomentumScrollEnd={this._handleScrollEnd}>

        {/*指示器*/}
        <Indicator
          mode={this.state.mode}
          duration={this.props.duration}
          height={this.state.height}
        />

        {/*子元素*/}
        {this.props.children}
      </ScrollView>
    );
  }


  /**
   * 处理ScrollView的滚动
   * @param e
   * @private
   */
  _handleScroll(e){
    //通知父组件
    this.props.onScroll && this.props.onScroll(e);

    //得到当前的下拉距离
    //下拉距离+初始偏移量
    const offsetY = e.nativeEvent.contentOffset.y + e.nativeEvent.contentInset.top;

    if (offsetY <= 0 && this._isTouch) {
      if (Math.abs(offsetY) >= LOADING_HEIGHT) {
        //如果不是push状态,更新
        if (this.state.mode != 'push') {
          this.setState({
            mode: 'push',
            height: LOADING_HEIGHT
          }, () => this.props.onModeChange('push'));
        }
      } else {
        //下拉的pull状态,更新mode和height
        if (this.state.height != LOADING_HEIGHT) {
          this.setState({
            mode: 'pull',
            height: Math.abs(offsetY)
          }, () => this.props.onModeChange('pull'));
        }
        //上拉的pull状态,只更新mode
        else if (this.state.mode != 'pull') {
          this.setState({
            mode: 'pull'
          }, () => this.props.onModeChange('pull'))
        }
      }
    }
  }


  /**
   * 当滚动结束时候
   * @param e
   * @private
   */
  _handleScrollEnd(e){
    //下拉距离+初始偏移量
    const offsetY = e.nativeEvent.contentOffset.y + e.nativeEvent.contentInset.top;

    //回到原点
    if (this.state.height === LOADING_HEIGHT) {
      this.setState({
        mode: 'refresh'
      }, () => {
        this.props.onModeChange('refresh');
        //通知外界正在刷新
        this.props.onRefreshStart && this.props.onRefreshStart(this.onRefreshEnd)
      });
    }
  }


  _handleResponseRelease(e){
    //不是刷新状态,直接消失
    if (this.state.mode === 'pull') {
      this.setState({
        height: 0
      }, () => this.props.onModeChange(''));
    }
  }


  /**
   * 处理结束事件
   */
  onRefreshEnd(){
    if (this.state.height) {
      this.setState({
        height: 0
      }, () => this.props.onModeChange(''));
    }
  }


  changeScrollEnable(enabled){
    this.setState({
      scrollEnabled: enabled
    });
  }

  getScrollResponder() {
    return this._swipeRefreshView.getScrollResponder();
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});



