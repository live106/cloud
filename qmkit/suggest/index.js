/**
 * Created by liuzhaoming on 15/12/28.
 */

import React from 'react';

import {View, Text, InteractionManager, StyleSheet, ScrollView, TouchableOpacity, PixelRatio} from 'react-native';

import QMLoading from  '../loading';
import {getSuggestion} from './webapi';


/**
 * 搜索关键词提示
 */
class SuggestList extends React.Component{
  static defaultProps = {
      queryString: '',
      goSearchList: ()=> {
      }
  }


  state = {
      suggestions: [],
      isLoading: true,
  }

  componentWillMount(){
    if (__DEV__) {
      console.log("suggest componentWillMount", this.props);
    }

    this.setState({isLoading: true});

    InteractionManager.runAfterInteractions(() => {
      this._updateSuggestions();
    });
  }

  componentWillReceiveProps(nextProps){
    if (__DEV__) {
      console.log("suggest componentWillReceiveProps", nextProps);
    }
    if (nextProps.queryString !== this.props.queryString && !this.state.isLoading) {
      this.setState({isLoading: true});
      InteractionManager.runAfterInteractions(() => {
        this._updateSuggestions();
      });
    }
  }


  render() {
    if (__DEV__) {
      console.log("suggest render is called", this.state);
    }

    if (this.state.isLoading) {
      return <QMLoading />
    }

    return (
      <ScrollView
        bounces={false}
        contentContainerStyle={styles.container}
        automaticallyAdjustContentInsets={false}
        keyboardDismissMode={'on-drag'}
        keyboardShouldPersistTaps='always'>
        {
          this.state.suggestions.map((suggestion)=> {
            return (
              <View>
                <TouchableOpacity
                  style={styles.suggestion}
                  activeOpacity={0.8}
                  onPress={()=>this.props.goSearchList(suggestion.text)}>
                  <Text style={styles.keywordText}>{suggestion.text}</Text>
                  <Text style={styles.countText}>{'约' + suggestion.count + '条'}</Text>
                </TouchableOpacity>
                <View style={styles.separatorLine}></View>
              </View>
            )
          })
        }
      </ScrollView>
    );
  }


  /**
   * 更新提示词
   * @private
   */
  _updateSuggestions(){
    getSuggestion({queryString: this.props.queryString}).then((res)=> {
      if (__DEV__) {
        console.log('suggest _updateSuggestions recevie http response', res);
      }

      this.setState({
        isLoading: false,
        suggestions: res
      });
    });
  }
}


var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  keywordText: {
    color: '#666'
  },
  countText: {
    color: '#666',
    fontSize: 12
  },
  suggestion: {
    backgroundColor: '#fff',
    height: 50,
    paddingLeft: 20,
    paddingRight: 20,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: '#eee',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  separatorLine: {
    height: 1 / PixelRatio.get(),
    backgroundColor: '#EEE',
  },
});


export default SuggestList;