'use strict';

import React from 'react';
import {TouchableOpacity, Image, StyleSheet} from 'react-native';

//do nothing
const noop = () => {};


class PwdChange extends React.Component{

  static defaultProps = {
    style: {},
    isHide: true,
    onPress: noop
  }
  
  render() {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={this.props.onPress}>
        <Image
          style={[styles.eye, this.props.style]}
          resizeMode='cover'
          source={this.props.isHide
            ? require('./img/eye-close.png')
            : require('./img/eye-open.png')}
        />
      </TouchableOpacity>
    );
  }
}


const styles = StyleSheet.create({
  eye: {
    width: 70,
    height: 40,
  }
});


export default PwdChange;
