/**
 * Created by hufeng on 1/26/16.
 */
import React from 'react';

import {View, Dimensions, StyleSheet} from 'react-native';
const {width: SCREEN_WIDTH} = Dimensions.get('window');



class ChildComponent extends React.Component{

    state =  {
      selected: false
    }


  shouldComponentUpdate(nextProps){
    return this.refs.child == null;
  }


  render() {
    return (this.props.selected ? React.cloneElement(this.props.children, {
      ref: 'child'
    }) : null);
  }
}

export default class ViewContainer extends React.Component{

    state =  {
      selected: false
    }

  render() {
    //返回延迟加载的组件,当selected为true时,才去真正的render组件
    return (
      <View style={[styles.content, this.props.selected && styles.selected]}>
        <ChildComponent selected={this.props.selected}>
          {this.props.children}
        </ChildComponent>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  content: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: -SCREEN_WIDTH,
    width: SCREEN_WIDTH
  },
  selected: {
    left: 0
  }
});

