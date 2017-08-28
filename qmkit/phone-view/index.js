'use strict'

import React from 'react';
import {View, StyleSheet, Text} from 'react-native';


class PhoneView extends React.Component{

  componentDidMount() {
    //TODO
  }

  render() {
    let mobile = this.props.mobile;
    if(mobile){
      if (this.mobile && !(/^1\d{10}$/.test(this.mobile))) {
        msg.emit('app:tip', '手机号码不正确!');
        return;
      }
      mobile = mobile.substring(0,3) + '****' + mobile.substring(7);

      return (
        <View style={[styles.mobile, this.props.style]}>
          <Text style={{lineHeight: 20}} allowFontScaling={false}>{this.props.labelBefore}{mobile}{this.props.labelAfter}</Text>
        </View>
      );
    }else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  mobile: {

  }
})

export default PhoneView;
