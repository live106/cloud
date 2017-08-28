'use strict';

import React from 'react';
import {View, Image, StyleSheet, PanResponder} from 'react-native';

class Rating extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      starWidth: this.props.rating * 24
    }
  }

  static defaultProps ={
    rating: 1,
    editable:true
  };


  componentWillMount() {
    if(!this.props.editable){
      //表示不可以编辑,
      return;
    }

    const self = this;

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gestureState) => true,
      onMoveShouldSetPanResponder: (e, gestureState) => true,

      onPanResponderMove(e, gestureState){
        if(e.nativeEvent.locationX > 0 && e.nativeEvent.locationX < 120) {
          self.setState({
            starWidth: Math.ceil(e.nativeEvent.locationX / 24) * 24
          });
        } else if(e.nativeEvent.locationX < 0) {
          self.setState({
            starWidth: 24
          });
        } else {
          self.setState({
            starWidth: 120
          });
        };
      },

      onPanResponderRelease(e, gestureState){
        if(e.nativeEvent.locationX > 0 && e.nativeEvent.locationX < 120) {
          self.setState({
            starWidth: Math.ceil(e.nativeEvent.locationX / 24) * 24
          });
        } else if(e.nativeEvent.locationX < 0) {
          self.setState({
            starWidth: 24
          });
        } else {
          self.setState({
            starWidth: 120
          });
        };
        self.props.callbackParent(self.state.starWidth / 24);
      }
    });
  }

  render() {
    return (
      <View {... this.props.editable ?this._panResponder.panHandlers : {}}>
        <Image
          style={[styles.ratingBar, this.props.style]}
          source={require('./img/stars.png')}>
          <View style={[styles.ratingWrapper, {width: this.state.starWidth}]}>
            <Image
              style={styles.ratingContent}
              source={require('./img/stars.png')}/>
          </View>
        </Image>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  ratingBar: {
    width: 120,
    height: 18
  },
  ratingWrapper: {
    overflow: 'hidden'
  },
  ratingContent: {
    width: 120,
    height: 18,
    tintColor: '#e63a59'
  }
});

export default Rating;
