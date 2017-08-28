/**
 * Created by TaoLee on 2017/7/31.
 */
import React from 'react';

class CookiesWrap extends React.Component {
  // 设置cookie,目前设置的过期时间时一个星期
  static setCookie(name, value, day = 7) {
    document.cookie = `${name}=${value};max-age=${60 * 60 * 24 * day}`;
  }

  // 读取cookies
  static getCookie(name) {
    let arr;
    const reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`);
    if (arr = document.cookie.match(reg)) { return unescape(arr[2]); } else { return null; }
  }

  // 删除某个cookies
  static delCookie(name) {
    const exp = new Date();
    exp.setTime(exp.getTime() - 1);
    const cval = this.getCookie(name);
    if (cval != null) { document.cookie = `${name}=${cval};expires=${exp.toGMTString()}`; }
  }

  // 删除全部cookie
  static deleteAllCookies = () => {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i += 1) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
  }
}
export default CookiesWrap;
