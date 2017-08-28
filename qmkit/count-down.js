'use strict';

import React from 'react';
import {Text} from 'react-native';

class CountDownText extends React.Component{

	static defaultProps = {
		timeOffset: 0,
		overHandler: ()=>{}
	};

	constructor(props){
		super(props);
		this.state = {
			//默认倒计时时间，正整数，单位：秒
			timeOffset: this.props.timeOffset
		}
	}
	
	componentWillReceiveProps(nextProps){
		if(nextProps.timeOffset != this.props.timeOffset){
			this.setState({
				timeOffset: nextProps.timeOffset
			});
		}
	}
	
	componentDidMount(){
		this._doCount();
	}

	componentWillUnmount(){
		this.timer && clearInterval(this.timer);
	}

	render() {
		return(
				<Text {...this.props}>
					{this._timeFormat(this.state.timeOffset)}
				</Text>
		)
	}

	_timeFormat(timeOffset){
		const day = Math.floor(timeOffset/(24*3600));
		const hour = Math.floor((timeOffset%(24*3600))/3600);
		const min = Math.floor((timeOffset%3600)/60);
		const second =timeOffset%60;

		return '剩余' + day + '天' + hour + '小时' + min + '分' + second + '秒';
	}
	
	/**
	 * 计时器倒计时
	 */
	_doCount(){
			this.timer = setInterval(() => {
				if(this.state.timeOffset <= 1){
					this.timer&&clearInterval(this.timer);
					this.props.overHandler();
				}

				this.setState({
					timeOffset: this.state.timeOffset - 1
				});
			}, 1000);
	}
}

export default CountDownText;
