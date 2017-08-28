
import React, {Component} from 'react';
import {StyleSheet, StatusBar, Platform} from 'react-native';
import {QMTabBar as TabBar} from 'qmkit';

import {msg} from 'iflux-native';
import MainPage from '../main/index'
import Message from'../message'
import PersonalCenter from'../personal-center'

const homeIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADcAAAA3CAYAAACo29JGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QjI2RTZDRUY3NjBBMTFFNUJDMzVGOUQ3Q0M1OTVEOUIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjI2RTZDRjA3NjBBMTFFNUJDMzVGOUQ3Q0M1OTVEOUIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCMjZFNkNFRDc2MEExMUU1QkMzNUY5RDdDQzU5NUQ5QiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCMjZFNkNFRTc2MEExMUU1QkMzNUY5RDdDQzU5NUQ5QiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PtmJkfYAAAbISURBVHja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';
const menuIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADcAAAA3CAYAAACo29JGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QjI2RTZDRjM3NjBBMTFFNUJDMzVGOUQ3Q0M1OTVEOUIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjI2RTZDRjQ3NjBBMTFFNUJDMzVGOUQ3Q0M1OTVEOUIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCMjZFNkNGMTc2MEExMUU1QkMzNUY5RDdDQzU5NUQ5QiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCMjZFNkNGMjc2MEExMUU1QkMzNUY5RDdDQzU5NUQ5QiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PlKQscEAAAGiSURBVHja7JgxS8NAGIZbtQoODs5qpYigkyDq7ujmDxCHlgyC6KIVcRNKBwXBLXMXQRAsopubi6s4uvgfHMQQn4MbQkkvGYRc6/vBy5eU3Nd7ch+991qO47g0rDFSGuIQnOAEJzjBCU5wgvMvxpI3YRguk25RBe0GQfCSNojnFkgdNO8BQ4QemWvDCUdcoiV7fY1W+xRsoQ2PFqmOGllt+ZC47jqKPXnWgV9pH5Z7jzy03DZpnGW+cVXjuU3SoqmBijo3me/+MS+b+X5mwuUN4ApdKmC0FQhOcIITnOBknHs25xPjUFCbjfLbMXYP1YqaeMJERNahPGedCtqkpr2tWkOaVviMdO7RIh1bK+Zsy7nEddVRbHYQ2/IATdi23HeMa9pnamlvrADj3M11KpBx1lYgOMEJTnCCG1zjbKxVhU3yI2PsNJop2DgbhxIx17dMh8KALdI9GkU7DOr0KWz+s7xDU54s0itzXc9qyyMLZuLUUezQIzATa3na8gKtWOiWo9gVMm9q0hO49z81zvq1FJzgBCc4wQlOcIIT3H+C+xVgAMHNYTAfrxIUAAAAAElFTkSuQmCC';
const memberIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADcAAAA3CAYAAACo29JGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QjI3MDM2REU3NjBBMTFFNUJDMzVGOUQ3Q0M1OTVEOUIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjI3MDM2REY3NjBBMTFFNUJDMzVGOUQ3Q0M1OTVEOUIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCMjcwMzZEQzc2MEExMUU1QkMzNUY5RDdDQzU5NUQ5QiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCMjcwMzZERDc2MEExMUU1QkMzNUY5RDdDQzU5NUQ5QiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pu+MDF8AAAPaSURBVHja7Jp7SBVBFMb3mlGRvYzU6KmWmb2ESIxKEDUSCZLCoD/6pxApCakoKoPIiiAqAqOSCDKhSIoSIy1BMqgspLLUpKDsSZSVtwJDwr7D/RYWUTDv7M4ie+Dju3MfM/5m9p6dOVdfd3e3MVgjxBjE4cF5cC6MULs6LikpSYCtgtKguVAEX/JDrdBd6DpU11cfubm57oID1BzYPmhNH28ZDS2itkIPof3QDVdflgArgD23gJ2DcqB4aAwUBk2HMqHD0BcoCaqEzroWDmDFsONsnoEmQxugcl6Gcjn+htqgKmgXNAnazs/Ie+9BQ1wFBzBZhc1s5uC7kgd96MdHu6Cj/E6+hxZDd1wDB7DlsJ1sZgCqfADdNEGJ0FdoCYH1wgHMB7vEZgHAaoLorp2Z1WCiidO9chuhcVAzwE4omOxG6CQfH9MNZ16OOxQmud30LFwZ47XAYeBoWCzUiVVTeY/yM5sa3ARoWbkk+m0bNjjV9GRdcLH0JzbAtdKn6IILo3fYANfRYwzH4TrpI2yAM/v8owuujR5nA1wM/aMuuMf0FTbALaU/1QX3DPoBTcBtIVEx3Gr6NS1wuLdJ2ayYzUMKwfKhkTJ5GOOVzh2KuUXKxOqlKgATqCOW/aW+7Rdm9rtsmNmsAGCEgpv3cKiG0nvk4Ya5ivekBgDGDLCrCh53ZMKyXXNYBWAmT9Fy+m4F4Pr/zIxynlvJk7ocWH+5qswAQJn1MiNQdDoPwPssHUzr5e3h3BRfMQJVsARm3/mWrVfQ4VP9WwGgFsIuQLMtT7+APkEyWBRhrHEA2tvLhAX1t4QqBpsBWwAN7fFSPGWNR9BVqDTYnYitcICK58yvszz9EqqHWqA3vOF30l8zcdgaoQrACmFFlqdOQxdxSdXhtWC6lhLfXy1w+MNH8bJK51NSqzwIqHcKJl32rZEYIxv91TuaLTFoJDe1AvbZCJT08hSBSUgleiL0AGNlOQaHwaTW3wBF8zuVEGRJr7eQWugpPq7EmGlOrZxUhKUMXg+oZOibTflgk2XvWgPAqbbCYQDZaiUydS+zO9th4rbBLrN5yzY4ntm2sJmOgbsMBwLjrDUCvyPMYma2ZeVK6ZIRWwxnwzy8FgFwrFI4dJgCmydVKYAVOgwmqyc/UN5ks1D1yu0xV83QF+bvePmY7BAlcOgonKnZvFFrCaxeM08Ow3g8UrJyGfRaDOA39EYZXRlcquWkrDtq6Smq4MyyXZML4BrpM1XBmSfpt7rJ8LWQ8nq7ymwZRe8w3BE+lXDtBPO7BE4y5k8tNRQ3hfdfex6cB+fBeXD9iX8CDAAgbBK3SXmMEQAAAABJRU5ErkJggg==';


class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedTab: window.selectedTab || 'mainPage'
    };
  }

  componentDidMount() {

  }


  componentWillUnmount() {

  }


  render() {

    return (
      <TabBar tintColor='#fd4062'>
        {/*首页*/}
        <TabBar.Item
          selected={this.state.selectedTab === 'mainPage'}
          icon={{uri: homeIcon, scale: 2}}
          title='首页'
          onPress={() => this._menuChange('mainPage')}>
          <MainPage />
        </TabBar.Item>

        {/*消息*/}
        <TabBar.Item
          selected={this.state.selectedTab === 'message'}
          icon={{uri: menuIcon, scale: 2}}
          title='消息'
          onPress={() => this._menuChange('message')}>
          <Message/>
        </TabBar.Item>

        {/*个人中心*/}
        <TabBar.Item
          selected={this.state.selectedTab === 'personalCenter'}
          icon={{uri: memberIcon, scale: 2}}
          title='&nbsp;&nbsp;个人中心'
          onPress={() => this._menuChangeAndFresh('personalCenter')}>
          <PersonalCenter />
        </TabBar.Item>
      </TabBar>
    );
  }


  _menuChange(menu) {

    if (Platform.OS === 'ios') {
      if (menu === undefined || menu === 'mainPage') {
        StatusBar.setBarStyle('light-content');
      } else {
        StatusBar.setBarStyle('default');
      }
    }

    window.selectedTab = menu;
    this.setState({
      selectedTab: menu
    });
  }


  _menuChangeAndFresh(menu) {
    if (this.state.selectedTab != menu) {
      window.selectedTab = menu;
      msg.emit('route:replaceRoute', {sceneName: 'Home'})
    }
  }
}

export default Home;
