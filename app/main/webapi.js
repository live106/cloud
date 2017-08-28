/**
 * Created by Colin on 2017/8/27.
 */
import {
  QMConfig,
  QMFetch
} from 'qmkit';

const getUserLocation = (id) => {
  return QMFetch(`${QMConfig.HOST}/api/v1/user/relate/get-user-location?userId=${id}`);
};

const getResourceCount = (userId, locateCode) => {
  return QMFetch(`${QMConfig.HOST}/api/v1/resource/get-resource-count?userId=${userId}&locationCode=${locateCode}`);
};

export default  {
  getUserLocation,
  getResourceCount
};