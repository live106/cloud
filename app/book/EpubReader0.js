import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Platform,
} from 'react-native';
import { Epub, Streamer } from "epubjs-rn";
import {QMHeader} from 'qmkit'
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');

export default class EpubReader0 extends Component {

    constructor(props){
        super(props);
        this.state = {
            src: '',
        }
    };

    render() {
        console.log(`src: ${this.state.src}`);
        return (
            <View style={styles.container}>
                <QMHeader title="目录"/>
                <Epub src={this.state.src}
                      flow={"paginated"} />

            </View>
        );
    }



    componentWillMount() {
        let streamer = new Streamer();
        streamer.start("8899")
            .then((origin) => {
                console.log("Served from:", origin)
                return streamer.get("http://wenjiang-books.oss-cn-beijing.aliyuncs.com/epub/20170803/001069dcdfbd38af/Bzguopan001.epub");
            })
            .then((src) => {
                console.log("Loading from:", src);
                return this.setState({src});
            });
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },

    topInputStyle: {
        width: width * 0.71,
        height: Platform.OS === 'ios' ? 35 : 30,
        marginTop: Platform.OS === 'ios' ? 18 : 0,
        borderRadius: 17,
        paddingLeft: 10,
        color: '#2FA7FF'
    },
    rightNavViewStyle: {
        flexDirection: 'row',
        height: 64,
        alignItems: 'center'
    },
});
