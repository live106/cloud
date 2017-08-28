/**
 * Created by hufeng on 1/14/16.
 */
import React from 'react';

import {View, TouchableHighlight} from 'react-native';
const noop = () => {};


/**
 * 统一包装Touch
 */
class QMTouch extends React.Component{

  static defaultProps = {
    disabled: false,
    onPress: noop,
    disStyle: {backgroundColor: '#ddd'},
    underlayColor: '#fff'
  };
  constructor(props){
    super(props);
    this.state = {
      disabled: this.props.disabled
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.disabled != this.props.disabled) {
      this.setState({
        disabled: nextProps.disabled
      })
    }
  }


  render(){
    return (
      <TouchableHighlight
        underlayColor={this.props.underlayColor}
        activeOpacity={(this.state.disabled || this.props.disabled) ? 1 : 0.8}
        onPress={this._handlePress}
        style={[this.props.style, this.state.disabled && this.props.disStyle]}>
        <View style={this.props.contentStyle}>
          {this.props.children}
        </View>
      </TouchableHighlight>
    );
  }


  _handlePress(){
    if (!this.state.disabled && !this.props.disabled) {
      this.setState({
        disabled: true
      }, () => {
        this.setTimeout(() => {
          this.setState({
            disabled: false
          });
        }, 1500);
        this.props.onPress();
      });
    }
  }
}

export default QMTouch;
