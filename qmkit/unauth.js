/**
 * Created by hufeng on 1/5/16.
 */
const unAuthMap = {};


const unAuth = (App, appName) => {
  unAuthMap[appName] = true;
  return App;
};


export default {
  unAuthMap,
  unAuth
};