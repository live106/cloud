/**
 * Created by TaoLee on 2017/8/1.
 */
import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Platform,
  Alert,
  Image,
  Text,
  AsyncStorage,
  TouchableOpacity,
  Button,
} from 'react-native';
import NetUtil  from '../../util/NetUtil'
import Toast, {DURATION} from 'react-native-easy-toast';
import {QMHeader} from 'qmkit'

let userId = '';
class BaiKeAsk extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: '',
      locate: '',
      baiKeId: '',
      description: '',
      text: '',
      extensionId: '',
      resourceId: '',
      locateC: '',
    };
  }

  componentWillMount() {
    AsyncStorage.getItem('id', (error, result) => {
      if (error) {
        this.refs.toast.show(error);
      } else {
        userId = result;
      }
    });
    AsyncStorage.getItem('locate', (error, result) => {
      if (error) {
        this.refs.toast.show(error);
      } else {
        this.setState({location: result});
      }
    });
    AsyncStorage.getItem('locateCode', (error, result) => {
      if (error) {
        this.refs.toast.show(error);
      } else {
        this.setState({locateC: result});
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <QMHeader title='提问'/>
        <View style={styles.top}>
          <TextInput
            style={styles.from}
            placeholder={this.state.location}
            placeholderTextColor={'#d6d7da'}
            underlineColorAndroid={'#ffffff'}
            onChangeText={(text) => {
              this.setState({location})
            }}
            value={this.state.location}/>
          <View style={styles.changeCourse}>
            <Text style={{color: 'white'}}>更换</Text>
          </View>
        </View>
        <TextInput
          style={styles.title}
          placeholder={'请输入问题标题'}
          placeholderTextColor={'#d6d7da'}
          underlineColorAndroid={'#ffffff'}
          onChangeText={(text) => {
            this.setState({text})
          }}
          value={this.state.text}/>
        <TextInput style={styles.content}
                   placeholder={'请输入问题描述'}
                   multiline={true}
                   placeholderTextColor={'#d6d7da'}
                   underlineColorAndroid={'#ffffff'}
                   onChangeText={(text) => {
                     this.setState({description: text})
                   }}
                   value={this.state.description}/>
        <Toast ref="toast" fadeInDuration={1000}/>
      </View>
    )
  }

  send() {
    const urlPath = `/api/v1/qa/add-question`;
    const body = JSON.stringify({
      baiKeId: this.props.baiKeId,
      description: this.state.description,
      extensionId: this.props.extensionId,
      resCategory: this.props.type,
      source: this.state.locateC,
      resourceId: this.props.ebookId,
      title: this.state.text,
      userId: userId,

    });
    console.log(body + '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
    NetUtil.post(urlPath, body).then((json) => {
      if (json.code === 1000) {
        this.refs.toast.show('提问成功');
        this.props.navigator.pop();
      } else {
        this.refs.toast.show(json.message);
      }
    }, (json) => {
      this.refs.toast.show('提问失败');
    })
  }

  popTopHome() {
    this.props.navigator.pop();
  };

  changeLocate() {
    Alert.alert('地图暂未开放')
  }
}

let Dimensions = require('Dimensions');
let ScreenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  changeButton: {
    backgroundColor: '#2FA7FF',
    height: 40,
    width: 48,
    borderRadius: 0,
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center'
  },
  navScan: {
    width: 25,
    height: 25,
    marginTop: Platform.OS === 'ios' ? 20 : 0,
    justifyContent: 'center'
  },
  topInputStyle: {
    color: '#333333',
    width: ScreenWidth * 0.71,
    marginTop: Platform.OS === 'ios' ? 18 : 0,
    textAlign: 'center',
    fontSize: 18,
  },
  rightNavViewStyle: {
    flexDirection: 'row',
    height: 64,
    alignItems: 'center'
  },
  navSave: {
    width: 25,
    height: 25,
    marginTop: Platform.OS === 'ios' ? 20 : 0,
    justifyContent: 'center'
  },
  container: {
    paddingLeft: 14,
    paddingRight: 14,
    paddingBottom: 14,
    backgroundColor: '#ffffff',
    flex: 1
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
    color: '#9e9e9e',
    marginRight: 10,
    flex: 5,
    borderWidth: 1,
    borderColor: '#9e9e9e',
    height: 40
  },
  title: {
    marginTop: 20,
    height: 40,
    borderWidth: 1,
    borderColor: '#9e9e9e',
  },
  top: {
    flexDirection: 'row',
    height: 40,
    marginTop: 6
  },
  content: {
    textAlign: 'left',
    textAlignVertical: 'top',
    marginTop: 20,
    borderColor: '#9e9e9e',
    borderWidth: 1,
    flex: 1,
    padding: 5,
    lineHeight: 20
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







