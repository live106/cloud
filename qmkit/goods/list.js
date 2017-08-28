import React, {Component} from 'react';
import {
  View,
  ListView,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  PixelRatio,
  Dimensions,
  findNodeHandle,
} from 'react-native';
import {msg} from 'iflux-native';

const {width} = Dimensions.get('window');
//  一些常量设置
const cols = 2;
const cellWH = 140;
const vMargin = (width - cellWH * cols) / (cols + 1);
const hMargin = 10;


import QMPullRefreshListView from '../pull-refresh-list-view/pull-refresh-list-view';
import QMConfig from '../config';

class GoodsPullRefreshList extends React.Component{
  static propTypes = {
    bigView: React.PropTypes.bool
  };

  constructor(props){
    super(props);
    this.state = {
      queryString: "",
      validQueryString: ""
    };
    this._renderPro = this._renderPro.bind(this);
    this._onDataReceive = this._onDataReceive.bind(this);

  }

  render() {
    return (
      <View style={styles.container}>
        <QMPullRefreshListView
          icon={require('./img/list_empty.png')}
          url={this.props.url}
          postMethod={false}
          renderRow={this._renderPro}
          automaticallyAdjustContentInsets={false}
          usePostMethod={true}
          postBody={this.props.postBody}
          contentContainerStyle={this.props.bigView ? styles.listView : styles.smallList}
          supportManualRefresh={true}
          backToTop={true}
          onDataReceive={this._onDataReceive}
        />
      </View>
    )
  }

  /**
   * 商品row
   */
  _renderPro(row, _, index) {
    if (this.props.bigView) {
      if(__DEV__){
        console.log('this._renderBigView')
      }
      return (
        this._renderBigView(row, _, index)
      )
    } else {
      if(__DEV__){
        console.log('this._renderContent')
      }
      return this._renderContent(row)
    }
  }

  _renderBigView(row, _, index){
    return (
      <TouchableOpacity activeOpacity={0.5} onPress={() => {
        msg.emit('route:goToNext', {sceneName: 'RelatedCourceInfo', resourceId: row.id, userId: window.id})
      }}>
        <View style={styles.innerViewStyle}>
          <Image source={{uri: row.coverUrl.replace('http', 'https')}} style={styles.iconStyle}/>
          <Text style={styles.courseName}>{row.name}</Text>
        </View>
      </TouchableOpacity>
    );
  }


  _renderContent(row) {
    return (
      <TouchableOpacity
        style={styles.smallView}
        activeOpacity={0.8}
        onPress={() => msg.emit('route:goToNext', {sceneName: 'GoodsDetail', goodsInfoId: row.id, goodsInfo: row})}>
        <Image style={styles.goodsImage}
               source={{uri: row.image.indexOf('!') > -1 ? row.image : row.image + '!' + QMConfig.IMAGE_LIST_SIZE}}/>
        <View style={styles.listInfo}>
          <Text style={styles.goodsName} allowFontScaling={false} numberOfLines={2}>{row.name}</Text>
          <Text style={styles.goodsPrice} allowFontScaling={false}>&yen;{row.preferPrice}</Text>
          <Text
            style={styles.praiseInfo}
            allowFontScaling={false}>好评{100 * row.goodCommentPercent + '%'}&nbsp;{row.goodCommentNum}人</Text>
        </View>
      </TouchableOpacity>
    )
  }

  _onDataReceive(res){
    if (this.props.onDataReceive) {
      if(__DEV__){
        console.log('GoodsPullRefreshList.js _onDataReceive ');
      }
      this.props.onDataReceive(res)
    }
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  listView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'space-between'
  },
  smallList: {
    flexDirection: 'column'
  },
  smallView: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderWidth: 1 / PixelRatio.get(),
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#ddd',
    padding: 10
  },
  goodsImage: {
    width: width / 4 - 5,
    height: width / 4 - 5,
    marginRight: 20
  },
  listInfo: {
    flex: 1
  },
  goodsName: {
    fontSize: 15,
    height: 40,
    lineHeight: 20,
    marginBottom: 10
  },
  goodsPrice: {
    fontSize: 15,
    color: '#e63a59',
    marginBottom: 10
  },
  praiseInfo: {
    fontSize: 13,
    color: '#999'
  },
  innerViewStyle: {
    width: cellWH,
    height: cellWH,
    marginLeft: vMargin,
    marginTop: hMargin,
    //  居中
    alignItems: 'center',
    borderWidth:1,
    borderColor:'#e5e5e5',
    borderTopWidth:0
  },
  iconStyle: {
    resizeMode:'stretch',
    width: 150,
    height: 120,
  },
  courseName: {
    height: 60
  }
});


export default GoodsPullRefreshList;