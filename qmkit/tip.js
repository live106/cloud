/**
 * tip组件
 * @type {ReactNative|exports|module.exports}
 */
import React from 'react';

import {Text, StyleSheet} from 'react-native';

import QMOverlay from './overlay';


//yeah, just do nothing.
const noop = {};


/**
 * Usage
 *
 * var {QMTip} = require('qmtip');
 *
 *
 */
class QMTip extends React.Component{


  static defaultProps = {

      //是否显示
      visible: false,
      //显示的消息的内容
      text: '',
      //是否模态
      modal: false,
      //消失时间
      time: 2000,
      //tip消失后的callback
      onTipDisappear: noop
    }


  state = {
    visible: this.props.visible
  }

  componentDidMount(){
    //如果当前是显示状态
    if (this.state.isVisible) {
      //默认2s后关闭
      setTimeout(() => {
        this.setState({
          visible: false
        });

        this.props.onTipDisappear();

      }, this.props.time);
    }
  }


  componentWillReceiveProps(nextProps){
    if (nextProps.visible) {
      //如果当前的属性为显示状态，则立刻去显示
      this.setState({
        visible: true
      });

      //默认2s后关闭
      this.timer=setTimeout(() => {
        this.setState({
          visible: false
        });

        this.props.onTipDisappear();

      }, this.props.time);
    }
  }

  // componentDidUnmont(){
  //   this.timer&&this.clearTimeout(this.timer);
  // }

  render() {
    //如果不现实直接remove掉
    if (!this.state.visible) {
      return null;
    }

    return (
      <QMOverlay
        style={this.props.style}
        modal={this.props.modal}>
        <Text style={styles.text} allowFontScaling={false} numberOfLines={3}>
          {this.props.text}
        </Text>
      </QMOverlay>
    );
  }
}


const styles = StyleSheet.create({
  text: {
    color: '#FFF'
  }
});

export default QMTip;