'use strict';

import React  from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Image,
    InteractionManager,
    PixelRatio,
    Platform
} from 'react-native';

import {msg} from 'iflux-native';
const isAndroid = Platform.OS === 'android';

class SearchBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchText: ''
        };
        this._onTextChange = this._onTextChange.bind(this);
        this._blurSearchInput = this._blurSearchInput.bind(this);
        this._handleSearch = this._handleSearch.bind(this);
        this.blur = this.blur.bind(this);
    }

    componentDidMount() {
        if (__DEV__) {
            console.log('Search page searchbar componentDidMount ====> ', JSON.stringify(this.props, null, 2));
        }
        this.setState({searchText: this.props.searchText});
    }


    render() {
        if (__DEV__) {
            console.log('Search page searchbar render ====> ', JSON.stringify(this.state, null, 2));
        }

        return (
            <View style={styles.searchCon}>
                <TouchableOpacity style={styles.backBtn} activeOpacity={0.8} onPress={() => {this._blurSearchInput;
                this.props.onBack();}}>
                    <Image style={styles.backIcon} source={require('./img/left.png')}/>
                </TouchableOpacity>
                <View style={styles.hotSearch}>
                    <Image style={styles.searchIcon} source={require('./img/search.png')}/>
                    <TextInput
                        ref={(search)=>{this._search=search}}
                        autoCorrect={false}
                        autoCapitalize="none"
                        autoFocus={true}
                        returnKeyType='search'
                        style={styles.input}
                        underlineColorAndroid="transparent"
                        placeholder='搜索'
                        placeholderTextColor='#ddd'
                        clearButtonMode='while-editing'
                        value={this.state.searchText}
                        onSubmitEditing={this._handleSearch}
                        onChangeText={(searchText) => this._onTextChange(searchText)}/>
                </View>
                <TouchableOpacity style={styles.searchBtn} onPress={this._handleSearch} activeOpacity={0.8}>
                    <Text style={{color:'#666',fontSize: 14}} allowFontScaling={false}>搜索</Text>
                </TouchableOpacity>
            </View>
        )
    }


    /**
     * 查询改变
     */
    _onTextChange(searchText) {
        if (__DEV__) {
            console.log('Search page input _onTextChange is called ', searchText)
        }

        var newState = searchText;
        this.setState({
            searchText: newState
        });
        this.props.callbackParent(newState);
    }

    /**
     * 让搜索输入框失去焦点
     * @private
     */
    _blurSearchInput() {
        if (this._search) {
            this._search.blur();
        }
    }

    /**
     * 查询
     */
    _handleSearch() {
        //让搜索框失去焦点
        this._blurSearchInput;

        //如果没有输入关键字
        if (!this.state.searchText || this.state.searchText == '') {
            msg.emit('app:tip', '请输入搜索关键字');
            return false;
        }

        //回调
        //this.props.onAddSearch(this.state.searchText);
        this.props.goSearchList(this.state.searchText);

        //clean
        this.setState({searchText: ''});
    }


    blur() {
        this._search.blur();
    }
}

var styles = StyleSheet.create({
    searchCon: {
        paddingBottom: 10,
        paddingTop: isAndroid ? 10 : 25,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: '#eee'
    },
    hotSearch: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 5,
        paddingLeft: 10,
        height: 35,
        borderWidth: 1 / PixelRatio.get(),
        borderColor: '#ddd',
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden'
    },
    searchIcon: {
        width: 20,
        height: 20,
        marginLeft: 0,
        marginRight: 10
    },
    input: {
        flex: 1,
        fontSize: 14,
        padding: 0
    },
    backBtn: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: 15,
        paddingLeft: 20
    },
    backIcon: {
        width: 12,
        height: 22
    },
    searchBtn: {
        paddingLeft: 15,
        paddingRight: 15,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default SearchBar;
