import React,{Component} from 'react';
import {View, Platform, StyleSheet, AsyncStorage, InteractionManager, LinkingIOS, IntentAndroid, NativeModules} from 'react-native';
import {msg} from 'iflux-native';
import AppRoute from './route';
import Login from  './login'

import {
  QMModalLoading,
  QMTip,
  QMDialog,
} from 'qmkit';

export default class KstoreApp extends Component {

  constructor(props = {}) {
    super(props);
    this.state = {
      showGuide: false,
      //loading为判断用户是否登录争取时间
      isInit: true,
      //错误tip的显示状态
      isTipVisible: false,
      //tip的text
      isTipText: '',
      // 弹出框
      alertVisible: false,
      alertTitle: '确定要继续吗?',
      alertMsgContent: undefined,
      alertCancelHandle: undefined,
      alertOkHandle: undefined,
      alertOkText: '确定',
      alertCancelText: '取消',
      alertChildren: null,
      alertDiaStyle: {},
    };
    //bind context
    this._handleAppTip = this._handleAppTip.bind(this);
    this._handleAlert = this._handleAlert.bind(this);
    this._setAlertVisible = this._setAlertVisible.bind(this);
    this._handleTipDisappear = this._handleTipDisappear.bind(this);

  }


  componentDidMount() {
    //全局的tip处理
    msg.on('app:tip', this._handleAppTip);

    //全局Alert处理
    msg.on('app:alert', this._handleAlert);
    msg.on('app:setAlertVisible', this._setAlertVisible);
  }


  /**
   * destroy
   */
  componentWillUnmount() {
    this.timer&&clearTimeout(this.timer);
    msg.removeListener('app:tip', this._handleAppTip);
    msg.removeListener('app:alert', this._handleAlert);
    msg.removeListener('app:setAlertVisible', this._setAlertVisible);
    msg.removeListener('tokenInvalid', this._handleTokenInvalid);
  }


  render() {
    if (__DEV__) {
      window._msg = msg;
      console.log('当前应用的状态:', this.state);
      console.log('showGuide..', this.state.showGuide);
    }

    if (!this.state.isInit) {
      return null;
    }

    return (
      <View style={styles.container}>
        <AppRoute />

        {/*弹出确认框*/}
        <QMDialog
          visible={this.state.alertVisible}
          title={this.state.alertTitle}
          msgContent={this.state.alertMsgContent}
          cancelHandle={this.state.alertCancelHandle}
          okHandle={this.state.alertOkHandle}
          cancelText={this.state.alertCancelText}
          okText={this.state.alertOkText}
          diaStyle={this.state.alertDiaStyle}
        >
          {this.state.alertChildren}
        </QMDialog>

        {/*全局的tip*/}
        <QMTip
          modal={false}
          text={this.state.isTipText}
          visible={this.state.isTipVisible}
          onTipDisappear={this._handleTipDisappear}/>

        <QMModalLoading/>
      </View>
    );


  }


  /**
   * 处理appTip
   */
  _handleAppTip(text){
    this.setState({
      isTipVisible: true,
      isTipText: text
    });
  }

  _setAlertVisible(visible){
    this.setState({
      alertVisible: visible
    });
  }


  /**
   * 处理alert
   */
  _handleAlert(props){
    if (__DEV__) {
      console.log("_handleAlert", props);
    }
    this.setState({
      alertVisible: true,
      alertTitle: props.title,
      alertMsgContent: props.msgContent,
      alertCancelHandle: props.cancelHandle,
      alertOkHandle: props.okHandle,
      alertDiaStyle: props.diaStyle,
      alertChildren: props.children,
      alertCancelText:props.cancelText,
      alertOkText:props.okText
    });
  }


  /**
   * 恢复tip的原始状态
   */
  _handleTipDisappear(){
    this.setState({
      isTipVisible: false,
      isTipText: ''
    });
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
