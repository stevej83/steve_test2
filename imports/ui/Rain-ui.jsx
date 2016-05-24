import React, { Component, PropTypes } from 'react';
import { WeathersCollection } from '../api/weather-api.js'

export default class WeatherUiClass extends Component {
  render() {  
    var rain = this.props.weatherUiProp.rain;

    var rain_text1 = 'Hong Kong rain warning: '
    var item;
    var rain_text2 = 'no warning.'
    
    if (rain.trim.length > 0) {
      item = <span>&nbsp;&nbsp;&nbsp;{rain_text1}{rain}</span>;
    } else {
      item = <span>&nbsp;&nbsp;&nbsp;{rain_text1}{rain_text2}</span>;
    }

    return (
      item
    );
  }
}



