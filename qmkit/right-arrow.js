import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';


class RightArrow extends React.Component{

  static defaultProps = {
    text: '',
    imageSource: '',
    showImageSource: false,
    imageSourceLocal: '',
    showRightImage: true
  };


  render() {
    return (
      <View style={[styles.view, this.props.style]}>

        <Text style={[styles.text, this.props.textStyle]} allowFontScaling={false}>
          {this.props.text}
        </Text>
        {
          this.props.showImageSource
          ?
            this.props.imageSource
            ? <Image source={{uri: this.props.imageSource}} style={styles.pic}/>
            : <Image source={require('./img/c_defaultImg.png')} style={styles.pic}/>
          :
            <Text/>
        }
        {
          this.props.imageSourceLocal
            ? <Image source={this.props.imageSourceLocal} style={[styles.smallPic, this.props.picStyle]}/>
            : <Text/>
        }
        {
          this.props.showRightImage
          ? <Image
            source={require('./img/right.png')}
            style={[styles.image, this.props.imageStyle]}/>
          : <Text/>
        }

      </View>
    )
  }
}


const styles = StyleSheet.create({
  view: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  text: {
    fontSize: 14,
    color: '#9E9E9E'
  },
  pic: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
  smallPic: {
    width: 15,
    height: 15
  },
  image: {
    marginLeft: 10,
    height: 15,
    width: 8
  }
});


export default RightArrow;
