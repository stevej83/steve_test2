import React, { Component, PropTypes } from 'react';
import { WeathersCollection } from '../api/weather-api.js'

export default class WeatherUiClass extends Component {
  render() {  
    var gale = this.props.weatherUiProp.gale;

    var gale_text1 = 'Hong Kong gale warning: '
    var item;
    var gale_text2 = 'no warning.'
    
    if (gale.trim.length > 0) {
      item = <span>&nbsp;&nbsp;&nbsp;{gale_text1}{gale}</span>
    } else {
      item = <span>&nbsp;&nbsp;&nbsp;{gale_text1}{gale_text2}</span>
    }

    return (
      item
    );
  }
}



