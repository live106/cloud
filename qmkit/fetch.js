import {AsyncStorage} from 'react-native';
import {msg} from 'iflux-native';
import config from './config';
const {HTTP_TIME_OUT} = config;
/**
 * 封装公共的fetch服务
 */
const QMFetch = (url, req, config) => {
  //默认参数
  let request = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + (window.token || '')
    }
  };

  //配置参数
  const cnf = Object.assign({}, {
    showLoading: false,
    showLoginView: true
  }, config);

  //对header做单独合并
  if (req && req.headers) {
    const mergeHeader =  Object.assign({}, request.headers, req.headers);
    request.headers = mergeHeader;
    delete req.headers;
  }

  //merge
  const merge = Object.assign({}, request, req);


  //去掉url中可能存在的//
  url = url.replace(/([^:])\/\//, '$1/');

  if (__DEV__) {
    console.log('请求->', url, '\n', JSON.stringify(merge, null, 2));
  }

  return new Promise((resolve, reject) => {
    let isServerOk = true;
    let httpStatus = 200;

    //超时优化
    let httpTimeout = setTimeout(() => {
      const err = {
        code: 'S-000002',
        message: '网络超时'
      };
      if (cnf.showLoading) {
        msg.emit('ModalLoading:hide');
      }
      msg.emit('app:tip', err.code + '-' + err.message);
      reject(err);
    }, 1000 * HTTP_TIME_OUT);


    //如果配置showLoading为true,显示modalloading
    if (cnf.showLoading) {
      msg.emit('ModalLoading:show');
    }


    fetch(url, merge)
      .then(res => {
        //清除网络超时
        clearTimeout(httpTimeout);

        //当前的http的状态
        httpStatus = res.status;
        //判断server是不是异常状态404，500等
        isServerOk = !!(res.status >= 200 && res.status < 300);

        //promise
        return res.json();
      })
      .then((res) => {
        //hide
        if (cnf.showLoading) {
          msg.emit('ModalLoading:hide');
        }
        if (isServerOk) {
          if (__DEV__) {
            console.info('响应->', httpStatus, url, '\n', res);
          }

          //数据正确返回
          resolve(res);
        } else {
          if (__DEV__) {
            console.info('响应->', url, httpStatus, '\n', res);
          }

          if (httpStatus == 401) {
            if(cnf.showLoginView){
              msg.emit('tokenInvalid');
            }
            //token过期或者校验错误,将token清除
            AsyncStorage.setItem('token', '');
            window.token = '';
          } else {
            if (res.code === 'K-000001') {
              // 系统异常隐藏
              msg.emit('app:tip', '您的网络不给力:(');
            } else {
              msg.emit('app:tip', res.message);
            }
          }
          reject(res);
        }
      })
      .catch((err) => {
        //清除网络超时
        clearTimeout(httpTimeout);

        if (cnf.showLoading) {
          msg.emit('ModalLoading:hide');
        }

        if (__DEV__) {
          console.info('QMFetchError:', err);
        }

        msg.emit('app:tip', '您的网络不给力:(');
        reject({
          code: 'K-000001',
          message: '网络错误'
        });
      })
      .done();
  });
};


export default QMFetch;