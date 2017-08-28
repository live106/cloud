import React from 'react';
import { StyleSheet, View, ScrollView, Platform } from 'react-native';

const noop = () => {};
const isAndroid = Platform.OS === 'android';

/**
 *
 *
 */
class AdvanceScrollView extends React.Component {

  static defaultProps = {
    triggerDistance: -1, //滑动距离大于多少触发
    onScroll: noop,
    onPush: noop,  //往上推触发
    onPull: noop,   //往下拉触发
    onBottomPush: noop, //当从底部往上推到onBottomHeight的高度的时候触发
    onBottomHeight: -1,
    onTopPull: noop, //当从顶部往下拉到onTopHeight的高度的时候触发
    onTopHeight: -1
  };
  

  render () {
    return (
      <ScrollView
        ref={(swipeRefreshView) => this._swipeRefreshView = swipeRefreshView}
        style={[styles.container, this.props.style]}
        scrollEventThrottle={60}
        keyboardDismissMode='on-drag'
        onTouchStart={this._handleStart.bind(this)}
        onTouchMove={this._handleMove.bind(this)}
        onScrollEndDrag={this._handleEndDrag.bind(this)}
        onScroll={this._handleScroll.bind(this)}
        scrollEnabled={this.props.scrollEnabled}
        showsVerticalScrollIndicator={true}
        automaticallyAdjustContentInsets={false}
        stickyHeaderIndices={this.props.stickyHeaderIndices}>
        {this.props.children}
      </ScrollView>
    );
  }

  getScrollView = () => {
    return this._swipeRefreshView
  };

  scrollTo = (args) => {
    this._swipeRefreshView.scrollTo(args);
  };

  /**
   * 滚动触发
   * @param e
   * @private
   */
  _handleScroll = (e:Object) => {
    //android 没这特性
    if (isAndroid) {
      return;
    }
    if (!this.isTouch || this.isTriggherTopOrBottom) {
      return;
    }
    let evt = e.nativeEvent,
      {onTopHeight, onBottomHeight} = this.props,
      offset = evt.contentOffset.y,
      {height: contentSizeHeight} = evt.contentSize,
      {height: scrollViewHeight} = evt.layoutMeasurement,
      scrollHeight = Math.max(contentSizeHeight - scrollViewHeight, 0) + onBottomHeight,
      absOffset = Math.abs(offset);
    //往下拉
    if (offset < 0 && absOffset >= onTopHeight) {
      this.isTriggerTop = true;
      //console.log ("往下拉", offset)
    }
    //往上推
    else if (offset > 0 && absOffset >= scrollHeight) {
      this.isTriggerBottom = true;
      //console.log ("往上推", offset)
    }
  };

  /**
   * 手指点击
   * @param e
   * @private
   */
  _handleStart = (e) => {
    const left = e.nativeEvent.pageX,
      top = e.nativeEvent.pageY;
    this.isTouch = true;
    this.startPoint = {left, top};
    //console.log ('scroll view => ', this.startPoint);
  };

  /**
   * 手指移动
   * @param e
   * @private
   */
  _handleMove = (e) => {
    const leftNow = e.nativeEvent.pageX,
      topNow = e.nativeEvent.pageY;
    let {triggerDistance} = this.props,
      {left,top} = this.startPoint,
      distanceNow = Math.abs(top - topNow);
    this.isTrigger = distanceNow > triggerDistance;
    this.isPush = top > topNow;
  };

  /**
   * 手指停止拖动
   * @param e
   * @private
   */
  _handleEndDrag = (e) => {
    this._reset();
    if (!this.isTrigger) {
      return;
    }
    let {onPush, onPull} = this.props;
    if (this.isPush) {
      //console.log ('scroll view => ', '往上推咯咯了');
      onPush();
    }
    //
    else {
      //console.log ('scroll view => ', '往下啦罗罗罗罗');
      onPull();
    }
  };

  /**
   * 手指停止重置
   * @private
   */
  _reset = () => {
    //console.log (this.isTouch, this.isTriggerBottom, this.isTriggerTop)
    this.isTouch = false;
    let {onTopPull, onBottomPush} = this.props;
    if (this.isTriggerBottom) {
      onBottomPush();
    }
    else if (this.isTriggerTop) {
      onTopPull();
    }
    this.isTriggerBottom = this.isTriggerTop = false;
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default AdvanceScrollView;
