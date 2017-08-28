'use strict';

import React from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    AsyncStorage,
    PixelRatio ,
    Dimensions
} from 'react-native';


import Dialog from '../../dialog'

var screen = Dimensions.get('window');
var SCREEN_WIDTH = screen.width;
const noop = () => {
};

class SearchList extends React.Component {
    
    static defaultProps =  {
        onClearData: noop
    };

    constructor(props) {
        super(props);
        this.state = {
            visible: false
        }
    }

    render() {
        if (__DEV__) {
            console.log('SearchList is called', JSON.stringify(this.props, null, 2));
        }

        if (this.props.dataSource.length > 0) {
            /*历史搜索记录*/
            return (
                <View style={styles.container}>

                    <ScrollView
                        bounces={false}
                        style={styles.listWrapper}
                        automaticallyAdjustContentInsets={false}
                        keyboardDismissMode={'on-drag'}
                        keyboardShouldPersistTaps='always'>
                        <View style={styles.searchTitle}><Text style={{fontSize: 16}}>历史搜索</Text></View>
                        {
                            this.props.dataSource.map((v, i) => {
                                return (
                                    <TouchableOpacity
                                        key={i}
                                        style={styles.searchTitle}
                                        activeOpacity={0.8}
                                        onPress={this._handleSearch.bind(this, v)}>
                                        <Text style={styles.Lhot} allowFontScaling={false}>{v}</Text>
                                    </TouchableOpacity>
                                )
                            })
                        }
                        <View style={styles.Hcenter}>
                            <TouchableOpacity activeOpacity={0.8} style={styles.ClearSearch}
                                              onPress={()=> this._showDia()}>
                                <Text style={[styles.Lhot, {fontSize: 16}]} allowFontScaling={false}>清空历史搜索</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>

                    <Dialog
                        visible={this.state.visible}
                        maskStyle={{top: -76}}
                        title=''
                        msgContent='确定清空历史搜索吗？'
                        cancelHandle={this._handleCancel}
                        okHandle={this._cleanHistory}/>
                </View>
            )
        } else {
            /*暂无搜索记录*/
            return (
                <View style={styles.container}>
                    <View style={styles.searchTitle}><Text style={{fontSize: 16}}
                                                           allowFontScaling={false}>历史搜索</Text></View>
                    <View style={styles.center}>
                        <View style={styles.noRecord}>
                            <Image source={require('./img/no_search.png')} style={{width:100,height:100}}/>
                            <View style={styles.anonymous}><Text style={styles.noText}
                                                                 allowFontScaling={false}>暂无搜索记录</Text></View>
                        </View>
                    </View>
                </View>
            )
        }
    }


    /**
     * 是否清除
     */
    _showDia() {
        this.props.onClearData();

        this.setState({
            visible: true
        });
    }


    /**
     * 取消
     */
    _handleCancel() {
        this.setState({
            visible: false
        });
    }


    /**
     * 清除历史记录
     */
    _cleanHistory() {
        this.setState({
            visible: false
        });
        this.props.onClearSearch();
    }


    /**
     * 商品查询
     */
    _handleSearch(v) {
        this.props.goSearchList(v);
    }

}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee'
    },
    Lhot: {
        color: '#666'
    },
    searchTitle: {
        backgroundColor: '#fff',
        height: 50,
        paddingLeft: 20,
        paddingRight: 20,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: '#eee',
        justifyContent: 'center'
    },
    Hcenter: {
        flex: 1,
        alignItems: 'stretch',
        paddingTop: 50,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20
    },
    ClearSearch: {
        flex: 1,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1 / PixelRatio.get(),
        borderColor: '#ccc',
        backgroundColor: '#fff',
        borderRadius: 5
    },
    dialog: {
        width: 300
    },
    tip: {
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: '#eee',
        paddingBottom: 30,
        alignItems: 'center'
    },
    numberBar: {
        marginTop: 10,
        fontSize: 16
    },
    operation: {
        paddingTop: 20,
        borderTopWidth: 1 / PixelRatio.get(),
        borderTopColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    btn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        borderWidth: 1 / PixelRatio.get(),
        borderRadius: 5
    },
    cancelBtn: {
        marginRight: 10,
        borderColor: '#ddd',
        backgroundColor: '#fff'
    },
    OkBtn: {
        marginLeft: 10,
        borderColor: '#e63a59',
        backgroundColor: '#e63a59'
    },
    cancelText: {
        color: '#666',
        fontSize: 16
    },
    OkText: {
        color: '#fff',
        fontSize: 16
    },
    center: {
        flexDirection: 'row',
        paddingTop: 70
    },
    anonymous: {
        marginTop: 20
    },
    noText: {
        color: "#666",
        fontSize: 16
    },
    noRecord: {
        flex: 1,
        alignItems: 'center'
    },
    keyWord: {
        color: '#ff3651'
    },
    noFindgood: {
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: '#fff',
        flexDirection: 'row',
        borderBottomColor: '#eee',
        borderBottomWidth: 1 / PixelRatio.get(),
        justifyContent: 'center',
        borderTopColor: '#eee',
        borderTopWidth: 1 / PixelRatio.get()
    },
    recomGoods: {
        marginTop: 8,
        backgroundColor: '#fff',
        borderTopWidth: 1 / PixelRatio.get(),
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: '#eee',
        borderTopColor: '#eee',
        paddingBottom: 20
    },
    recomTit: {
        paddingTop: 15,
        paddingBottom: 15,
        alignItems: 'center',
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: '#eee'
    },
    recoList: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#fff'
    },
    recoNav: {
        flexDirection: 'row',
        paddingBottom: 15
    },
    recoGood: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    goodsItem: {
        width: SCREEN_WIDTH / 4 - 15
    },
    proImg: {
        width: SCREEN_WIDTH / 4 - 15,
        height: SCREEN_WIDTH / 4 - 15,
        marginBottom: 10
    },
    proTitle: {
        fontSize: 15,
        height: 32,
        overflow: 'hidden',
        marginBottom: 5,
        lineHeight: 16
    },
    proPrice: {
        fontSize: 15,
        color: '#e63a59'
    },
    listWrapper: {
        flex: 1
    }
});

export default SearchList;
