/**
 * Created by TaoLee on 2017/7/28.
 */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  TouchableOpacity,
  Image,
  TextInput
} from 'react-native';
import {
  QMButton
}from 'qmkit';
import {
  msg,
  connectToStore
} from 'iflux-native';
import appStore from './store';

class Login extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const store = appStore.data();
    return (
      <View style={LoginStyles.loginView}>
        <View style={{
          flexDirection: 'row',
          height: 100,
          marginTop: 70,
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}>
          <Image style={LoginStyles.img} source={require('./img/logo.png')}/>
        </View>
        <View style={{marginTop: 80}}>
          <View style={LoginStyles.TextInputView}>
            <TextInput
              style={LoginStyles.TextInput}
              placeholderTextColor={ '#2FA7FF'}
              underlineColorAndroid={'#ffffff'}
              placeholder={'请输入账户'}
              value={store.get('user')}
              clearButtonMode={'always'}
              onChangeText={(user) =>
                msg.emit('login:userChange', user)
              }/>
          </View>
          <View style={LoginStyles.TextInputView}>
            <TextInput
              style={LoginStyles.TextInput}
              placeholderTextColor={ '#2FA7FF'}
              underlineColorAndroid={'#ffffff'}
              placeholder={'请输入密码'}
              password={true}
              clearButtonMode={'always'}
              onChangeText={(password) => msg.emit('login:passwordChange', password)}/>
          </View>

          <View style={{marginTop:20}}>
            <QMButton
              style={{borderRadius:45,}}
              activeOpacity={0.8}
              ref={(btn) => this.btn = btn}
              onPress={() => this._handleLogin()}
              disabled={!(store.get('user') && store.get('password'))}>登录</QMButton>
          </View>

          <TouchableOpacity onPress={() => this.resetPassword}>
            <Text
              style={{color: "#4A90E2", textAlign: 'left', marginTop: 10}}>忘记密码？
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  componentDidMount(){
    AsyncStorage.getItem('user', (error, result)=>{
      if(result){
        appStore.cursor().set('user',result)
      }
    });
    AsyncStorage.getItem('password', (error, result)=>{
      if(result){
        appStore.cursor().set('password',result)
      }
    });
  }

  /**
   * 处理登录
   *
   * @private
   */
  _handleLogin() {
    if (__DEV__) {
      console.log('_handleLogin',this.props.nextSceneName, this.props.nextSceneParam);
    }
    msg.emit('login:auth',
      {
        nextSceneName: 'Home',
        nextSceneParam: this.props.nextSceneParam,
        isPassive: this.props.isPassive
      });
  }
}

const LoginStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loginView: {
    flex: 1,
    padding: 30,
    backgroundColor: '#ffffff',
  },
  img: {
    width: 80,
    height: 80
  },
  TextInputView: {
    marginTop: 10,
    height: 50,
    backgroundColor: '#ffffff',
    borderRadius: 45,
    borderWidth: 0.3,
    borderColor: '#2FA7FF',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  TextInput: {
    backgroundColor: '#ffffff',
    color: '#2FA7FF',
    height: 45,
    margin: 18,
  },
});

export default connectToStore(appStore)(Login);


