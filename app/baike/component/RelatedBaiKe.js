/**
 * Created by TaoLee on 2017/8/9.
 */
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AsyncStorage,
  Image,
  ListView,
} from 'react-native';
import NetUtil from '../../util/NetUtil'
import Toast, {DURATION} from 'react-native-easy-toast'
let userId = '';
let locateCode = '';
export default class RelatedBaiKe extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      pushBaiKe: null,
      noData:false,
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


  loadRelatedCourseData=(userId, locateCode)=> {
    let page = 0;
    let size = 12;
    console.log('百科11111111111111111111111111' + userId + '2222222222222222222222222222222222222' + locateCode);
    const url = `/api/v1/baike/get-baikes?userId=${userId}&resType=${locateCode}&page=${page}&size=${size} `;
    NetUtil.get(url).then((json) => {
      console.log(json.message+'0000000000000000000000000000');
      console.log(json.total+'0000000000000000000000000000');
      console.log(json.data);
      if (json.code === 1000) {
        if(json.data!==null){
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(json.data),
          });
          console.log( json.data[0].coverUrl+'000000社会总成0000000000000000000000');
          this.setState({noData: false});
        }else {
          this.setState({noData: true});
        }
      } else {
        this.setState({noData: true});
        this.refs.toast.show(json.message);
      }
    })
  };

  render() {
    if (this.state.noData===false) {
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
        this.pushBaiKe(rowData.id)
      }}>
        <View style={styles.innerViewStyle}>
          <Image source={{uri: rowData.coverUrl}} style={styles.iconStyle}/>
          <Text style={styles.courseName}>{rowData.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  pushBaiKe = (id) => {
    this.props.pushBaiKe(id);
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
    width: cellWH,
    height: cellWH,
    marginLeft: vMargin,
    marginTop: hMargin,
    alignItems: 'center',
    borderWidth:1,
    borderColor:'#e5e5e5',
    borderTopWidth:0
  },
  iconStyle: {
    resizeMode:'stretch',
    width: 150,
    height: 120
  },
  listViewStyle: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  courseName: {
    height: 60
  }
});

