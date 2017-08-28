import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Image,
  Alert,
  AsyncStorage
} from 'react-native';
import {QMHeader} from 'qmkit';
import NetUtil from '../../util/NetUtil';
import Toast, {DURATION} from 'react-native-easy-toast';

var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');

export default class CourseAskVC extends Component {

  constructor(props) {
    super(props);
    this.state = {
      askTitle: "",
      askDescribe: "",
      locate: ""
    };
  }

  componentWillMount() {
    AsyncStorage.getItem('id', (error, object) => {
      if (error) {
        console.log('object' + object);
        this.setState({
          locate: object
        })
      }
    });
    AsyncStorage.getItem('locate', (error, result) => {
      if (error) {
        console.log(error);
      } else {
        console.log(result);
        this.setState({
          locate:result
        });
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <QMHeader title="提问"/>
        <View style={styles.textSource}>
          <View style={styles.textSourceTitle}>
            <Text style={{marginLeft: 10,color:'#9e9e9e'}}>{this.state.locate}</Text>
          </View>
          <View style={styles.changeCourse}>
            <Text style={{color: 'white'}}>更换</Text>
          </View>
        </View>

        <TextInput style={styles.txtQuestion} placeholder='请输入问题标题' onChangeText={(text) => {
          this.askTitle = text;
        }}/>
        <TextInput style={styles.txtQuestionDescribe} placeholder='请输入问题描述' multiline={true} onChangeText={(text) => {
          this.askDescribe = text;
        }}/>
        <Toast ref="toast" fadeInDuration={1000}/>
      </View>
    );
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

  sendAskAction = (key)=> {
    var body = JSON.stringify({
      "description": this.askDescribe,
      "extensionId": this.props.extensionId,
      "resCategory": 1,
      "resourceId": this.props.resourceId,
      "title": this.askTitle,
      "userId": key
    });

    console.log(body);
    NetUtil.post('/api/v1/qa/add-question', body)
      .then((responseData) => {
        console.log(responseData.code);
        if (responseData.code == 1000) {
          this.refs.toast.show('提问成功!');
          this.props.navigator.pop();
        } else {
          this.refs.toast.show(responseData.message);
        }
      })
      .catch((error) => {
        console.log(error);
        Alert.alert('Error');
      })
  };
};
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },

    navTitle: {
      color: '#333333',
      marginTop: Platform.OS == 'ios' ? 18 : 0,
    },
    topInputStyle: {
      width: width * 0.71,
      color: '#333333',
      marginTop: Platform.OS == 'ios' ? 18 : 0,
      textAlign: 'center',
      fontSize: 18
    },
    rightNavViewStyle: {
      flexDirection: 'row',
      height: 64,
      alignItems: 'center'
    },
    navScan: {
      width: 25,
      height: 25,
      marginTop: Platform.OS == 'ios' ? 20 : 0,
      justifyContent: 'center'
    },
    navSave: {
      width: 25,
      height: 25,
      marginTop: Platform.OS == 'ios' ? 20 : 0,
      justifyContent: 'center'
    },
    textSource: {
      marginTop: 26,
      marginLeft: 10,
      height: 40,
      justifyContent: 'center',
      flexDirection: 'row',
      marginRight: 10,
    },
    textSourceTitle: {
      borderRadius: 1,
      borderWidth: 1,
      borderColor: '#9e9e9e',
      flex: 5,
      marginRight: 10,
      justifyContent: 'center',
    },
    txtQuestion: {
      height: 40,
      marginRight: 10,
      marginLeft: 10,
      borderRadius: 1,
      borderWidth: 1,
      borderColor: '#9e9e9e',
      marginTop: 10
    },
    txtQuestionDescribe: {
      marginTop: 10,
      marginRight: 10,
      marginLeft: 10,
      marginBottom: 10,
      borderRadius: 1,
      borderWidth: 1,
      borderColor: '#9e9e9e',
      height: 70,
      textAlign: 'left',
      textAlignVertical: 'top',
      flex: 1,
      lineHeight: 20
    },
    changeCourse: {
      width: 48,
      height: 40,
      backgroundColor: '#2FA7FF',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 3,
      flex: 1
    }
  }
);
module.exports = CourseAskVC;

