/**
 * Created by Colin on 2017/8/27.
 */
import {Store, msg} from 'iflux-native';
import webapi from './webapi';
import {AsyncStorage, ListView} from 'react-native';

/**
 * 数据中心
 */
let appStore = Store({
  dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
  pushCourseInfo: null,
  noData: true,
  userId: null
});

msg.on('tab1:init', init);

function init() {

  webapi.getContent(window.id, window.locateCode)
    .then((json) => {
      const cursor = appStore.cursor();
      cursor.set('userId', window.id)
      if (json.code === 1000) {
        if (json.data === null) {
          if (_page === 0) {
            cursor.set('noData', true);
          } else {
            cursor.set('noData', false);
          }
          cursor.set('dataSource', appStore.data().get('dataSource').cloneWithRows(json.data));

          // this.setState({
          //   dataSource: this.state.dataSource.cloneWithRows(json.data),
          // });
        } else {
          cursor.set('noData', false);
          cursor.set('dataSource', appStore.data().get('dataSource').cloneWithRows(json.data));
          // this.setState({
          //   dataSource: this.state.dataSource.cloneWithRows(json.data),
          // });
        }
      } else {
        cursor.set('noData', true);
      }
    })
    .catch((error) => {
      if (__DEV__) {
        console.log(error);
      }
    })
};

export default appStore;