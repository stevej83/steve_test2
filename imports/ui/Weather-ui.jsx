import React, { Component, PropTypes } from 'react';
import { WeathersCollection } from '../api/weather-api.js'

export default class WeatherUiClass extends Component {
  render() {
    var city = this.props.weatherUiProp.city;
    var tmp = this.props.weatherUiProp.tmp;
    var humidity = this.props.weatherUiProp.humidity;
    var text = this.props.weatherUiProp.text;
    var image_link_1 = this.props.weatherUiProp.img1;
    var image_1 = <img src={image_link_1} width="30px" height="30px" />
    
    var item;
    item = <li>{city}, {tmp}, {humidity}, {text}, {image_link_1}, {image_1}</li>;

    return (
      item
    );

  }
}



