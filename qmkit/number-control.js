'use strict';

import React from 'react';
import {View, Text, TextInput, StyleSheet, TouchableOpacity, Image, PixelRatio} from 'react-native';
import {msg} from 'iflux-native';


class NumberControl extends React.PureComponent {
    static defaultProps = {
        chosenNum: 1,
        maxNum: 100,
        minNum: 1
    };
    
    constructor(props) {
        super(props);
        this.state = {
            chosenNum: this.props.chosenNum,
            tempNum: this.props.chosenNum,
            maxNum: this.props.maxNum,
            minNum: this.props.minNum
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.chosenNum != nextProps.chosenNum) {
            this.setState({
                chosenNum: nextProps.chosenNum,
                maxNum: nextProps.maxNum
            });
        }
    }

    componentWillUnmount(){
        this.requestAnimation&&cancelAnimationFrame(this.requestAnimation);
    }


    render() {
        return (
            <View style={styles.numBox}>
                <TouchableOpacity style={styles.numItem} activeOpacity={0.8} onPress={() => this._numberMinus()}>
                    <Image
                        style={[styles.numBtn, this.state.chosenNum == this.props.minNum ? {tintColor: '#ccc'} : {}]}
                        source={require('./img/minus.png')}/>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} style={styles.inputItem} onPress={() => this._editDialog()}>
                    <Text>{this.props.chosenNum}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.numItem} activeOpacity={0.8} onPress={() => this._numberPlus()}>
                    <Image
                        style={[styles.numBtn, this.state.chosenNum == this.props.maxNum ? {tintColor: '#ccc'} : {}]}
                        source={require('./img/plus.png')}/>
                </TouchableOpacity>
            </View>
        )
    }

    //弹窗内容
    _renderDialog() {
        return (
            <View style={styles.dialog}>
                <Text style={{fontSize: 16, marginBottom: 20}}>修改购买数量</Text>
                <View style={[styles.numBox, styles.bigNumBox]}>
                    <TouchableOpacity style={styles.numItem} activeOpacity={0.8}
                                      onPress={(inTemp) => this._numberMinus(true)}>
                        <Image
                            style={styles.numBtn}
                            source={require('./img/minus.png')}/>
                    </TouchableOpacity>
                    <View style={styles.inputItem}>
                        <TextInput
                            ref={component => this._textInput = component}
                            style={styles.numInput}
                            underlineColorAndroid='transparent'
                            value={this.state.tempNum.toString()}
                            keyboardType='numeric'
                            autoFocus={true}
                            onChangeText={(tempNum) => this._changeNumber(tempNum)}
                            onBlur={() => this._handleNumber()}/>
                    </View>
                    <TouchableOpacity style={styles.numItem} activeOpacity={0.8}
                                      onPress={(inTemp) => this._numberPlus(true)}>
                        <Image
                            style={styles.numBtn}
                            source={require('./img/plus.png')}/>
                    </TouchableOpacity>
                </View>
                <Text style={{marginTop: 5, fontSize: 12, color: '#e63a59'}}>最多可选{this.props.maxNum}件商品</Text>
            </View>
        )
    }

    //编辑文本弹窗
    _editDialog() {
        const initVal = this.state.chosenNum;
        this.setState({
            tempNum: this.state.chosenNum
        });
        msg.emit('app:alert', {
            visible: true,
            diaStyle: {marginTop: -150},
            children: this._renderDialog(),
            okHandle: () => {
                this.setState({
                    chosenNum: this.state.tempNum == '' ? this.props.minNum : this.state.tempNum
                }, () => this.props.callbackParent(this.state.chosenNum));
            },
            cancelHandle: () => {
                this.setState({
                    tempNum: initVal
                });
            }
        });
    }

    //文本框输入
    _changeNumber(tempNum) {
        let reg = new RegExp('^[0-9]*$');
        let num = tempNum;
        let tipText = '';

        if (!reg.test(tempNum)) {
            num = this.props.minNum;
        } else if (tempNum > this.props.maxNum) {
            num = this.props.maxNum;
            tipText = '最多可选' + this.props.maxNum + '件商品';
        } else if (tempNum < this.props.minNum && tempNum !== '') {
            num = this.props.minNum;
        } else {
            num = tempNum;
        }

        this.requestAnimation = requestAnimationFrame(() => {
            this.setState({
                tempNum: parseInt(num)
            }, () => {
                this._textInput.setNativeProps({
                    text: num.toString()
                });
            })
        });
    }

    //文本框失去焦点
    _handleNumber() {
        if (this.state.tempNum == '') {
            this.setState({
                tempNum: this.props.minNum
            });
        }
    }

    //点击减少
    _numberMinus(inTemp) {
        let nextNum = parseInt(this.state.tempNum) - 1;
        let num = '';

        if (nextNum >= this.props.minNum) {
            num = nextNum;
        } else {
            num = this.props.minNum;
        }
        ;
        if (inTemp) {
            this.setState({
                tempNum: num
            }, () => {
                this._textInput.setNativeProps({
                    text: num.toString()
                })
            });
        } else {
            this.setState({
                chosenNum: num,
                tempNum: num
            }, () => this.props.callbackParent(num));
        }
        ;
    }

    //点击增加
    _numberPlus(inTemp) {
        let nextNum = parseInt(this.state.tempNum) + 1;
        let num = '';

        if (nextNum <= this.props.maxNum) {
            num = nextNum;
        } else {
            num = this.props.maxNum;
            msg.emit('app:tip', '最多可选' + this.props.maxNum + '件商品');
        }
        ;
        if (inTemp) {
            this.setState({
                tempNum: num
            }, () => {
                this._textInput.setNativeProps({
                    text: num.toString()
                })
            });
        } else {
            this.setState({
                chosenNum: num,
                tempNum: num
            }, () => this.props.callbackParent(num));
        }
        ;
    }
}


const styles = StyleSheet.create({
    numBox: {
        flexDirection: 'row',
        width: 120,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 3,
        height: 30,
        overflow: 'hidden',
    },
    numItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderLeftColor: '#ddd',
        borderRightColor: '#ddd',
    },
    numInput: {
        flex: 1,
        height: 28,
        textAlign: 'center',
        textAlignVertical: 'center',
        padding: 0,
        color: '#666',
        fontSize: 16,
    },
    numBtn: {
        width: 12,
        height: 12
    },
    dialog: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: '#ccc',
    },
    bigNumBox: {
        width: 150,
        height: 40,
        backgroundColor: '#fff'
    }
});


export default NumberControl;
