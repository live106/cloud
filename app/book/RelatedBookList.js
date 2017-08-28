/**
 * Created by TaoLee on 2017/8/9.
 */
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  TouchableOpacity,
  Image,
  ListView,
} from 'react-native';
import NetUtil from '../util/NetUtil'
import Toast, {DURATION} from 'react-native-easy-toast'
export default class RelatedBookList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      pushBook: null,
      noData: true,
    };
  }

  componentWillMount() {
    let keys = ["id", "locateCode"];
    this.getSecondStorage(keys,this.loadRelatedCourseData);
  };

  getSecondStorage=(keys, callBack)=> {
    AsyncStorage.multiGet(keys, function (errs, result) {
      if (errs) {

      } else {
        userId = (result[0][1] !== null) ? result[0][1] : '';
        locateCode = (result[1][1] !== null) ? result[1][1] : '';
        callBack(userId, locateCode)
      }
    });
  };

  loadRelatedCourseData = (id, locateCode) => {
    let page = 0;
    let size = 12;
    //  暂时该用户定位没有数据，暂时替换个URL
    // const urlPath = '/api/v1/ebook/get-ebooks';
    console.log('图书11111111111111111111111111' + id + '2222222222222222222222222222222222222' + locateCode);
    NetUtil.get('/api/v1/ebook/get-ebooks?userId=' + id + '&resType=' + locateCode + '&page=' + page + '&size=' + size).then((json) => {
      if (json.code === 1000) {
        if (json.data === null) {
          if (_page === 0) {
            this.setState({noData: true})
          } else {
            this.setState({noData: false})
          }
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(json.data),
          });
        } else {
          this.setState({noData: false});
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(json.data),
          });
        }
      } else {
        this.setState({noData: true});
        console.log(json.message)
      }
    })
  };

  render() {
    if (this.state.noData === false) {
      return (
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          contentContainerStyle={styles.listViewStyle}
          removeClippedSubviews={false}
        >
          <Toast ref="toast"/>
        </ListView>
      );
    } else {
      return (
        <View style={{flex: 1, alignItems: "center", justifyContent: "center"} }><Text
          style={{alignItems: 'center', marginTop: 300}}>暂无数据</Text></View>
      );
    }
  };

  renderRow = (rowData) => {
    return (
      <TouchableOpacity activeOpacity={0.5} onPress={() => {
        this.pushBook(rowData.id)
      }}>
        <View style={styles.innerViewStyle}>
          <Image source={{uri: rowData.coverUrl.replace('http', 'https')}} style={styles.iconStyle}/>
          <Text style={styles.courseName}>{rowData.name.substring(0,13)}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  pushBook = (id) => {
    this.props.pushBook(id);
  };
};
let Dimensions = require('Dimensions');
let screenWidth = Dimensions.get('window').width;
let cols = 2;
let cellWH = 140;
let vMargin = (screenWidth - cellWH * cols) / (cols + 1);
let hMargin = 10;
const styles = StyleSheet.create({
  innerViewStyle: {
    width: 90,
    height: 150,
    marginLeft: vMargin,
    marginTop: hMargin,
    alignItems: 'center',
    borderWidth:1,
    borderColor:'#e5e5e5',
    borderTopWidth:0
  },
  iconStyle: {
    resizeMode:'contain',
    width: 150,
    height: 120
  },
  listViewStyle: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  courseName: {
    height: 60,
    fontSize:12
  }
});

