import {
  QMConfig,
  QMFetch
} from 'qmkit';
import {AsyncStorage,Platform} from 'react-native'
import Crypto from '../util/Crypto';

/**
 * 认证
 *
 * @param user
 * @param password
 * @returns {*}
 */
const auth = (user, password) => {
  const encryptStr = Crypto.encrypt(password);
  //request object
  const request = {
    method: 'POST',
    headers: {
      channel:Platform.OS === 'ios' ? 4:3,
    },
    body: JSON.stringify({
      userName: user,
      password: encryptStr,
    }),
  };

  return QMFetch(`${QMConfig.HOST}/api/v1/security/login`, request, {showLoading: true});
};


export {auth};
export default {auth};