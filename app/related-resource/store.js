/**
 * Created by Colin on 2017/8/27.
 */
import {Store, msg} from 'iflux-native';
import {AsyncStorage} from 'react-native';

/**
 * 数据中心
 */
let appStore = Store({
  currentCourse: null,
  freshAction: null,
  freshId: null
});

export default appStore;
