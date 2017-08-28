import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  AsyncStorage
} from 'react-native';

var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');

import Netutil from '../util/NetUtil';
import Toast, {DURATION} from 'react-native-easy-toast';

export default class TSListB extends Component {

  constructor(props) {
    super(props);
    this.state = {
      answerContent:null
    };
  };

  render() {
    return (
      <View style={styles.container}>
        <QMHeader title="回答问题"/>
        <TextInput style={styles.content} placeholder={'请输入问题描述'} placeholderTextColor={'#d6d7da'} multiline={true}
                   onChangeText={
                     (text) => {
                       this.answerContent = text;
                     }}
        />
        <Toast ref="toast" fadeInDuration={1000}/>
      </View>
    );
  };


  //获取数据
  getObject(key,callback)
  {
    AsyncStorage.getItem(key, (error, object) => {
      if (error) {
        console.log('Error:' + error.message);
      } else {
        callback(object);
      }
    })
  };
  sendAction=(userId)=> {
    var body = JSON.stringify({
      "answerContent": this.answerContent,
      "questionId": this.props.questionId,
      "userId": userId
    });
    console.log(body)
    Netutil.post('/api/v1/qa/insert-answer', body)
      .then((responseData) => {
        console.log(responseData.code);
        if (responseData.code === 1000) {
          this.refs.toast.show('回答成功!');
          this.props.navigator.pop();
          if(this.props.fresh){
            this.props.fresh()
          }

        } else {
          this.refs.toast.show(responseData.message);
        }
      })
      .catch((error) => {
        console.log(error);
      })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  navTitle: {
    color: 'white',
    flex: 1,
    marginTop: Platform.OS == 'ios' ? 18 : 0,
  },
  topInputStyle: {
    color: '#333333',
    width: width * 0.71,
    marginTop: Platform.OS == 'ios' ? 18 : 0,
    textAlign: 'center',
    fontSize: 18,
  },
  rightNavViewStyle: {
    flexDirection: 'row',
    height: 64,
    alignItems: 'center'
  },
  content: {
    textAlign: 'left',
    textAlignVertical: 'top',
    marginTop: 20,
    borderColor: '#9e9e9e',
    borderWidth: 1,
    flex: 1,
    lineHeight: 20,
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20
  },
  navScan:{
    width:25,
    height:25,
    marginTop:Platform.OS == 'ios' ? 20:0,
    justifyContent:'center'
  },
  navSave:{
    width:25,
    height:25,
    marginTop:Platform.OS == 'ios' ? 20:0,
    justifyContent:'center'
  },
});

