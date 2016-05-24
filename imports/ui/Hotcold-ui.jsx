import React, { Component, PropTypes } from 'react';
import { WeathersCollection } from '../api/weather-api.js'

export default class WeatherUiClass extends Component {
  render() {
    var hotcold = this.props.weatherUiProp.hotcold;

    var hotcold_text1 = 'Hong Kong weather warning: '
    var item;
    var hotcold_text2 = 'no warning.'
    
    if (hotcold.trim.length > 0) {
      item = <span>&nbsp;&nbsp;&nbsp;{hotcold_text1}{hotcold}</span>;
    } else {
      item = <span>&nbsp;&nbsp;&nbsp;{hotcold_text1}{hotcold_text2}</span>;
    }

    return (
      item
    );
  }
}



