/**
 * Created by liuzhaoming on 15/12/29.
 */
import QMConfig from '../config';
import QMFetch from '../fetch';


/**
 * 根据商品内容推荐商品
 * @param params
 * @returns {*}
 */
const recommendByContent = (params) => {
  var requestParam = {size: 12, ids: ''};
  if (params['size']) {
    requestParam['size'] = params['size'];
  }

  if (params['ids']) {
    requestParam['ids'] = params['ids'];
  }

  if (__DEV__) {
    console.log("Recommend by content ", params, requestParam)
  }

  return QMFetch(`${QMConfig.HOST}/recommendations/content?size=${requestParam['size'] || 12}&ids=${requestParam['ids']}`);
};


export {recommendByContent};
export default {recommendByContent};