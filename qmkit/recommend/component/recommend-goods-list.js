/**
 * Created by liuzhaoming on 15/12/29.
 */
import React from 'react';

import {View, Text, StyleSheet, TouchableOpacity, Image, ListView, Dimensions, InteractionManager, PixelRatio} from 'react-native';
var {msg} = require('iflux-native');

const {width: WIDTH, height: HEIGHT} = Dimensions.get('window');

import QMConfig from '../../config';


const ds = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2
});


const GoodsList = React.createClass({
  getDefaultProps(){
    return {
      row: 1,
      column: 3,
      goodsList: []
    };
  },

  getInitialState() {
    return {
      dataSource: [],
    }
  },


  componentDidMount() {
    this.setState({
      dataSource: this.props.goodsList
    });
  },


  componentWillReceiveProps(nextProps){
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        dataSource: nextProps.goodsList
      });
    });
  },


  render() {
    var rowArray = [];
    for (var i = 0; i < this.props.row; i++) {
      rowArray.push(i);
    }
    return (
      <View style={styles.container}>
        { rowArray.map((rowNo, k)=> {
          if (this.state.dataSource && this.state.dataSource.length > 0) {
            var rowData = this.state.dataSource.slice(rowNo * this.props.column, (rowNo + 1) * this.props.column);
            return (
              <View style={styles.goodsList} key={k}>
                {
                  rowData.map((sku, k)=> {
                    return this._renderSku(sku, k);
                  })}
              </View>)
          }
        })
        }
      </View>
    )
  },

  _renderSku(sku, k) {
    return (
      <TouchableOpacity
        key={k}
        style={styles.goodsItem} activeOpacity={0.8}
        onPress={() => msg.emit('route:pushOrReplace', {sceneName: 'GoodsDetail', goodsInfoId: sku.id})}
      >
        <Image style={styles.goodsImage}
               source={sku.image ? {uri:this._format_image_url(sku.image)} : require('../../img/plus.png')}/>
        <Text style={styles.goodsName} allowFontScaling={false} numberOfLines={1}>{sku.name}</Text>
        <Text style={styles.goodsPrice} allowFontScaling={false}>{`￥${sku.preferPrice}`}</Text>
      </TouchableOpacity>
    )
  },

  _format_image_url(image_url){
    let format_url =  image_url.indexOf('!') > -1 ? image_url : image_url + '!' + QMConfig.IMAGE_LIST_SIZE;
    return format_url
  }
});

var styles = StyleSheet.create({
  container: {
    //backgroundColor: '#fff'
  },
  goodsList: {
    paddingTop: 10,
    flexDirection: 'row',
    //flexWrap: 'wrap',
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'space-between'
  },
  goodsItem: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    width: ((WIDTH - 20) / 3) - 20,
  },
  goodsImage: {
    width: ((WIDTH - 20) / 3) - 20,
    height: ((WIDTH - 20) / 3) - 20,
    borderWidth: 1 / PixelRatio.get(),
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
  },
  goodsName: {
    lineHeight: 15,
    height: 20,
    overflow: 'hidden',
    color: '#999',
    fontSize: 12,
  },
  goodsPrice: {
    fontSize: 13,
    marginTop: 5,
  }
});

export default GoodsList;
