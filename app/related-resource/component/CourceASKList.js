import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  TouchableOpacity,
  AlertIOS,
  AsyncStorage
} from 'react-native';

import moment from 'moment';
import NetUtil from '../../util/NetUtil';

var Dimensions = require('Dimensions');
var {width} = Dimensions.get('window');


export default class CourceASK extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noData: true,
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
    }
  };

  //  返回具体的cell
  renderRow(rowData, sectionID, rowID, highlightRow) {
    return (
      <TouchableOpacity activeOpacity={0.5}>
        <View style={styles.cellVieStyle}>
          {/**左边的图片**/}
          <Image source={{uri: rowData.avatarUrl.replace('http', 'https')}} style={styles.leftImageStyle}/>
          {/***右边的View*****/}
          <View style={styles.rightViewStyle}>
            <View style={styles.cellTitle}>
              <Text style={styles.topTitleStyle}>{rowData.userName}</Text>
              <Text style={styles.topPoublishTime}>{(moment(rowData.createTime).format("YYYY/MM/DD HH:mm"))}</Text>
            </View>
            {/***上边的Text***/}
            <Text style={styles.bottomTitleStyle}>{rowData.description}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  componentWillMount() {
    this.getObject('id', this.getAskList)
  };

  getObject(key, callback) {
    AsyncStorage.getItem(key, (error, object) => {
      if (error) {
        console.log('Error:' + error.message);
        callback(key);
      } else {
        callback(object);
      }
    })
  }

  getAskList = (key)=> {
    console.log(this.props.resourceId)
    const userId = key;
    const page = 0;
    const size = 12;
    const oldPath = '/api/v1/qa/get-new-question?userId=' + userId;
    const pathUrl = '/api/v1/qa/get-new-questions/' + this.props.resourceId + '?userId=' + userId + '&resCategory=1&page=' + page + '&size=' + size;
    NetUtil.get(pathUrl)
      .then((responseData) => {
        console.log('from here');
        console.log(responseData.data);
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseData.data),
        });
      })
      .catch((error) => {
        console.log(error);
        Alert.alert('Error');
      });
  };

  render() {
    return (
      <View >
        <ListView
          dataSource={this.state.dataSource}  // 数据源
          renderRow={this.renderRow}
          removeClippedSubviews={false}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cellVieStyle: {
    padding: 10,
    backgroundColor: 'white',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    borderTopColor: '#E5E5E5',
    borderTopWidth: 1,
    marginTop: 8,
    marginBottom: 8,
  },
  leftImageStyle: {
    width: 60,
    height: 60,
    marginRight: 15,
    borderRadius: 45,
    flex: 1
  },
  rightViewStyle: {
    justifyContent: 'center',
    flex: 6
  },
  topTitleStyle: {
    color: '#333333',
    fontSize: 15,
    marginBottom: 8,
    flex: 5
  },
  topPoublishTime: {
    color: '#333333',
    fontSize: 15,
    marginBottom: 8,
    marginLeft: 10,
    flex: 5,
  },
    cellVieStyle: {
      // padding:10,
      // backgroundColor:'white',
      // //  下划线
      // borderBottomWidth:1,
      // borderBottomColor:'#e8e8e8',
      // //  确定主轴的方向
      // flexDirection:'row',
      flexDirection: 'row',
      backgroundColor: '#ffffff',
      borderWidth: 0.5,
      borderColor: '#d6d7da',
      marginBottom: 14,
      paddingBottom: 14
    },
    leftImageStyle: {
      // width:60,
      // height:60,
      // marginRight:15,
      // borderRadius:45,
      // flex:1
      borderRadius: 45,
      width: 34,
      height: 34,
      marginLeft: 30,
      marginTop: 14,
    },
    rightViewStyle: {
      // justifyContent:'center',
      // flex:6
      flex: 1,
      marginTop: 14,
      marginLeft: 16,
      marginRight: 30
    },
    topTitleStyle: {
      // color:'#333333',
      // fontSize:15,
      // marginBottom:8,
      // flex:5
      textAlign: 'left'
    },
    topPoublishTime: {
      // color:'#333333',
      // fontSize:15,
      // marginBottom:8,
      // marginLeft:10,
      // flex:5,
      fontSize: 12,
      color: '#d6d7da',
      flex: 1,
      textAlign: 'right'
    },
    bottomTitleStyle: {
      color: '#333333',
      marginTop: 15
    },
    cellTitle: {
      flexDirection: 'row'
    }
  });
module.exports = CourceASK;