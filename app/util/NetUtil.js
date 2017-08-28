/**
 * Created by TaoLee on 2017/7/28.
 */
import React from 'react';
import {
  Alert,
  AsyncStorage,
  Platform,
}from'react-native'
let serverAddress = 'http://api.xuezheyoushi.com/';
let HTTPUtil = {};

/**
 * 基于 fetch 封装的 GET请求
 * @param url
 * @returns {Promise}
 */
HTTPUtil.get = function (url) {
  return new Promise(function (resolve, reject) {
    fetch(serverAddress + url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        token: AsyncStorage.getItem('token') || null,
        channel:Platform.OS === 'ios' ? 4:3,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          reject({status: response.status})
        }
      })
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject({status: -1});
      })
  })
};


/**
 * 基于 fetch 封装的 POST请求  FormData 表单数据
 * @param url
 * @param formData
 * @param headers
 * @returns {Promise}
 */
HTTPUtil.post = function (url, formData) {
  return new Promise(function (resolve, reject) {
    fetch(serverAddress + url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        token: AsyncStorage.getItem('token') || null,
        channel:Platform.OS === 'ios' ? 4:3,
      },
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          reject({status: response.status})
        }
      })
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject({status: -1});
      })
  })
};

//使用示例
// HTTPUtil.post(url, body).then((json) => {
//   //处理 请求success
//   if (json.code === 1000) {
//     Alert.alert('登陆成功')
//     //DO SOMETHING
//   } else {
//     Alert.alert('异常')
//     //处理自定义异常
//     // this.doException(json);
//   }
// }, (json) => {
//   Alert.alert('失败')
//   // this.doError(); TODO
// })

export default HTTPUtil;