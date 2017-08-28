'use strict';

import React from 'react';
import {View, TouchableOpacity, StyleSheet, Text} from 'react-native';

import Timer from 'react-timer-mixin';
import {msg} from 'iflux-native';

const SendButton = React.createClass({
	mixins: [Timer],


	getInitialState(){
		return {
			disable: /*this.props.disable == undefined ? true: this.props.disable*/false,
			//默认倒计时时间
			time: this.props.time || 5,
			name: this.props.name || '重新发送',
			text:'发送验证码'
		};
	},


	componentDidMount(){
		// this._doCount();
	},


	render() {
		var borderStyle = this.state.disable? {borderColor: '#dddddd'}: {borderColor: '#e63a59'};
		var sendStyle = this.state.disable ? {color: '#dddddd'} : {color: '#e63a59'};

		return(
			<TouchableOpacity activeOpacity={0.6} style={[styles.sendBtn, borderStyle]}
												onPress={!this.state.disable ? this._handlePress : null}>
				<Text style={[styles.sendText, sendStyle]} allowFontScaling={false}>{this.state.text}</Text>
			</TouchableOpacity>
		)
	},


	/**
	 * 重新发送短信
	 */
	_handlePress(){
		this.setState({
			time : this.props.time || 5,
			disable: true
		}, ()=> {
			this._doCount();
			this.props.resend();
		});
	},


	/**
	 * 计时器倒计时
	 */
	_doCount(){
			let timer = this.setInterval(() => {
				if(this.state.time == 1){
					this.clearTimeout(timer);
					this.setState({
						disable:false,
						text:`发送验证码`
					});
					return ;
				}
				let time = this.state.time-1;
				this.setState({
					time: time,
					text:`${time}秒后重新发送`
				});
			}, 1000);
	}
});


var styles = StyleSheet.create({
	sendBtn: {
		//flex: 2,
		/*width: 120,
		height: 50,*/
		padding:10,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
		borderRadius: 3,
		marginLeft: 10,
		backgroundColor: '#fff'
	},

	sendText: {
		fontSize: 15
	}
});

export default SendButton;
