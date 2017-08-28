'use strict';

import React from 'react';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';

class Stars extends React.Component{
  
  render() {
    return (
      <Image
        style={styles.starsBox}
        source={require('./img/stars.png')}>
        <View
          style={[styles.starsValue, this.props.star && styles[this.props.star]]}>
          <Image
            style={[styles.starsBox, {tintColor: '#e63a59'}]}
            source={require('./img/stars.png')}
          />
        </View>
      </Image>
    );
  }
}


const styles = StyleSheet.create({
  starsBox: {
    width: 80,
    height: 15,
  },
  starsValue: {
    width: 0,
    height: 15,
    overflow: 'hidden',
  },
  star5: {
    width: 80,
  },
  star4: {
    width: 64,
  },
  star3: {
    width: 48,
  },
  star2: {
    width: 32,
  },
  star1: {
    width: 16,
  },
  star0: {
    width: 0,
  },
});


export default Stars;