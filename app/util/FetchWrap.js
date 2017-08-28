/**
 * Created by TaoLee on 2017/7/31.
 */
import React from 'react';
import {
  Alert
}from'react-native'
let serverAddress='http://192.168.0.88:28088';
class FetchWrap extends React.Component {

  static async fetchPost(path, requestBody) {
    await fetch(serverAddress+path, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        token: localStorage.getItem('token') || null,
      },
      body: requestBody === null ? null : JSON.stringify(requestBody),
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
      .then((json) => {
        if (json.code === 1000) {
          console.log(json);
        } else {
          Alert(json.message);
        }
      })
      .catch((error) => {
        console.warn('request failed', error);
      });
  }
  static async fetchGet(path) {
    await fetch(path, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        token: localStorage.getItem('token') || null,
      },
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
      .then((json) => {
        // console.log(json);
        if (json.code === 1000) {
          console.log(json);
        } else {
          Alert(json.message);
        }
      })
      .catch((error) => {
        console.warn('request failed', error);
      });
  }
}
export default FetchWrap;
