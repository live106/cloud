/**
 * Created by TaoLee on 2017/8/15.
 */
import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Dimensions,
  ScrollView,
  Text,
  Image,
  View,
} from 'react-native'

const window = Dimensions.get('window');
const uri = 'http://image18-c.poco.cn/mypoco/myphoto/20160605/09/1735166522016060509185507.png';

export default class Menu extends Component {
  static propTypes = {
    onItemSelected: React.PropTypes.func.isRequired,
  };// 注意这里有分号

  render() {
    return (
      <ScrollView scrollsToTop={false} style={styles.menu}>
        <View style={styles.avatarContainer}>
          <Image
            style={styles.avatar}
            source={{uri: uri}}/>
          <Text style={styles.name}>相濡以沫</Text>
        </View>

        <Text
          onPress={() => this.props.onItemSelected('啦啦啦') }
          style={styles.item}>
          啦啦啦
        </Text>

        <Text
          onPress={() => this.props.onItemSelected('点点我')}
          style={styles.item}>
          点点我
        </Text>

        <Text
          onPress={() => this.props.onItemSelected('抱抱我')}
          style={styles.item}>
          抱抱我
        </Text>

        <Text
          onPress={() => this.props.onItemSelected('亲亲我')}
          style={styles.item}>
          亲亲我
        </Text>

        <Text
          onPress={() => this.props.onItemSelected('啃啃我')}
          style={styles.item}>
          啃啃我
        </Text>

        <Text
          onPress={() => this.props.onItemSelected('拽拽我')}
          style={styles.item}>
          拽拽我
        </Text>

        <Text
          onPress={() => this.props.onItemSelected('闪闪我')}
          style={styles.item}>
          闪闪我
        </Text>

        <Text
          onPress={() => this.props.onItemSelected('照照我')}
          style={styles.item}>
          照照我
        </Text>

        <Text
          onPress={() => this.props.onItemSelected('戳戳我')}
          style={styles.item}>
          戳戳我
        </Text>

        <Text
          onPress={() => this.props.onItemSelected('赞赞我')}
          style={styles.item}>
          赞赞我
        </Text>

        <Text
          onPress={() => this.props.onItemSelected('夸夸我')}
          style={styles.item}>
          夸夸我
        </Text>

        <Text
          onPress={() => this.props.onItemSelected('看看我')}
          style={styles.item}>
          看看我
        </Text>

        <Text
          onPress={() => this.props.onItemSelected('卡卡我')}
          style={styles.item}>
          卡卡我
        </Text>

        <Text
          onPress={() => this.props.onItemSelected('呼呼我')}
          style={styles.item}>
          呼呼我
        </Text>

        <Text
          onPress={() => this.props.onItemSelected('点点我')}
          style={styles.item}>
          点点我
        </Text>

        <Text
          onPress={() => this.props.onItemSelected('抱抱我')}
          style={styles.item}>
          抱抱我
        </Text>

        <Text
          onPress={() => this.props.onItemSelected('亲亲我')}
          style={styles.item}>
          亲亲我
        </Text>

        <Text
          onPress={() => this.props.onItemSelected('啃啃我')}
          style={styles.item}>
          啃啃我
        </Text>

        <Text
          onPress={() => this.props.onItemSelected('拽拽我')}
          style={styles.item}>
          拽拽我
        </Text>

        <Text
          onPress={() => this.props.onItemSelected('闪闪我')}
          style={styles.item}>
          闪闪我
        </Text>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    width: window.width,
    height: window.height,
    backgroundColor: 'gray',
    padding: 20,
  },
  avatarContainer: {
    marginBottom: 20,
    marginTop: 20,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    flex: 1,
  },
  name: {
    position: 'absolute',
    left: 70,
    top: 20,
  },
  item: {
    fontSize: 16,
    fontWeight: '300',
    paddingTop: 10,
  },
});