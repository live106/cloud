/**
 * Created by hufeng on 12/18/15.
 */
import React from 'react';

import {View, Image, Text, ActivityIndicatorIOS, Animated, PixelRatio, StyleSheet} from 'react-native';

const LOADING_HEIGHT = 80;
const SCREEN_WIDTH = require('Dimensions').get('window').width;


class Indicator extends  React.PureComponent{

  constructor(props) {
    super(props);
    state =  {
      height: new Animated.Value(0)
    };

    this._renderPullOrPushTip = this._renderPullOrPushTip.bind(this);
    this._renderRefresh = this._renderRefresh.bind(this);
  }

  static defaultProps = {
      mode: 'refresh',
      height: 0
  }



  componentWillReceiveProps(nextProps){
    if (nextProps.height != this.props.height) {
      if (nextProps.height == 0) {
        //动画特殊处理
        Animated.timing(this.state.height, {
          toValue: 0,
          duration: this.props.duration
        }).start();
      } else {
        this.state.height.setValue(nextProps.height);
      }
    }
  }


  render() {
    // 当前的刷新状态
    // pull 正在下拉，
    // push 正在上题
    const mode = this.props.mode;

    return (
      <Animated.View style={{
        overflow: 'hidden',
        height: this.state.height
      }} >
        {!mode||mode == 'refresh' ? this._renderRefresh() : this._renderPullOrPushTip()}
      </Animated.View>
    );
  }

  _renderRefresh(){
    return (
      <View style={styles.refresh}>
        <ActivityIndicatorIOS size='small'/>
        <Text style={styles.text} allowFontScaling={false}>正在加载...</Text>
      </View>
    );
  }


  _renderPullOrPushTip(){
    const mode = this.props.mode;

    return (
      <View style={styles.refresh}>
        {
          mode === 'push'
            ? <Image style={styles.arrow} source={require('./img/arrow_up.png')}/>
            : <Image style={styles.arrow} source={require('./img/arrow_down.png')}/>
        }
        <Text style={styles.text} allowFontScaling={false}>{mode === 'push' ? '松手更新' : '下拉刷新'}</Text>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  refresh: {
    width: SCREEN_WIDTH,
    height: LOADING_HEIGHT,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderColor: '#ebebeb',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 14,
    color: '#999',
    marginLeft: 5
  },
  arrow: {
    width: 20,
    height: 20
  }
});

export {
  Indicator,
  LOADING_HEIGHT
}
