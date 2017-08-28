'use strict';

import React  from 'react';
import {View,
    Text, 
    TextInput,
    StyleSheet, ScrollView, TouchableOpacity, Image, AsyncStorage,
    Dimensions, Platform, StatusBarIOS} from 'react-native';

import {msg} from 'iflux-native';

import {
  QMButton,
  QMDialog,
} from 'qmkit';
import SearchBar from './components/search-bar';
import SearchList from './components/search-history-list';
import QMSuggestList from '../suggest';

const {width: WIDTH, height: HEIGHT} = Dimensions.get('window');


//最大显示的搜索关键字历史数目
var MAX_SHOW_KEY_WORD = 10;
//最大保存的搜索关键字历史数目
var MAX_STORE_KEY_WORD = 30;

class QMSearchPage extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      //查询字段
      //查询数据源
      searchText: '',
      dataSource: [],
    };
    this.onChildChanged = this.onChildChanged.bind(this);
    this._onBack = this._onBack.bind(this);
    this._fetchCache = this._fetchCache.bind(this);
    this._handleOnAddSearch = this._handleOnAddSearch.bind(this);
    this._handleClearSearchCache = this._handleClearSearchCache.bind(this);
    this._handleGoGoodsList = this._handleGoGoodsList.bind(this);
  }

  componentDidMount() {
    this._fetchCache;
    this.setState({searchText: this.props.searchText});
  }


  render(){
    if (__DEV__) {
      console.log("searchPage render", this.state)
    }

    if (Platform.OS === 'ios' && this.props.statusBarStyle != undefined) {
      StatusBarIOS.setStyle(this.props.statusBarStyle);
    }

    return (
      <View style={styles.container}>
        {/*查询bar*/}
        <SearchBar callbackParent={(newState) => this.onChildChanged(newState)}
                   onAddSearch={this._handleOnAddSearch}
                   goSearchList={this._handleGoGoodsList}
                   onBack={this._onBack}
                   searchText={this.props.searchText}
                   ref={(searchBar) => this._searchBar = searchBar}
        />
        {
          this.state.searchText
            ?
            <QMSuggestList
              queryString={this.state.searchText}
              goSearchList={this._handleGoGoodsList}
            />
            :
            <SearchList
              searchText={this.state.searchText}
              onClearData={() => {
                console.log('--->onClearDataCallback----');
                this._searchBar.blur();
              }}
              isLoaded={this.state.isLoaded}
              dataSource={this.state.dataSource}
              goSearchList={this._handleGoGoodsList}
              onClearSearch={this._handleClearSearchCache}
            />
        }
      </View>
    )
  }


  onChildChanged(newState) {
    this.setState({
      searchText: newState
    });
  }

  _onBack(){
    const topic = this.props.topic || 'searchPage:setVisible';
    msg.emit(topic, false);
    if (Platform.OS === 'ios' && this.props.statusBarStyle != undefined) {
      StatusBarIOS.setStyle('light-content');
    }
  }


  /**
   * 查询历史记录
   */
  async _fetchCache() {
    try {
      var history = await AsyncStorage.getItem('@kstore_app:history');
      if(__DEV__){
        console.log("search-page get search history ", JSON.stringify(history));
      }
      this.setState({
        isLoaded: true,
        dataSource: history != null ? history.split('*#*').slice(0, MAX_SHOW_KEY_WORD) : []
      });
    } catch (err) {
      if (__DEV__) {
        console.log("search-page get search history error", JSON.stringify(err));
      }
    }
  }


  /**
   * 添加历史记录,如果存在相同的记录,则删除已有的记录再添加新的
   */
  async _handleOnAddSearch(searchText){
    if(!searchText || searchText === ''){
      return;
    }

    if(__DEV__){
      console.log("search-page _handleOnAddSearch searchText ", searchText);
    }

    var searchHistory = await AsyncStorage.getItem('@kstore_app:history');

    if(__DEV__){
      console.log("search-page _handleOnAddSearch histore ", JSON.stringify(searchHistory));
    }

    var storeArray = deleteArrayByValue(searchHistory ? searchHistory.split('*#*') : [], searchText);

    storeArray.unshift(searchText);
    var dataSource = storeArray.slice(0, MAX_SHOW_KEY_WORD);

    storeArray = storeArray.slice(0, MAX_STORE_KEY_WORD);

    this.setState({
      dataSource: dataSource
    }, await AsyncStorage.setItem('@kstore_app:history', storeArray.join('*#*')));
  }


  /**
   * 清空历史记录
   */
  async _handleClearSearchCache() {
    try {
      var history = await AsyncStorage.removeItem('@kstore_app:history');
      if (history == null) {
        this.setState({
          dataSource: []
        });
      }
    } catch (err) {
    }
  }


  /**
   * 商品查询
   */
  _handleGoGoodsList(searchText){
    this._onBack();
    var nextSceneName = this.props.resultSceneName || 'GoodsList';
    if (__DEV__) {
      console.log('Searchpage _handleGoGoodsList state====>', JSON.stringify(this.state, null, 2));
    }

    this._handleOnAddSearch(searchText);

    msg.emit('route:popAndReplaceByName', {
      sceneName: nextSceneName,
      searchParam: {searchText: searchText || this.state.searchText}
    }, nextSceneName);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
    //paddingTop: 20,
    justifyContent: 'flex-start',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    height: HEIGHT,
    width: WIDTH,
    paddingBottom: 50,
  }
});

export default QMSearchPage;


/**
 * 删除数组中得某个元素,并返回新的数组
 * @param array
 * @param value
 */
function deleteArrayByValue(array, value){
  var pos = -1;
  for(var index = 0;index<array.length; index++){
    if(array[index] === value){
      pos = index;
      break;
    }
  }

  if(pos === -1){
    return array;
  }

  return array.slice(0, pos).concat(array.slice(pos+1, array.length));
}

