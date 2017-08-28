/**
 * loading组件
 */
import React from 'react';

import {View, Platform, StyleSheet, ActivityIndicator, ActivityIndicatorIOS} from 'react-native';
import config from './config';


/**
 * Usage
 * var {Loading} = require('qmkit');
 *
 * <Loading/>
 */
class QMLoading extends React.Component {


    static defaultProps = {
        overlay: false,
        size: 'small'
    };

    constructor(props){
        super(props);
        this.state = {
            display: true
        }
    }

    componentDidMount() {
        this.timer = setTimeout(() => {
            this.setState({
                display: false
            });
        }, config.HTTP_TIME_OUT * 1000)
    }


    componentWillUnmount() {
        //清除
        this.timer && clearTimeout(this.timer);
    }


    render() {
        //不显示的时候直接返回
        if (!this.state.display) {
            return null;
        }

        let cnf = {};
        if (this.props.overlay) {
            cnf['color'] = '#FFF';
        }

        return (
            <View style={[styles.loading, this.props.overlay && styles.overlay, this.props.style]}>
                <ActivityIndicator color="#CCCCCC" size="large" style={styles.progress}/>
            </View>
        );
    }
}


/**
 * style
 */
const styles = StyleSheet.create({
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)'
    },
    progress: {
        width: 30,
        height: 30
    }
});

export default QMLoading;