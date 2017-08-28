import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  TouchableOpacity,
  AsyncStorage
} from 'react-native';

var Dimensions = require('Dimensions');
var {width} = Dimensions.get('window');
export default class CourceIntroduce extends Component{


  constructor(props){
    super(props);
    this.state = {
      location:'',
      introduceData:new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2}),
    }
  };
  componentWillReceiveProps(nextProps){
    console.log(nextProps.introduceData);
    var ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
    this.setState({
      introduceData:ds.cloneWithRows(nextProps.introduceData),
    });
  }
  render() {
    return (
      <View>
        <ListView
          dataSource={this.state.introduceData}  // 数据源
          renderRow={this.renderRow}
        />
      </View>
    );
  };
  //  返回具体的cell
  renderRow=(rowData,sectionID,rowID,highlightRow)=>{
    return(
      <TouchableOpacity activeOpacity={0.5}>
        <View style={styles.cellVieStyle}>
          <Text style={styles.courseName}>课程名称:{rowData.courseLessonName}</Text>
          <Text style={styles.courseNormalLabel}>{this.state.location}</Text>
          <Text style={styles.courseNormalLabel}>{convertHtmlToText(rowData.lessonIntroduce)}</Text>
          <Image source={{uri:rowData.imgUrls[0].replace('http','https')}} style={styles.imageStyle}/>
        </View>
      </TouchableOpacity>
    );
  };

  componentWillMount() {

    AsyncStorage.getItem('locate', (error, result) => {
      if (error) {
        console.log(error);
      } else {
        console.log(result);
        this.setState({
          location:result
        });
        console.log(this.state)
      }
    });
  };
};

convertHtmlToText: function convertHtmlToText(inputText) {
  var returnText = "" + inputText;
  returnText = returnText.replace(/<\/div>/ig, '\r\n');
  returnText = returnText.replace(/<\/li>/ig, '\r\n');
  returnText = returnText.replace(/<li>/ig, ' * ');
  returnText = returnText.replace(/<\/ul>/ig, '\r\n');
  //-- remove BR tags and replace them with line break
  returnText = returnText.replace(/<br\s*[\/]?>/gi, "\r\n");

  //-- remove P and A tags but preserve what's inside of them
  returnText=returnText.replace(/<p.*?>/gi, "\r\n");
  returnText=returnText.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, " $2 ($1)");

  //-- remove all inside SCRIPT and STYLE tags
  returnText=returnText.replace(/<script.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/script>/gi, "");
  returnText=returnText.replace(/<style.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/style>/gi, "");
  //-- remove all else
  returnText=returnText.replace(/<(?:.|\s)*?>/g, "");

  //-- get rid of more than 2 multiple line breaks:
  returnText=returnText.replace(/(?:(?:\r\n|\r|\n)\s*){2,}/gim, "\r\n\r\n");

  //-- get rid of more than 2 spaces:
  returnText = returnText.replace(/ +(?= )/g,'');

  //-- get rid of html-encoded characters:
  returnText=returnText.replace(/ /gi," ");
  returnText=returnText.replace(/&/gi,"&");
  returnText=returnText.replace(/"/gi,'"');
  returnText=returnText.replace(/</gi,'<');
  returnText=returnText.replace(/>/gi,'>');

  return returnText;
}

const styles = StyleSheet.create({
  cellVieStyle:{
    padding:10,
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
    width:width * 0.7,
    marginBottom:8
  },
  bottomTitleStyle :{
    color:'blue',
  },
  courseName:{
    marginTop:8,
    marginLeft:24,
    fontSize:12
  },
  courseNormalLabel:{
    marginLeft:24,
    marginTop:10,
    fontSize:12
  },
  imageStyle:{
    marginLeft:24,
    height:150,
    marginLeft:24,
    marginRight:24
  },
  courseImg:{
    marginTop:10,
    marginLeft:25,
    marginBottom:10,
    marginRight:25
  }
});
module.exports = CourceIntroduce;