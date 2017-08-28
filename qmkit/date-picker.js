"use strict";

import React from 'react';
import {View, Text, Animated, DatePickerIOS, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';

//just do nothing
const noop = () => {};
const {
  width: WIDTH,
  height:HEIGHT
} = Dimensions.get('window');



class DatePicker extends React.Component{
  static defaultProps = {
    // 默认不显示
    visible: false,
    // 确定
    onSubmit: noop,
    // 取消
    onCancel: noop
  };
  /**
   * 初始化状态
   */
  constructor(props){
    super(props);
    this.state = {
      selectedDate: this.props.selectedDate || new Date(),
      //距离顶部的距离
      topValue: new Animated.Value(0)
    }
  }

  /**
   * 改变新属性
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible != this.props.visible) {
      //开始动画
      Animated.spring(this.state.topValue, {
        toValue: nextProps.visible ? HEIGHT : 0,
        friction: 10,
        tension: 30
      }).start();
    }

    if (nextProps.selectedDate) {
      this.setState({
        selectedDate: nextProps.selectedDate
      });
    }
  }


  componentWillMount() {
    //开始动画
    Animated.spring(this.state.topValue, {
      toValue: this.props.visible ? HEIGHT : 0,
      friction: 10,
      tension: 30
    }).start();
  }


  render() {
    return (
      <Animated.View style={[styles.container, {
          top: this.state.topValue.interpolate({
            inputRange: [0, HEIGHT],
            outputRange: [HEIGHT, 0]
          })
        }]}>

        <View style={styles.region}>

          {/*头部按钮*/}
          <View style={styles.nav}>
            <TouchableOpacity style={styles.btn} onPress={this._handleCancel}>
              <Text style={styles.text} allowFontScaling={false}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={this._handleSubmit}>
              <Text style={styles.text} allowFontScaling={false}>确认</Text>
            </TouchableOpacity>
          </View>

          <DatePickerIOS
            date={this.state.selectedDate}
            mode="date"
            onDateChange={this._changeDate}/>
        </View>
      </Animated.View>
    );
  }
  
  /**
   * 处理取消
   */
  _handleCancel() {
    this.props.onCancel()
  }
  
  /**
   * 处理确定
   */
  _handleSubmit() {
    this.props.onSubmit({
      date: this.state.selectedDate
    })
  }


  _changeDate(date) {
    this.setState({
      selectedDate: date
    });
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: WIDTH,
    height: HEIGHT,
    left: 0,
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  nav: {
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#3d85cc',
    flexDirection: 'row'
  },
  btn: {
    padding: 15,
  },
  text: {
    color: '#FFF',
    fontSize: 16
  },
  region: {
    flex: 1,
    marginTop: HEIGHT / 2,
    backgroundColor: '#FFF'
  },
  regionArea: {
    flexDirection: 'row'
  },
  regionItem: {
    flex: 1
  }
});


export default DatePicker;
