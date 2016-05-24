import React, { Component, PropTypes } from 'react';
import { WeathersCollection } from '../api/weather-api.js'

export default class WeatherUiClass extends Component {
  render() { 
    var tsunami = this.props.weatherUiProp.tsunami;

    var tsunami_text1 = 'Hong Kong tsunami warning: '
    var item;
    var tsunami_text2 = 'no warning.'
    
    if (tsunami.trim.length > 0) {
      item = <span>&nbsp;&nbsp;&nbsp;{tsunami_text1}{tsunami}</span>;
    } else {
      item = <span>&nbsp;&nbsp;&nbsp;{tsunami_text1}{tsunami_text2}</span>;
    }

    return (
      item
    );
  }
}



