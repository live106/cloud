import React from 'react';
import {View, Text, PixelRatio, ListView, AsyncStorage, InteractionManager, TouchableOpacity, StyleSheet} from 'react-native';
import {fromJS} from 'immutable';
import {msg} from 'iflux-native';
import QMLoading from '../loading';
import QMHeader from '../header';
import {fetchAll} from './webapi';
import QMButton from '../button';

const noop = () => {
};

const FIELDS = [
  ['provinceId', 'provinceName'],
  ['cityId', 'cityName'],
  ['districtId', 'districtName']
];

/**
 * 公共的省市区的级联组件
 */
class Region extends React.Component{

  static defaultProps ={
    onSubmit: noop
  }
  
  constructor(props){
    super(props);
    this._cache = fromJS([]);
    /*当前已经选择的数据*/
    this._selected = [];

    /*初始化数据源*/
    this._ds = new ListView.DataSource({
      rowHasChanged(r1, r2){
        return r1 != r2;
      }
    });
    this.state = {
      isLoading: true,
      /*当前需要渲染的数据的路径*/
      dataPath: [],
      /*是否正在loading,默认true*/
    };
    this._refreshList = this._refreshList.bind(this);
    this._renderContent = this._renderContent.bind(this);
    this._renderRow = this._renderRow.bind(this);
    this._handlePress = this._handlePress.bind(this);
    this._handleBack = this._handleBack.bind(this);
    this._getDataSource = this._getDataSource.bind(this);
  }

  componentWillMount(){
    //是不是onPress正在处理
    this._resolve = false;
  }
  
  componentDidUpdate(){
    this._listRegion && this._listRegion.scrollTo({x: 0, y: 0, animated: false});
  }
  
  componentDidMount(){
    InteractionManager.runAfterInteractions(async () => {
      try {
        const regionStr = await AsyncStorage.getItem('KStoreApp@Region');
        if (regionStr) {
          this._cache = fromJS(JSON.parse(regionStr));

          this.setState({
            isLoading: false,
            dataPath: []
          });

          return;
        }
      } catch (e) {
      }


      //获取数据
      fetchAll().then((res) => {
        this._cache = fromJS(res);

        this.setState({
          isLoading: false,
          dataPath: []
        });

        AsyncStorage.setItem('KStoreApp@Region', JSON.stringify(res));
      });
    });
  }

  componentWillUnmount(){
    this.requestAnimation&&cancelAnimationFrame(this.requestAnimation);
  }


  render() {
    return (
      <View style={styles.container}>
        <QMHeader
          title="选择地址"
          onLeftMenuPress={this._handleBack}
          renderRight={() => {
                    return (
                      <QMButton
                        style={{backgroundColor: 'transparent'}}
                        activeOpacity={0.8}
                        disabled={false}
                        textStyle={styles.text}
                        onPress={() => this._refreshList()}>
                        刷新
                      </QMButton>
                    )
                  }}
        />

        {this._renderContent()}
      </View>
    );
  }

  /**
   * 手动触发刷新列表
   * @private
   */
  _refreshList(){
    this.setState({
      isLoading: true,
      dataPath: []
    });
    this._selected = [];
    this.setState({
      dataPath: []
    });

    fetchAll().then((res) => {
      this._cache = fromJS(res);

      this.setState({
        isLoading: false,
        dataPath: []
      });

      AsyncStorage.setItem('KStoreApp@Region', JSON.stringify(res));
    });
  }

  _renderContent(){

    if (this.state.isLoading) {
      return <QMLoading/>
    }

    return (
      <ListView
        ref={(list) => {this._listRegion = list;}}
        bounces={false}
        initialListSize={20}
        removeClippedSubviews={true}
        showsVerticalScrollIndicator={true}
        automaticallyAdjustContentInsets={true}
        dataSource={this._getDataSource()}
        renderRow={this._renderRow}
      />
    );
  }

  /**
   * 渲染每一行
   *
   * @param row
   * @param _
   * @param index
   * @returns {XML}
   * @private
   */
  _renderRow(row, _, index){
    const id = row.areaId;
    const name = row.areaName;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        key={id}
        style={styles.row}
        onPress={this._handlePress.bind(this, index, id, name)}>
        <Text style={styles.grey} allowFontScaling={false}>{name}</Text>
      </TouchableOpacity>
    );
  }


  /**
   * 处理点击事件
   *
   * @param index
   * @param id
   * @param name
   * @private
   */
  _handlePress(index, id, name){
    if (this._resolve) {
      return;
    }
    this.requestAnimation = requestAnimationFrame(() => {
      this._resolve = true;

      //获取子元素
      const path = [...this.state.dataPath, index, 'child'];
      const data = this._cache.getIn(path);

      if (data.count() > 0) {
        this._selected.push([id, name]);
        InteractionManager.runAfterInteractions(() => {
          this._resolve = false;

          this.setState({
            dataPath: path
          });
        });
      } else {
        this._selected.push([id, name]);
        //防止重复点击
        if (this._selected.length - 1 > this.state.dataPath.length / 2) {
          this._selected = [...this._selected.slice(0, -1)];
        }

        //组合对象
        const selected = this._selected.reduce((init, v, k) => {
          init[FIELDS[k][0]] = v[0];
          init[FIELDS[k][1]] = v[1];
          return init;
        }, {});

        if(this._selected.length < 3){
          //如果省市区未选完全,不让提交
          this._selected = [];
          this.setState({
            dataPath: []
          });
          this._resolve = false;
          msg.emit('app:tip', '省市区数据有误,请重新选择!');
        }else {
          this.props.onSubmit(selected);

          msg.emit('region:data', selected);
          msg.emit('route:backToLast');
          if(this.props.goodsInfoId != null) {
            msg.emit('route:replaceRoute',{sceneName: 'GoodsDetail',goodsInfoId:this.props.goodsInfoId});
          }
        }
      }
    });
  }

  /**
   * 处理返回事件
   *
   * @private
   */
  _handleBack(){
    if (this._selected.length === 0) {
      msg.emit('route:backToLast');
      return;
    }

    this._selected = [...this._selected.slice(0, -1)];
    this.setState({
      dataPath: this.state.dataPath.slice(0, -2)
    });
  }

  /**
   * 获取数据源
   *
   * @returns {*}
   * @private
   */
  _getDataSource(){
    return this._ds.cloneWithRows(this._cache.getIn(this.state.dataPath).toJS());
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  row: {
    height: 50,
    paddingLeft: 20,
    alignSelf: 'stretch',
    justifyContent: 'center',
    borderColor: '#ddd',
    borderBottomWidth: 1 / PixelRatio.get()
  },
  grey: {
    color: '#666',
    fontSize: 16
  },
  text: {
    color: '#666',
    fontSize: 14,
    marginLeft: 20
  }
});


export default Region;
