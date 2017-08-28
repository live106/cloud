'use strict';

import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {QMConfig} from 'qmkit'

/**
 * 页脚
 */
export default class Footer extends React.PureComponent{


  render() {
    return (
      <Text style={[styles.tip, this.props.style]} allowFontScaling={false}>{QMConfig.SUPPORTS}</Text>
    )
  }
}


const styles = StyleSheet.create({
  tip: {
    textAlign: 'center',
    color: '#bbb',
    padding: 15
  }
});



