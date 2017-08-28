/**
 * 在一个讲究B格的年代，滑动删除是必须的。
 *
 * issue:
 * https://github.com/facebook/react-native/issues/1234
 *
 * 期待官方快速的fixed掉这个layout的bug
 *
 * @type {ReactNative|exports|module.exports}
 */
import React from 'react';

import {View, Text, addons, Animated, PanResponder, StyleSheet} from 'react-native';
const { PureRenderMixin } = addons;


/**
 * Usage
 *
 * var {QMSwiper} = require('qmkit');
 *
 *
 * return (
 *  <QMSwiper
 *    renderRight={this._renderRight}
 *    renderContent={this._renderContent}
 *  />
 * );
 *
 */
const Swiper = React.createClass({
  mixins: [PureRenderMixin],


  getInitialState() {
    return {
      pan: new Animated.Value(0)
    }
  },


  componentWillMount(){
    var self = this;

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      /**
       * 处理响应事件
       */
      onPanResponderMove(e, gestureState){
        console.log(gestureState);
        //是不是正在右滑
        var isSwipeRight = (gestureState.moveX - gestureState.x0) > 0;

        //是不是左滑动
        var isSwipeLeft = (gestureState.x0 - gestureState.moveX) > 0;

        //计算滑动距离
        var dx = gestureState.dx;

        if (__DEV__) {
          console.log('rightContainerWidth:', self._rightContainerWidth);
          console.log(
            'gesture state dx:', dx,
            ' isSwipeLeft: ', isSwipeLeft,
            ' isSwipeRight: ', isSwipeRight);
        }

        var currentOffsetX = self.state.pan._value + dx;

        //如果右滑，且当前的位置>=0，不允许再滑动
        if (isSwipeRight && currentOffsetX >= 0) {
          return false;
        } else if (isSwipeRight) {
          Animated.spring(self.state.pan, {
            toValue: currentOffsetX,
            friction: 50,
            tension: 200
          }).start();
        }

        //如果左滑，且超过右侧的宽度的时候，不再滑动
        if (isSwipeLeft && (currentOffsetX + self._rightContainerWidth) <= 0) {
          return false;
        } else if (isSwipeLeft) {
          Animated.spring(self.state.pan, {
            toValue: currentOffsetX,
            friction: 50,
            tension: 200
          }).start();
        }
      },


      /**
       * 释放拖动
       */
      onPanResponderRelease(e, gestureState) {
        //是不是正在右滑
        var isSwipeRight = (gestureState.moveX - gestureState.x0) > 0;

        //是不是左滑动
        var isSwipeLeft = (gestureState.x0 - gestureState.moveX) > 0;

        //计算滑动距离
        var dx = gestureState.dx;

        if (isSwipeLeft && (self.state.pan._value + self._rightContainerWidth) == 0) {
          return false;
        }

        if (isSwipeRight && self.state._value == 0) {
          return false;
        }

        if (__DEV__) {
          console.log('rightContainerWidth:', self._rightContainerWidth);
          console.log(
            'release gesture state dx:', dx,
            ' isSwipeLeft: ', isSwipeLeft,
            ' isSwipeRight: ', isSwipeRight);
        }


        if (isSwipeLeft) {
          Animated.spring(self.state.pan, {
            toValue: Math.abs(dx) >= (self._rightContainerWidth / 3) ? -self._rightContainerWidth : 0
          }).start();
        } else {
          Animated.spring(self.state.pan, {
            toValue: Math.abs(dx) >= (self._rightContainerWidth / 3) ? 0 : -self._rightContainerWidth
          }).start();
        }
      }
    });
  },


  render() {

    return (
      <View
        ref={(container) => this.container = container}
        style={styles.container}>
        {/*右侧区域*/}
        <View
          onLayout={(e) => {
            this._rightContainerWidth = e.nativeEvent.layout.width;
          }}
          style={styles.right}>
          {this.props.renderRight()}
        </View>
        {/*内容区域*/}
        <Animated.View
          onLayout={(e) => {
            //因为React-Native layout的bug，所有我们需要hack一下。
            this.container.setNativeProps({
              //height: e.nativeEvent.layout.height
              style: {height: e.nativeEvent.layout.height}
            });
          }}
          {... this._panResponder.panHandlers}
          style={[styles.content, {
              transform: [{
                translateX: this.state.pan
              }]
          }]}>
          {this.props.renderContent()}
        </Animated.View>
      </View>
    );
  }
});


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  content: {
    flex: 1
  },
  right: {
    flex: 1,
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  }
});


export default Swiper;