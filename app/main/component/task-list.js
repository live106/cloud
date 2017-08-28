import React,{Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  ListView,
  Image,
  Platform,
  View,
  TouchableOpacity,
  AlertIOS
} from 'react-native';

const Dimensions = require('Dimensions');
const {width} = Dimensions.get('window');

const TaskData = [
  {
    taskTypeString: '试卷任务',
    taskName:'《沁园春雪》试卷任务',
    taskSource:'七年级上册第一单元第6课《沁园春雪》',
    startTime:'2017年6月27日 19:05:20',
    endTime:'2017年6月27日 19:05:20'
  },
  {
    taskTypeString: '背诵任务',
    taskName:'《沁园春雪》背诵任务',
    taskSource:'七年级上册第一单元第6课《沁园春雪》',
    startTime:'2017年6月27日 19:05:20',
    endTime:'2017年6月27日 19:05:20'
  },
  {
    taskTypeString: '朗读任务',
    taskName:'《沁园春雪》朗读任务',
    taskSource:'七年级上册第一单元第6课《沁园春雪》',
    startTime:'2017年6月27日 19:05:20',
    endTime:'2017年6月27日 19:05:20'
  },
  {
      taskTypeString: '阅读任务',
      taskName:'《沁园春雪》阅读任务',
      taskSource:'七年级上册第一单元第6课《沁园春雪》',
      startTime:'2017年6月27日 19:05:20',
      endTime:'2017年6月27日 19:05:20'
  },
];

export default class HomeTaskList extends Component{
  constructor(props){
    super(props);
    var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
    this.state = {
      dataSource:ds.cloneWithRows(TaskData)
    }
  };

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}  // 数据源
        renderRow={this.renderRow}
      />
    );
  };
  //  返回具体的cell
  renderRow(rowData,sectionID,rowID,highlightRow) {
    return(
      <TouchableOpacity activeOpacity={0.5}>
        <View style={styles.cellVieStyle}>
          <View style={styles.cellTitle}>
            <Text style={styles.titleSource}>{rowData.taskTypeString}</Text>
            <Image source={require('../img/stateCarrying.png')} resizeMode='contain' style={styles.taskState}/>
          </View>
          <Text style={styles.titleNormal}>任务来源:{rowData.taskSource}</Text>
          <Text style={styles.titleNormal}>任务标题:{rowData.taskName}</Text>
          <Text style={styles.titleNormal}>开始时间:{rowData.startTime}</Text>
          <Text style={styles.titleEndTime}>结束时间:{rowData.endTime}</Text>
        </View>
      </TouchableOpacity>
    );
  }
};
const styles = StyleSheet.create({
  container:{
    backgroundColor:'white',
  },
  indicatorViewSTyle:{
    flexDirection:'row',
    justifyContent:'center'
  },
  cellVieStyle:{
    backgroundColor:'white',
    //  下划线
    borderBottomWidth:1,
    borderBottomColor:'#e8e8e8',
  },
  leftImageStyle:{
    width:60,
    height:60,
    marginRight:15
  },
  rightViewStyle: {
    justifyContent:'center'
  },
  topTitleStyle :{
    color:'red',
    fontSize:15,
    width:width * 0.7,
    marginBottom:8
  },
  bottomTitleStyle :{
    color:'blue',
  },
  cellTitle:{
    flexDirection:'row',
  },
  titleSource:{
    marginLeft:40,
    marginTop:20,
    flex:4
  },
  titleNormal:{
    marginTop:10,
    marginLeft:40,
  },
  titleEndTime:{
    marginLeft:40,
    marginBottom:20,
    marginTop:10,
  },
  taskState:{
    width:110,
    height:50,
    flex:1
  }
});
module.exports = HomeTaskList;
