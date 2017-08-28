/**
 * Created by TaoLee on 2017/8/16.
 */
import React, {Component} from 'react';
import {
  AppRegistry,
  AsyncStorage,
  Alert,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  ListView,Dimensions
} from 'react-native';

const screenWidth = Dimensions.get('window').width;

import {QMHeader} from 'qmkit';
import ModalDropdown from 'react-native-modal-dropdown';
import HTTPUtil from '../util/NetUtil'
import Toast, {DURATION} from 'react-native-easy-toast'

const mapData = {

  data: [
    {
      image: require('../img/mapTempImage/class1.png'),
      positon: require('../img/mapTempImage/positon.png'),
    },
    {
      image: require('../img/mapTempImage/class2.png')
    },
    {
      image: require('../img/mapTempImage/class3.png'),
      positon: require('../img/mapTempImage/positon.png'),
    },
    {
      image: require('../img/mapTempImage/class4.png')
    },
    {
      image: require('../img/mapTempImage/class5.png'),
      positon: require('../img/mapTempImage/positon.png'),
    },
    {
      image: require('../img/mapTempImage/class6.png')
    },
    {
      image: require('../img/mapTempImage/class7.png')
    },
    {
      image: require('../img/mapTempImage/class8.png')
    },
    {
      image: require('../img/mapTempImage/class9.png')
    },
    {
      image: require('../img/mapTempImage/class10.png')
    },
    {
      image: require('../img/mapTempImage/class11.png'),
      positon: require('../img/mapTempImage/positon.png'),
    },
    {
      image: require('../img/mapTempImage/class12.png')
    },
    {
      image: require('../img/mapTempImage/class13.png')
    },
    {
      image: require('../img/mapTempImage/class14.png')
    },
    {
      image: require('../img/mapTempImage/class15.png')
    },
    {
      image: require('../img/mapTempImage/class16.png')
    },
    {
      image: require('../img/mapTempImage/class17.png')
    },
    {
      image: require('../img/mapTempImage/class18.png'),
      positon: require('../img/mapTempImage/positon.png'),
    },
    {
      image: require('../img/mapTempImage/class19.png')
    },
    {
      image: require('../img/mapTempImage/class20.png')
    },
    {
      image: require('../img/mapTempImage/class21.png'),
      positon: require('../img/mapTempImage/positon.png'),
    },
    {
      image: require('../img/mapTempImage/class22.png')
    },
  ]
};

const image = require('../img/mapTempImage/class16.png');
export default class Map extends Component {

  constructor(props) {
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    super(props);
    this.state = {
      dataSource: [],
      locationName: ['七年级上册', '七年级下册', '八年级上册', '八年级下册'],

      mapDataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(mapData.data),
      locateCode: 1,


      currentBookAtList: -1,//当前定位序号
      currentBookAtMap: 5,//当前定位序号
      // currentLocateCode: 102011010,//当前定位编码

      locate: '七年级上册',//选择显示文字
      locateBookCode: '',//当前册定位编码

    };
  }

  componentWillMount() {
    let keys = ["id", "locateCode"];
    this.getSecondStorage(keys, this.loadRelatedCourseData, this.loadClassCode);
  };

  getSecondStorage = (keys, callBack, callBackTwo) => {
    AsyncStorage.multiGet(keys, function (errs, result) {
      if (errs) {
      } else {
        userId = (result[0][1] !== null) ? result[0][1] : '';
        locateCode = (result[1][1] !== null) ? result[1][1] : '';
        callBack(userId, locateCode);
        callBackTwo(userId, locateCode);
      }
    });
  };
  loadRelatedCourseData = (userId, locateCode) => {
    this.setState({locateCode: locateCode});
    this.setState({locateBookCode: locateCode.substring(0, 6)});
    const url = `/api/v2/map/student/get-student-map/${userId}?locationCode=${locateCode.substring(0, 6)}`;
    HTTPUtil.get(url).then((json) => {
      if (json.code === 1000) {
        this.setState({
            dataSource: json.data.studentMapTexts,//this.state.dataSource.cloneWithRows(json.data.studentMapTexts)
          }
        );
      } else {
        this.refs.toast.show(json.message);
      }
    }, (json) => {
      this.refs.toast.show(json);
    });
  };
  loadClassCode = (userId, locateCode) => {
    const url = '/api/v2/user/location/get-volumes-codes';
    HTTPUtil.get(url).then((json) => {
      if (json.code === 1000) {
        const options = [];
        const code = [];
        json.data.map((item, index) => {
          options.push(json.data[index].locationName);
          code.push(json.data[index].locationCode);
          console.log(locateCode.substring(0, 6) + '^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')
          console.log(json.data[index].locationCode + '$$$$$$$$$$$$$$$$$$$$$$$$￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥￥');
          if (locateCode.substring(0, 6) === json.data[index].locationCode.toString()) {
            this.setState({currentBookAtList: index});
            console.log(index + '^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')
            console.log(this.state.currentBookAtList + '^^^^^^^^^^^^^^^^^^^^^^^^^^^00^^^^^^^^^^^^^^^^^^^^')
          }
        });
        this.setState({
            locationName: options,
            locationCode: code
          }
        );
      } else {
        this.refs.toast.show(json.message);
      }
    }, (json) => {
    });
  };

  selectionBook = (index) => {
    this.setState({
      locate: this.state.locationName[index],
      currentBookAtList: index
    });
  };
  setLocate = (rowData) => {
    this.setState({locateCode: rowData.locationCode});
    AsyncStorage.setItem('locateCode', rowData.locationCode, (error) => {
      if (error) {
        this.refs.toast.show('定位保存失败');
        console.log('_save error: ', '定位保存失败');
      } else {
        this.refs.toast.show('定位保存成功');
        console.log('_save error: ', '定位保存成功');
        Alert.alert('切换定位到《' + rowData.textName + '》');
      }
    });
  };

  popTopHome() {
    this.props.navigator.pop();
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <QMHeader title="地图"/>
        <View style={styles.top}>
          <Text style={styles.textInput}>{this.state.locationName[this.state.currentBookAtList]}</Text>
          <ModalDropdown
            style={{
              width: 40,
              height: 40,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#DDDDDE',
              justifyContent: 'center',
              backgroundColor: '#fff'
            }}

            select={this.state.locationName[this.state.currentBookAtList]}
            defaultIndex={this.state.currentBookAtList}//
            onSelect={(index) => this.selectionBook(index)}
            dropdownStyle={{width: screenWidth - 50, left: 5, marginTop: 10}}
            options={this.state.locationName}>
            <Text style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}> 选择</Text>
          </ModalDropdown>
        </View>
        <View style={{flex: 1, marginTop: 5}}>
          <ListView
            initialListSize={10000}
            // removeClippedSubviews={false}
            dataSource={new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(this.state.dataSource)}//  dataSource={this.state.mapDataSource}
            renderRow={this.renderRow}
            contentContainerStyle={styles.listViewStyle}
          />
        </View>
        <Toast ref="toast"/>
      </View>
    );
  };

  renderRow = (rowData) => {
    console.log(this.state.locateCode + '=========================================' + rowData.locationCode);
    let img;
    if (this.state.locateCode.toString() === rowData.locationCode.toString()) {
      console.log(this.state.locateCode + '===================!!!!!!!!!!!!!!!!======================' + rowData.locationCode);
      img = <Image source={require('../img/mapTempImage/positon.png')}
                   style={{width: 15, height: 20, marginTop: 5, marginLeft: 5}}/>
    }
    return (
      <TouchableOpacity key={rowData.index} onPress={() => {
        this.setLocate(rowData)
      }}>
        <View style={styles.innerViewStyle}>
          <Image source={image} style={{width: 100, height: 100}}>
            {img}
          </Image>
        </View>
      </TouchableOpacity>
    );
  };

};

let cols = 4;
let cellWH = screenWidth / 4;
let vMargin = (screenWidth - cellWH * cols) / (cols + 1);
let hMargin = 10;
const styles = StyleSheet.create({
  innerViewStyle: {
    width: cellWH,
    height: cellWH,
    // margin: 5,
    alignItems: 'center'
  },
  iconStyle: {
    width: 150,
    height: 110
  },
  listViewStyle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start'
  },
  courseName: {
    height: 60
  },
  top: {
    borderWidth: 1,
    borderColor: '#DDDDDE',
    marginRight: 5,
    marginLeft: 5,
    flexDirection: 'row',
    height: 40,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  navScan: {
    width: 25,
    height: 25,
    marginTop: Platform.OS === 'ios' ? 20 : 0,
    justifyContent: 'center'
  },
  topInputStyle: {
    color: '#333333',
    width: screenWidth * 0.71,
    marginTop: Platform.OS === 'ios' ? 18 : 0,
    textAlign: 'center',
    fontSize: 18,
  },
  rightNavViewStyle: {
    flexDirection: 'row',
    height: 64,
    alignItems: 'center'
  },
  navSave: {
    width: 25,
    height: 25,
    marginTop: Platform.OS === 'ios' ? 20 : 0,
    justifyContent: 'center'
  },
  textInput: {
    flex: 1,
    paddingLeft: (screenWidth - 50) / 2 - 30,
    color: '#000000',
    alignItems: 'center'
  }
});


