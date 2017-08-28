'use strict';

import React from 'react';
import {View, Dimensions, StyleSheet,
    TouchableOpacity, Animated, PanResponder, Platform, TouchableHighlight} from 'react-native';


const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isAndroid = Platform.OS === 'android';

class SlideMenu extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      showMenu: new Animated.ValueXY({x: SCREEN_WIDTH + 300, y: 0}),
      mask: new Animated.Value(0),
      visible: false,
      disabled: false
    };
    this.getStyle = this.getStyle.bind(this);
    this._handleOnPress = this._handleOnPress.bind(this);
  }

  componentWillMount(){
    var self = this;

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      /**
       * 处理响应事件
       */
      onPanResponderRelease(e, gestureState){
        //是不是正在右滑
        var isSwipeRight = (gestureState.moveX - gestureState.x0) > 0;
        if (isSwipeRight && gestureState.dx > 50) {
          self.props.closeMenu();
        }
      }
    });
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.visible) {
      this.setState({
        visible: true
      });
      Animated.parallel([
        Animated.timing(this.state.showMenu, {
          toValue: {x: SCREEN_WIDTH - 300, y: 0},
          duration: 300
        }),
        Animated.timing(this.state.mask, {
          toValue: 1
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(this.state.mask, {
          toValue: 0,
          duration: 200
        }),
        Animated.timing(this.state.showMenu, {
          toValue: {x: SCREEN_WIDTH + 300, y: 0},
          duration: 300
        })
      ]).start(() => this.setState({visible: false}));
    }
  }

  componentWillUnmount(){
    this.timer&&clearTimeout(this.timer);
  }


  render() {
    if (__DEV__) {
      console.log('state...change', this.state.visible)
    }
    if (this.state.visible) {
      return (
        <View style={styles.slideMenu}
          {... this._panResponder.panHandlers}
        >
          <TouchableOpacity
            style={[styles.mask, {opacity: 1}]}
            onPress={()=>this._handleOnPress()}/>
          <Animated.View style={this.getStyle()}>
            {this.props.children}
          </Animated.View>
        </View>
      )
    } else {
      return (
        <View />
      )
    }
  }


  getStyle() {
    if(__DEV__){
      console.log('slide-menu :  getStyle');
    }
    return [
      styles.menuContainer, {
        transform: this.state.showMenu.getTranslateTransform()
      }
    ]
  }


  /**
   * 控制疯狂地点击
   * @private
   */
  _handleOnPress(){
    if(__DEV__){
      console.log('slide-menu : _handleOnPress');
    }

    if(!this.state.disabled) {
      this.setState({
        disabled: true
      }, () => {
        this.timer = setTimeout(() => {
          this.setState({
            disabled: false
          });
        }, 1500);
        this.props.closeMenu();
      });
    }
  }
}


const styles = StyleSheet.create({
  slideMenu: {
    position: 'absolute',
    top: 0,
    left: 0
  },
  mask: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,.5)',
    width: SCREEN_WIDTH,
    height: isAndroid ? SCREEN_HEIGHT - 25 : SCREEN_HEIGHT
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    width: 300,
    height: isAndroid ? SCREEN_HEIGHT - 25 : SCREEN_HEIGHT,
    backgroundColor: '#fff'
  }
});


export default SlideMenu;
