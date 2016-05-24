import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { WeathersCollection } from '../api/weather-api.js'

import WeatherUi from './Weather-ui.jsx';
import GaleUi from './Gale-ui.jsx';
import RainUi from './Rain-ui.jsx';
import HotcoldUi from './Hotcold-ui.jsx';
import TsunamiUi from './Tsunami-ui.jsx';

class AppUiClass extends Component {    
  renderWeathers() {
    return this.props.weathersAppUiVar.map((weatherCollectionVar) => (
      <WeatherUi key={weatherCollectionVar._id} weatherUiProp={weatherCollectionVar} />
    ));
  }
  renderGale() {
    return this.props.otherAppUiVar.map((weatherCollectionVar) => (
      <GaleUi key={weatherCollectionVar._id} weatherUiProp={weatherCollectionVar} />
    ));
  }
  renderRain() {
    return this.props.otherAppUiVar.map((weatherCollectionVar) => (
      <RainUi key={weatherCollectionVar._id} weatherUiProp={weatherCollectionVar} />
    ));
  }
  renderHotcold() {
    return this.props.otherAppUiVar.map((weatherCollectionVar) => (
      <HotcoldUi key={weatherCollectionVar._id} weatherUiProp={weatherCollectionVar} />
    ));
  }
  renderTsunami() {
    return this.props.otherAppUiVar.map((weatherCollectionVar) => (
      <TsunamiUi key={weatherCollectionVar._id} weatherUiProp={weatherCollectionVar} />
    ));
  }
  
  
  render() {
    
    var headerStyle = {
      
    };
    
    return (
      <div>
        <header>
          <h1>
            <span>&nbsp;&nbsp;&nbsp;天气</span>
          </h1>
        </header>

        <ul>
          {this.renderWeathers()}
        </ul>
        
        {this.renderGale()}<br />
        {this.renderRain()}<br />
        {this.renderHotcold()}<br />
        {this.renderTsunami()}
        
      </div>
    );
  }
}

export default createContainer(() => {
  return {
    weathersAppUiVar: WeathersCollection.find({}, { sort: { createdAt: -1 } }).fetch(),
    otherAppUiVar: WeathersCollection.find({ city: "Hong Kong" }).fetch(),
  };
}, AppUiClass);
 
