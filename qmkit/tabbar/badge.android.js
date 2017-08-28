/**
 * Created by hufeng on 1/21/16.
 */
import React from 'react';

import {View, Text, StyleSheet} from 'react-native';


/**
 * badge组件
 */
export default class  Badge extends React.Component{

    state =  {
      badge: 0
    }



  render(){
    let count = this.props.badge;

    if (count >= 99) {
      count = 99;
    } else if (count < 10) {
      count = ' ' + this.props.badge + ' ';
    }

    return (
      <View style={styles.container}>
        <Text style={styles.text}>{count}</Text>
      </View>
    );
  }
}


var styles = StyleSheet.create({
  container: {
    paddingLeft: 5,
    paddingRight: 5,
    height: 15,
    backgroundColor: '#f00',
    borderRadius: 7,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    right: -10,
  },
  text: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 11
  }
});



