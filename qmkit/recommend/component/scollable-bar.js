/**
 * Created by liuzhaoming on 15/12/30.
 */
import React from 'react';

import {View, Text, StyleSheet, TouchableOpacity, Image, ListView, Dimensions, InteractionManager, PixelRatio} from 'react-native';

import {msg} from 'iflux-native';


const ScrollableBar = React.createClass({
  getDefaultProps(){
    return {
      tabSize: 4,
      topic: 'recommend:setSelectedBanner'
    };
  },


  getInitialState() {
    return {
      selectedTabIndex: 0,
    }
  },


  componentDidMount() {
    msg.on(this.props.topic, this._handleSelectedBanner);
  },


  componentWillUnmount() {
    msg.removeListener(this.props.topic, this._handleSelectedBanner);
  },


  render(){
    const tabSize = this.props.tabSize;
    var tabIndexArray = [];
    for (var i = 0; i < tabSize; i++) {
      tabIndexArray.push(i);
    }

    return (
      <View style={styles.container}>
        {
          tabIndexArray.map((index, k)=> {
            return <View key={k} style={this.state.selectedTabIndex === index ? styles.selectedBanner : styles.banner}/>
          })
        }
      </View>
    );
  },


  _handleSelectedBanner(tabIndex){
    this.setState({selectedTabIndex: tabIndex});
  }
});


var styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    height: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10
  },
  banner: {
    width: 20,
    height: 2,
    backgroundColor: '#eee',
    marginRight: 3,
  },
  selectedBanner: {
    width: 20,
    height: 2,
    backgroundColor: '#F03157',
    marginRight: 3,
  }
});


export default ScrollableBar;
