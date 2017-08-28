/**
 * Form
 */
import React from 'react';

import {View} from 'react-native';

import BasicField from './basic-field';
import DateInput from './date-input';
import TextField from './text-field';
import TextInput from './text-input';

//just do nothing.
const noop = () => {};


/**
 * Usage:
 */
class Form extends React.Component{


  render() {
    return (
      <View style={this.props.style}>
        {this.props.children}
      </View>
    )
  }
}

//基础field
Form.BasicField = BasicField;
//输入框
Form.QMTextInput = TextInput;
//日期控件
Form.QMDateInput = DateInput;
//只读组件
Form.QMTextField = TextField;


export default Form;