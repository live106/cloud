/**
 * Created by Colin on 2017/8/27.
 */
import {
  QMConfig,
  QMFetch
} from 'qmkit';

const getContent = (id,locateCode) => {
  let page = 0;
  let size = 12;
  return QMFetch(`${QMConfig.HOST}/api/v1/course/get-courses?userId=${id}&code=${locateCode}&page=${page}&size=${size}`);
};

export default  {
  getContent
};