'use strict';

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';


/**
 * Tag组件
 */
class Tag extends React.Component {

    render() {
        return (
            <View style={styles.tag}>
                <Text style={styles.tagText} allowFontScaling={false}>
                    {this.props.tag}
                </Text>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    tag: {
        backgroundColor: '#e63a59',
        paddingLeft: 5,
        paddingRight: 5,
        height: 20,
        borderRadius: 3,
        justifyContent: 'center',
        marginLeft: 5,
        marginRight: 5,
    },
    tagText: {
        fontSize: 14,
        color: '#fff',
    },
});


export default Tag;