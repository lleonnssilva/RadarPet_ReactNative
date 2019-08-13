import React, { Component } from 'react'
import { YellowBox } from 'react-native'
import Map from './Map';

YellowBox.ignoreWarnings(['Remote'])
export default class HomeScreen extends Component {

  render() {
    return <Map  navigation={this.props.navigation} />
  }
}
