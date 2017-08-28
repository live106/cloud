import {Store, msg} from 'iflux-native';
import {AsyncStorage} from 'react-native';
import webapi from './webapi';


/**
 * 数据中心
 */
let appStore = Store({
  user: '',
  password: '',
  isHide: true // 密码隐藏按钮标记
});

export default appStore;


msg.on("login:auth", auth)
  .on("login:passwordChange", passwordChange)
  .on("login:userChange", userChange);

/**
 * 登录鉴权
 */
async function auth(params) {
  if (__DEV__) {
    console.log('params is ->', params);
  }
  try {
    const nextSceneName = params.nextSceneName;
    const nextSceneParam = params.nextSceneParam;

    const store = appStore.data();
    //验证
    const res = await webapi.auth(store.get('user'), store.get('password'));
    window.token = res.token;
    window.id=res.data.id;

    AsyncStorage.setItem('user', store.get('user'));
    AsyncStorage.setItem('password', store.get('password'));

    await AsyncStorage.setItem('token', res.token);
    AsyncStorage.setItem('userName', res.data.userName);
    AsyncStorage.setItem('id', res.data.id);

    if(nextSceneName){
      // 如果指定了登录成功后跳转的页面，则替换成指定页面
      if(__DEV__){
        console.log('route:replaceRoute: 进入了Home' ,nextSceneName);
      }
      msg.emit('route:replaceRoute', {sceneName: nextSceneName, ...nextSceneParam});
    }else{
      //返回上一级,且做刷新
      msg.emit('route:replaceToOffset', -1, true);
    }
  } catch (err) {
    if (__DEV__) {
      console.log(err);
    }

    if ('K-000002' === err.code) {
      msg.emit('app:tip', '账号信息错误!');
    }
  }
}

/**
 * 密码输入改变
 * @param password
 */
function passwordChange(password) {
  appStore.cursor().set('password', password);
}

/**
 * 用户输入改变
 * @param user
 */
function userChange(user) {
  appStore.cursor().set('user', user);
}








