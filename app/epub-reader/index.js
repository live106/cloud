import React, {Component} from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Animated,
  Modal,
  StatusBar
} from 'react-native';

// import {Epub, Streamer} from "epubjs-rn";

import TopBar from './TopBar'
import BottomBar from './BottomBar'
import Nav from './Nav'

export default class EpubReader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flow: "paginated", // paginated || scrolled-continuous
      location: 6,
      url: "http://wenjiang-books.oss-cn-beijing.aliyuncs.com/epub/20170803/001069dcdfbd38af/Bzguopan001.epub",
      src: "",
      origin: "",
      title: "",
      toc: [],
      showBars: false,
      showNav: false,
      sliderDisabled: true
    };

    // this.streamer = new Streamer();
    this.comeBack = () => {
      this.props.navigator.pop();
    };
  }

  componentDidMount() {
    // this.streamer.start()
    //   .then((origin) => {
    //     this.setState({origin});
    //     console.log("origin", origin);
    //     console.log('props url:', this.props.url);
    //     return this.streamer.get('http://wenjiang-books.oss-cn-beijing.aliyuncs.com/epub/20170803/001069dcdfbd38af/Bzguopan001.epub');
    //   })
    //   .then((src) => {
    //     console.log(`src: ${src}`);
    //     return this.setState({src});
    //   })
    //   .catch((err) => {
    //     console.log('error', err);
    //   });
  }

  componentWillUnmount() {
    // this.streamer.kill();
  }

  toggleBars() {

    this.setState({showBars: !this.state.showBars});
  }


  render() {
    return (
      <View style={styles.container}>
        {/*<Epub*/}
          {/*style={styles.reader}*/}
          {/*ref="epub"*/}
          {/*//src={"https://s3.amazonaws.com/epubjs/books/moby-dick.epub"}*/}
          {/*src={this.state.src}*/}
          {/*flow={this.state.flow}*/}
          {/*location={this.state.location}*/}
          {/*onLocationChange={(visibleLocation) => {*/}
            {/*console.log("locationChanged", visibleLocation)*/}
            {/*this.setState({visibleLocation});*/}
          {/*}}*/}
          {/*onLocationsReady={(locations) => {*/}
            {/*// console.log("location total", locations.total);*/}
            {/*this.setState({sliderDisabled: false});*/}
          {/*}}*/}
          {/*onReady={(book) => {*/}
            {/*// console.log("Metadata", book.package.metadata)*/}
            {/*// console.log("Table of Contents", book.toc)*/}
            {/*this.setState({*/}
              {/*title: book.package.metadata.title,*/}
              {/*toc: book.toc*/}
            {/*});*/}
          {/*}}*/}
          {/*onPress={(cfi, rendition) => {*/}
            {/*this.toggleBars();*/}
            {/*console.log("press", cfi);*/}
          {/*}}*/}
          {/*onLongPress={(cfi, rendition) => {*/}
            {/*console.log("longpress", cfi);*/}
          {/*}}*/}
          {/*onViewAdded={(index) => {*/}
            {/*console.log("added", index)*/}
          {/*}}*/}
          {/*beforeViewRemoved={(index) => {*/}
            {/*console.log("removed", index)*/}
          {/*}}*/}
          {/*onSelected={(cfiRange, rendition) => {*/}
            {/*console.log("selected", cfiRange)*/}
            {/*// Add marker*/}
            {/*rendition.highlight(cfiRange, {});*/}
          {/*}}*/}
          {/*// themes={{*/}
          {/*//   default: {*/}
          {/*//     body: {*/}
          {/*//       "-webkit-user-select": "none",*/}
          {/*//       "user-select": "none"*/}
          {/*//     }*/}
          {/*//   }*/}
          {/*// }}*/}
          {/*// regenerateLocations={true}*/}
          {/*// generateLocations={true}*/}
          {/*origin={this.state.origin}*/}
        {/*/>*/}
        <View
          style={[styles.bar, {top: 0}]}>
          <TopBar
            title={this.state.title}
            shown={this.state.showBars}
            onBack={this.comeBack}
            onLeftButtonPressed={() => this.refs.nav.show()}
            onRightButtonPressed={
              (value) => {
                if (this.state.flow === "paginated") {
                  this.setState({flow: "scrolled-continuous"});
                } else {
                  this.setState({flow: "paginated"});
                }
              }
            }
          />
        </View>
        <View
          style={[styles.bar, {bottom: 0}]}>
          <BottomBar
            disabled={this.state.sliderDisabled}
            value={this.state.visibleLocation ? this.state.visibleLocation.start.percentage : 0}
            shown={this.state.showBars}
            onSlidingComplete={
              (value) => {
                this.setState({location: value.toFixed(6)})
              }
            }/>
        </View>
        <View>
          <Nav ref="nav"
               display={(loc) => {
                 this.setState({location: loc});
               }}
               toc={this.state.toc}
          />

        </View>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  reader: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#3F3F3C'
  },
  bar: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 55
  }
});

