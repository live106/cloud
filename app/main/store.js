/**
 * Created by Colin on 2017/8/27.
 */
import {Store, msg} from 'iflux-native';
import webapi from './webapi';
import {AsyncStorage} from 'react-native';

/**
 * 数据中心
 */
let appStore = Store({
  currentCourse: '未定位课文',//当前课程
  locateCode: '',//课程标识id
  content: [],
  courseCount: 0,//精品课程
  baiKeCount: 0,//课文解析
  bookCount: 0,//名师导读
  askCount: 0 //学霸交流
});

msg.on("main:getPositionInfo", getPositionInfo)
  .on("main:getRelatedSourceCount", getRelatedSourceCount);

async function getPositionInfo() {
  if (__DEV__) {
    console.log('执行了getPositionInfo', 'window.locateCode', window.locateCode)
  }
  const store = appStore.data();
  await webapi.getUserLocation(window.id).then((responseData) => {
    let courseSource = [];
    for (let i = 0; i < responseData.data.length; i++) {
      if (i === responseData.data.length - 1) {
        //  保留数组末尾的定位编码
        courseSource.push('<' + responseData.data[i].locationName + '>');

        appStore.cursor().set('locateCode', responseData.data[i].locationCode);
        window.locateCode=responseData.data[i].locationCode.toString();
      } else {
        courseSource.push(responseData.data[i].locationName);
      }
    }
    appStore.cursor().set('currentCourse', courseSource);

    // AsyncStorage.setItem('locate', store.get('currentCourse').join(''), (error) => {
    // });
    AsyncStorage.setItem('locateCode', store.get('locateCode').toString(), (error) => {
    });

    if (__DEV__) {
      console.log('return window.locateCode', window.locateCode)
    }
    return window.locateCode;
  }).catch((error) => {
    if(__DEV__){
      console.log('error',error);
    }
  });
}

async function getRelatedSourceCount() {
  if (__DEV__) {
    console.log('执行了getRelatedSourceCount', 'window.locateCode', window.locateCode)
  }
   await getPositionInfo();

  await webapi.getResourceCount(window.id, window.locateCode)
    .then((responseData) => {
      appStore.cursor().withMutations(
        (cursor) =>{
          cursor.set('content',responseData.data);
          for (let resource of responseData.data) {
            if (resource.resType === 1) {
              cursor.set('courseCount', resource.count);
            } else if (resource.resType === 2) {
              cursor.set('baiKeCount', resource.count);
            }
            if (resource.resType === 4) {
              cursor.set('bookCount', resource.count);
            }
            if (resource.resType === 5) {
              cursor.set('askCount', resource.count);
            }
          }
        }
      );
    }).catch(err => {
    if (__DEV__) {
      console.log(err)
    }
  })
}

export default appStore;