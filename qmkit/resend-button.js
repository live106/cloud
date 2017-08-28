'use strict';

import React from 'react';
import {View, TouchableOpacity, StyleSheet, Text} from 'react-native';

class ResendButton extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			disable: this.props.disable == undefined ? true: this.props.disable,
			//默认倒计时时间
			time: this.props.time || 5,
			name: this.props.name || '重新发送',
		};
		this.timer = null;
	}

	componentDidMount(){
		this._doCount();
	}

	componentWillUnmount() {
		this.timer && clearInterval(this.timer);
	}

	render() {
		var borderStyle = this.state.disable? {borderColor: '#dddddd'}: {borderColor: '#e63a59'};
		var sendStyle = this.state.disable ? {color: '#dddddd'} : {color: '#e63a59'};

		return(
			<TouchableOpacity 
				activeOpacity={0.6} 
				style={[styles.sendBtn, borderStyle]}
				onPress={!this.state.disable ? ()=>this._handlePress() : null}>
				<Text style={[styles.sendText, sendStyle]}
					  allowFontScaling={false}>{this.state.name}
					{this.state.disable ? '('+this.state.time + 's)' : ''}</Text>
			</TouchableOpacity>
		)
	}

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
	}

	/**
	 * 计时器倒计时
	 */
	_doCount(){
		this.timer  = setInterval(() => {
				if(this.state.time == 1){
					this.timer&&clearInterval(this.timer);
					this.setState({
						disable:false
					});
				}

				this.setState({
					time: this.state.time -1
				});
			}, 1000);
	}
}


const styles = StyleSheet.create({
	sendBtn: {
		//flex: 2,
		width: 120,
		height: 50,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
		borderRadius: 5,
		marginLeft: 10,
		backgroundColor: '#fff'
	},

	sendText: {
		fontSize: 16
	}
});

export default ResendButton;
