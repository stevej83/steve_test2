import { Meteor } from 'meteor/meteor';

import { Mongo } from 'meteor/mongo';

import { WeathersCollection } from '../imports/api/weather-api.js'

Meteor.startup(() => {
  // code to run on server at startup
  console.log('check start - a23');
  
  // function test
  var ga = function (route) {
    console.log('ga route ' + route);
  }
  ga('check end - a23');
  // test end
    
  var string_helper = require('string');
    
  // require nodeJS build http model.
  var http = require("https");
  
  // JSON api URL for Hong Kong
  var url_hk = 'https://query.yahooapis.com/v1/public/yql?q=select%20item.condition%2C%20atmosphere.humidity%20from%20weather.forecast%20where%20woeid%20%3D%202165352%20and%20u%3D%22c%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';

  // JSON link for Beijing
  var url_bj = 'https://query.yahooapis.com/v1/public/yql?q=select%20item.condition%2C%20atmosphere.humidity%20from%20weather.forecast%20where%20woeid%20%3D%202151330%20and%20u%3D%22c%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';

  // JSON link for Shanghai
  var url_sh = 'https://query.yahooapis.com/v1/public/yql?q=select%20item.condition%2C%20atmosphere.humidity%20from%20weather.forecast%20where%20woeid%20%3D%202151849%20and%20u%3D%22c%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';

  // JSON link for Guanghou
  var url_gz = 'https://query.yahooapis.com/v1/public/yql?q=select%20item.condition%2C%20atmosphere.humidity%20from%20weather.forecast%20where%20woeid%20%3D%202161838%20and%20u%3D%22c%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';

  // use http get method
  // Insert or update record for Hong Kong
  http.get(url_hk, function(response){

      var data = '';
      
      // response event 'data' while data are receiving, use a variable accumulate it。
      response.on('data', function(chunk){
        data += chunk;
      });
      
      // response event 'end' when data receiving completed。
      response.on('end', function(){
          // parse JSON to a object 
          data = JSON.parse(data);
          
          var w_code = data.query.results.channel.item.condition.code.toString();
          var w_date = data.query.results.channel.item.condition.date.toString();
          var w_temp = data.query.results.channel.item.condition.temp.toString() + "'C";
          var w_text = data.query.results.channel.item.condition.text.toString();
          var w_humidity = data.query.results.channel.atmosphere.humidity.toString() + "%";
          var w_image_1 = "http://l.yimg.com/a/i/us/we/52/" + w_code + ".gif";

          // use ini_alert set all alert documents to empty string
          var ini_alert = "";
          
          var Fiber = Npm.require('fibers');
                    
          Fiber(function () {
                       
            var find_record_hk = WeathersCollection.findOne({ city: 'Hong Kong' });
            
            if (find_record_hk) {
              WeathersCollection.update({city: 'Hong Kong'}, {$set: {code: w_code, date: w_date, tmp: w_temp, humidity: w_humidity, text: w_text, rain: ini_alert, gale: ini_alert, hotcold: ini_alert, tsunami: ini_alert, img1: w_image_1, meteor_last_update: new Date()}, $currentDate: { "lastModified": true }}, 
              function(error) {
                if(error){
                  console.log(error);
                }
              });
              
              // HK special : HKO alert message
              var cheerio = require('cheerio');
              
              var xmlSources = ['http://rss.weather.gov.hk/rss/WeatherWarningSummaryv2.xml'],
              parsedXml = [];
              
              var xmlContent = "";
              for (var i = 0; i < xmlSources.length; i++) {
                var result = Meteor.http.call("GET", xmlSources[i]);
                if(result.statusCode == '200' && result.content){
                  xmlContent += result.content;
                }
              }
                          
              // Tell Cherrio to load the HTML
              $ = cheerio.load(xmlContent);
              
              $('item').each(function() {   // here need to check when 
                $('guid').each(function() {
                //console.log($(this).text().substring(43)); // test
                
                var phrase_object = string_helper($(this).text().substring(41));
                var phrase_string = phrase_object.toString();
                
                // test Hong Kong weather
                console.log('HK: ' + w_code + ' / ' + w_date + ' / ' + w_temp + ' / ' + w_text + ' / ' + w_humidity + ' / ' + phrase_string + ' / ' + w_image_1);
                // test end
                
                if (phrase_object.contains("Rainstorm") && !phrase_object.contains("cancelled")) {
                  WeathersCollection.update({city: "Hong Kong"}, {$set: {rain: phrase_string, meteor_last_update: new Date()}, $currentDate: { "lastModified": true }}, function(error) {
                    if(error){
                      console.log(error);
                    }
                  });
                } else if (phrase_object.contains("Gale") && !phrase_object.contains("cancelled")) {
                  WeathersCollection.update({city: "Hong Kong"}, {$set: {gale: phrase_string, meteor_last_update: new Date()}, $currentDate: { "lastModified": true }}, function(error) {
                    if(error){
                      console.log(error);
                    }
                  });
                } else if (phrase_object.contains("Weather Warning") && !phrase_object.contains("cancelled")) {
                  WeathersCollection.update({city: "Hong Kong"}, {$set: {hotcold: phrase_string, meteor_last_update: new Date()}, $currentDate: { "lastModified": true }}, function(error) {
                    if(error){
                      console.log(error);
                    }
                  });
                } else if (phrase_object.contains("Tsunami") && !phrase_object.contains("cancelled")) {
                  WeathersCollection.update({city: "Hong Kong"}, {$set: {tsunami: phrase_string, meteor_last_update: new Date()}, $currentDate: { "lastModified": true }}, function(error) {
                    if(error){
                      console.log(error);
                    }
                  });
                }
                });
              });
                     
            } else {
              WeathersCollection.insert({city: "Hong Kong", code: w_code, date: w_date, temp: w_temp, humidity: w_humidity, text: w_text, rain: ini_alert, gale: ini_alert, hotcold: ini_alert, tsunami: ini_alert, img1: w_image_1, meteor_last_update: new Date()}, function(error) {
              if(error){
                console.log(error);
              }
            });} 
          }).run();
      }); 
  });
  
  // use http get method
  // Insert or update record for Beijing
  http.get(url_bj, function(response){

      var data = '';
      
      // response event 'data' while data are receiving, use a variable accumulate it。
      response.on('data', function(chunk){
        data += chunk;
      });
      
      // response event 'end' when data receiving completed。
      response.on('end', function(){
          // parse JSON to a object 
          data = JSON.parse(data);
          
          var w_code = data.query.results.channel.item.condition.code.toString();
          var w_date = data.query.results.channel.item.condition.date.toString();
          var w_temp = data.query.results.channel.item.condition.temp.toString() + "'C";
          var w_text = data.query.results.channel.item.condition.text.toString();
          var w_humidity = data.query.results.channel.atmosphere.humidity.toString() + "%";
          var w_image_1 = "http://l.yimg.com/a/i/us/we/52/" + w_code + ".gif";
          // use ini_alert set all alert documents to empty string
          var ini_alert = "";
          
          var Fiber = Npm.require('fibers');
                    
          Fiber(function () {
                       
            var find_record_bj = WeathersCollection.findOne({ city: 'Beijing' });
            
            if (find_record_bj) {
              // test Beijing weather
              console.log('BJ: ' + w_code + ' / ' + w_date + ' / ' + w_temp + ' / ' + w_text + ' / ' + w_humidity);
              // test end
              WeathersCollection.update({city: 'Beijing'}, {$set: {code: w_code, date: w_date, tmp: w_temp, humidity: w_humidity, text: w_text, img1: w_image_1, meteor_last_update: new Date()}, $currentDate: { "lastModified": true }}, 
              function(error) {
                if(error){
                  console.log(error);
                }
              });                      
            } else {
              WeathersCollection.insert({city: "Beijing", code: w_code, date: w_date, temp: w_temp, humidity: w_humidity, text: w_text, img1: w_image_1, meteor_last_update: new Date()}, function(error) {
              if(error){
                console.log(error);
              }
            });} 
          }).run(); 
      }); 
    });
    
  // use http get method
  // Insert or update record for Shanghai
  http.get(url_sh, function(response){

      var data = '';
      
      // response event 'data' while data are receiving, use a variable accumulate it。
      response.on('data', function(chunk){
        data += chunk;
      });
      
      // response event 'end' when data receiving completed。
      response.on('end', function(){
          // parse JSON to a object 
          data = JSON.parse(data);
          
          var w_code = data.query.results.channel.item.condition.code.toString();
          var w_date = data.query.results.channel.item.condition.date.toString();
          var w_temp = data.query.results.channel.item.condition.temp.toString() + "'C";
          var w_text = data.query.results.channel.item.condition.text.toString();
          var w_humidity = data.query.results.channel.atmosphere.humidity.toString() + "%";
          var w_image_1 = "http://l.yimg.com/a/i/us/we/52/" + w_code + ".gif";
          // use ini_alert set all alert documents to empty string
          var ini_alert = "";
          
          var Fiber = Npm.require('fibers');
                    
          Fiber(function () {
                       
            var find_record_sh = WeathersCollection.findOne({ city: 'Shanghai' });
            
            if (find_record_sh) {
              // test Guangzhou weather
              console.log('SH: ' + w_code + ' / ' + w_date + ' / ' + w_temp + ' / ' + w_text + ' / ' + w_humidity);
              // test end
              WeathersCollection.update({city: 'Shanghai'}, {$set: {code: w_code, date: w_date, tmp: w_temp, humidity: w_humidity, text: w_text, img1: w_image_1, meteor_last_update: new Date()}, $currentDate: { "lastModified": true }}, 
              function(error) {
                if(error){
                  console.log(error);
                }
              });                      
            } else {
              WeathersCollection.insert({city: "Shanghai", code: w_code, date: w_date, temp: w_temp, humidity: w_humidity, text: w_text, img1: w_image_1, meteor_last_update: new Date()}, function(error) {
              if(error){
                console.log(error);
              }
            });} 
          }).run(); 
      }); 
    });
    
  // use http get method
  // Insert or update record for Beijing
  http.get(url_gz, function(response){

      var data = '';
      
      // response event 'data' while data are receiving, use a variable accumulate it。
      response.on('data', function(chunk){
        data += chunk;
      });
      
      // response event 'end' when data receiving completed。
      response.on('end', function(){
          // parse JSON to a object 
          data = JSON.parse(data);
          
          var w_code = data.query.results.channel.item.condition.code.toString();
          var w_date = data.query.results.channel.item.condition.date.toString();
          var w_temp = data.query.results.channel.item.condition.temp.toString() + "'C";
          var w_text = data.query.results.channel.item.condition.text.toString();
          var w_humidity = data.query.results.channel.atmosphere.humidity.toString() + "%";
          var w_image_1 = "http://l.yimg.com/a/i/us/we/52/" + w_code + ".gif";
          // use ini_alert set all alert documents to empty string
          var ini_alert = "";
          
          var Fiber = Npm.require('fibers');
                    
          Fiber(function () {
                       
            var find_record_gz = WeathersCollection.findOne({ city: 'Guangzhou' });
            
            if (find_record_gz) {
              // test Guangzhou weather
              console.log('GZ: ' + w_code + ' / ' + w_date + ' / ' + w_temp + ' / ' + w_text + ' / ' + w_humidity);
              // test end
              WeathersCollection.update({city: 'Guangzhou'}, {$set: {code: w_code, date: w_date, tmp: w_temp, humidity: w_humidity, text: w_text, img1: w_image_1, meteor_last_update: new Date()}, $currentDate: { "lastModified": true }}, 
              function(error) {
                if(error){
                  console.log(error);
                }
              });                      
            } else {
              WeathersCollection.insert({city: "Guangzhou", code: w_code, date: w_date, temp: w_temp, humidity: w_humidity, text: w_text, img1: w_image_1, meteor_last_update: new Date()}, function(error) {
              if(error){
                console.log(error);
              }
            });} 
          }).run(); 
      }); 
    });
});

