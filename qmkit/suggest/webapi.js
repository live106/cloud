/**
 * Created by liuzhaoming on 15/12/28.
 */
import  QMFetch from '../fetch';
import QMConfig from '../config';


/**
 * 获取搜索关键词的提示
 * @param params
 */
const getSuggestion = (params) => {
  let url = `${QMConfig.HOST}/suggestions/completion?queryString=${params['queryString']}&size=${params['size'] || 10}`
  return QMFetch(url);
};

export {getSuggestion};
export default {getSuggestion};