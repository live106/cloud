import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  AsyncStorage,
  Platform,
  ScrollView,
  AlertIOS,
  InteractionManager
} from 'react-native';

import {
  msg,
  connectToStore
} from 'iflux-native';
import appStore from './store';

import Icon from 'react-native-vector-icons/EvilIcons';
import ToolView from './component/tool-view';

const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');


import TaskList from './component/task-list';

class Main extends Component {

  constructor(props) {
    super(props);
    this.renderContent=this.renderContent.bind(this);
  }


  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      msg.emit('main:getRelatedSourceCount');
    });
  }

  render() {
    const store = appStore.data();
    if (__DEV__) {
      console.log('main:render', store);
    }
    return (
      <View style={styles.container}>
        {this.renderTitle()}
        <ScrollView>
          <View style={styles.titleView}>
            <Text style={{color: '#333333'}}>当前课文：{store.get('currentCourse')}</Text>
          </View>
          <ToolView
            courseCount={store.get('courseCount')}
            baiKeCount={store.get('baiKeCount')}
            bookCount={store.get('bookCount')}
            askCount={store.get('askCount')}
            pushResource={this.pushResource}/>

          {/*<View style={styles.content}>*/}
            {/*{store.get('content') && this.renderContent()}*/}
          {/*</View>*/}
          <View style={styles.titleView}>
            <Text style={styles.taskProgress}>当前课程任务 0／4</Text>
            <Text style={styles.btnMoreTask}>更多</Text>
          </View>
          <TaskList/>
        </ScrollView>
      </View>
    );
  };

  renderTitle() {
    return (
      <View style={styles.navBarStyle}>
        {/*左边*/}
        <TouchableOpacity
          onPress={() => {
            msg.emit('route:goToNext', {sceneName: 'EpubReader'})
          }}>
          <Image style={styles.navScan} source={require('./img/imgScan.png')}/>
        </TouchableOpacity>
        {/*中间*/}
        <TextInput
          placeholder="搜索"
          style={styles.topInputStyle}
        />
        {/*右边*/}
        <View style={styles.rightNavViewStyle}>
          <TouchableOpacity
            onPress={() => {
              msg.emit('route:goToNext', {sceneName: 'Map'});
            }}>
            <Icon name="location" size={40} color="#2FA7FF" style={styles.navMap}/>
          </TouchableOpacity>
        </View>
      </View>
    )
  };

  renderContent() {
    return appStore.data().get('content').map((content) => {
      switch (content.resType) {
        case 1:
          content.icon = require('./img/RelatedCourse.png');
          content.title = '精品课程';
          break;
        case 2:
          content.icon = require('./img/RelatedBaiKe.png');
          content.title = '课文解析';
          break;
        case 3:
          content.icon = require('./img/RelatedBook.png');
          content.title = '名师导读';
          break;
        case 4:
          content.icon = require('./img/RelatedAsk.png');
          content.title = '学霸交流';
          break;
        default:
          break;
      }
      if (__DEV__) {
        console.log('switch', content);
      }
      return (
        <TouchableOpacity key={content.resType} activeOpacity={0.5} onPress={() => {

        }}>
          <View style={styles.innerViewStyle}>
            <Image source={require('./img/RelatedAsk.png')} style={styles.iconStyle} resizeMode={'stretch'}/>
            <Text style={{color: '#70bafa', marginTop: 3}}>{content.title}</Text>
            <Text style={{color: '#70bafa', marginTop: 3}}>{ '(' + content.count + ')'}</Text>
          </View>
        </TouchableOpacity>
      )
    });

  }

  pushResource = (sectionID) => {
    msg.emit('route:goToNext', {sceneName: 'RelatedResource', sourceItem: sectionID});
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  titleView: {
    width: width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
    borderRadius: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
    borderTopColor: '#e8e8e8',
    borderTopWidth: 1,
  },
  navBarStyle: {
    height: Platform.OS === 'ios' ? 64 : 44,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  navTitle: {
    color: '#333333',
    marginTop: Platform.OS === 'ios' ? 18 : 0,
    justifyContent: 'center'
  },
  topInputStyle: {
    width: width * 0.71,
    height: Platform.OS === 'ios' ? 35 : 40,
    marginTop: Platform.OS === 'ios' ? 18 : 10,
    // borderRadius: 17,
    paddingLeft: 10,
    color: '#2FA7FF'
  },
  rightNavViewStyle: {
    flexDirection: 'row',
    height: 64,
    alignItems: 'center'
  },
  navScan: {
    width: 25,
    height: 25,
    marginTop: Platform.OS === 'ios' ? 20 : 0,
    justifyContent: 'center'
  },
  navMap: {
    marginTop: Platform.OS === 'ios' ? 20 : 0,
    justifyContent: 'center'
  },
  taskProgress: {
    color: '#333333',
    flex: 7,
    alignItems: 'center',
    marginLeft: 130
  },
  btnMoreTask: {
    color: '#2FA7FF', flex: 1
  },
  innerViewStyle: {
    width: width / 2 - 20,
    height: 240,
    marginLeft: 10,
    marginTop: 10,
    backgroundColor: '#ff9966'
  },
  iconStyle: {
    width: 60,
    height: 60
  },
  content: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingRight: 10,
    paddingLeft: 10,
    width: width,
    height: 480,
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
});

export default connectToStore(appStore)(Main);