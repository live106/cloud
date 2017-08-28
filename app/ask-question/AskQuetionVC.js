/**
 * Created by TaoLee on 2017/8/1.
 */
import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Alert,
  Image,
  AsyncStorage,
  TouchableOpacity,
  Text,
  Platform,
  Button,
  Dimensions
} from 'react-native';

import {QMHeader} from 'qmkit'

const {width, height} = Dimensions.get('window');

import Netutil from '../util/NetUtil';
import Toast, {DURATION} from 'react-native-easy-toast';

class BaiKeAsk extends Component {
  constructor(props) {
    super(props);
    this.state = {
      askTitle:null,
      askDescribe:null,
      locate:""
    };
  }
  componentWillMount(){

    AsyncStorage.getItem('locate', (error, result) => {
      if (error) {
        console.log(error);
      } else {
        console.log(result);
        this.setState({
          locate:result
        });
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <QMHeader title="提问"/>
        <View style={styles.top}>
          <View style={styles.textSourceTitle}>
            <Text style={{marginLeft: 10, color:'#9e9e9e'}}>{this.state.locate}</Text>
          </View>
          <View style={styles.changeCourse}>
            <Text style={{color: 'white'}}>更换</Text>
          </View>
        </View>
        <TextInput style={styles.title} placeholder={'请输入问题标题'} placeholderTextColor={'#d6d7da'}
                   underlineColorAndroid={'#ffffff'} onChangeText={(text) => {
            this.askTitle = text;
          }
        }/>
        <TextInput style={styles.content} placeholder={'请输入问题描述'} placeholderTextColor={'#d6d7da'} multiline={true}
                   onChangeText={
                     (text) => {
                       this.askDescribe = text;
                     }}
        />
        <Toast ref="toast" fadeInDuration={1000}/>
      </View>
    )
  }

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

  getThirddStorage(key1, key2,key3, callBack) {
    AsyncStorage.getItem('id', (error, userId) => {
      if (error) {
      } else {
        console.log(userId)
      }
      AsyncStorage.getItem('locateCode', (error, code) => {
        if (error) {
        } else {
          console.log(code)
        }
        AsyncStorage.getItem('locate', (error, source) => {
          if (error) {
          } else {
            console.log(userId)
            console.log(code)
            console.log(source)
            callBack(userId, code,source)
          }
        })
      })
    })
  }
  sendAskAction =(userId,locationCode, source)=> {
    const urlPath = `/api/v1/qa/insert-question-data`;
    const body = JSON.stringify({
      "code": locationCode,
      "description": this.askDescribe,
      "source": source,
      "title": this.askTitle,
      "userId": userId
    });
    console.log(body)
    Netutil.post(urlPath, body)
      .then((responseData) => {
        console.log(responseData);
        if (responseData.code == 1000) {
          this.refs.toast.show('提问成功!');
          this.props.navigator.pop();

          //  返回刷新
          if(this.props.fresh){
            this.props.fresh(responseData.data.id)
          }
        } else {
          this.refs.toast.show(responseData.message);
        }
      })
      .catch((error) => {
        console.log(error);
        Alert.alert('Error');
      })
  };
  // 返回上一页面
  popTopHome(){
    this.props.navigator.pop();
  };
}
const styles = StyleSheet.create({
  container: {
    padding: 14,
    backgroundColor: '#ffffff',
    flex: 1
  },
  textSourceTitle: {
    borderRadius: 1,
    borderWidth: 1,
    borderColor: '#9e9e9e',
    flex: 5,
    marginRight: 10,
    justifyContent: 'center',
  },
  image: {
    height: 25,
    width: 25,
    marginLeft: 25
  },
  send: {
    height: 25,
    width: 25,
    marginRight: 14
  },
  from: {
    marginRight: 10,
    flex: 1,
    borderWidth: 1,
    borderColor: '#9e9e9e',
  },
  title: {
    marginTop: 20,
    height: 40,
    borderWidth: 1,
    borderColor: '#9e9e9e',
  },
  top: {
    marginTop:10,
    flexDirection: 'row',
    height: 40
  },
  content: {
    textAlign: 'left',
    textAlignVertical: 'top',
    marginTop: 20,
    borderColor: '#9e9e9e',
    borderWidth: 1,
    flex: 1,
    lineHeight: 20
  },

  navTitle:{
    color:'#ffffff',
    flex:1,
    marginTop:Platform.OS == 'ios' ? 18:0,
  },
  topInputStyle:{
    color:'#333333',
    width: width*0.71,
    textAlign:'center',
    fontSize: 18,
  },
  rightNavViewStyle:{
    flexDirection:'row',
    height:64,
    alignItems:'center'
  },
  btnAsk:{
    backgroundColor:'rgb(46,167,255)',
    height:49,
    width:width,
    justifyContent:'center',
    alignItems:'center'
  },
  btnAskText:{
    color:'#ffffff',
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
  changeCourse: {
    width: 48,
    height: 40,
    backgroundColor: '#2FA7FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
    flex: 1
  }
})

export default BaiKeAsk







