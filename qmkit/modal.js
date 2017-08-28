/**
 * Created by pingchen on 15/12/21.
 */
import React from 'react';

import {View, addons, Animated, Dimensions, StyleSheet} from 'react-native';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

class Modal extends React.Component{
  
  static defaultProps = {
      //是否显示model
      visible: false
  };


    state =  {
      top: new Animated.Value(SCREEN_HEIGHT)
    }
  componentWillReceiveProps(nextProps){

    if(nextProps.visible){
      Animated.timing(this.state.top, {
        toValue: 0,
        duration: 400
      }).start();
    }else{
      Animated.timing(this.state.top, {
        toValue: SCREEN_HEIGHT,
        duration: 400
      }).start();
    }
  }


  render() {

    return (
      <Animated.View style={[styles.container, {
        top: this.state.top
      }]}>
        {this.props.children}
      </Animated.View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    top: SCREEN_HEIGHT,
    left: 0,
    right: 0
  }
});


export default Modal;