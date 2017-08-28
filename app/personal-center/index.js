/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {View, StyleSheet} from 'react-native';
import {
  QMHeader,
  GoodsPullRefreshList,
  QMConfig
} from 'qmkit';


export default class PersonalCenter extends React.Component {
// 'http://api.xuezheyoushi.com/api/v1/course/get-courses?userId=59a15ee7e1b4880001a99be5&code=&page=0&size=12'
  render() {
    const url = `${QMConfig.HOST}/api/v1/course/get-courses?userId=${window.id}&code=${window.locateCode}`;

    return (
      <View style={styles.container}>
        {/*上新,促销商品查询展示*/}
        <QMHeader title={this.props.title}/>
        <GoodsPullRefreshList
          url={url}
          bigView={true}
          size={12}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee'
  }
});

