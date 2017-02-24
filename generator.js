// BASE SETUP
// =============================================================================
'use strict';
// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost/attenhome'); // connect to our database


//========= MODELS =========
var House = require('./app/models/house');
var Room = require('./app/models/room');
var Device = require('./app/models/device');
var Lamp = require('./app/models/lamp');
var Radiator = require('./app/models/radiator')

//========= COMMON ERROR MESSAGES =========
var deviceNotApplicable = 'Type was not specified, choose from [lamp, radiator]';

var Scheduler = require('nschedule');

var TICK_IN_MS = 100;
var ARRAY_SAVE_LENGTH = 50;

// Create a scheduler that will not execute more than 1 task
// at a time.
var scheduler = new Scheduler(1);

scheduler.add(1000, function(done){
  var roomPowerConsumption = {};
  Device.find(function(err, devices){
    devices.forEach(function(device){
      var powerConsumption = getDevicePowerConsumption(device);
      while(device.powerData.length > ARRAY_SAVE_LENGTH -1){
        device.powerData.shift();
      }
      device.powerData.push(powerConsumption);
      device.save(function(err){
        if(err){
          console.log("Device ERROR");

          console.log(err);
        }
      });
      if(roomPowerConsumption[device.roomId]){
        roomPowerConsumption[device.roomId] += powerConsumption;
      }else{
        roomPowerConsumption[device.roomId] = powerConsumption;
      }

    });
    console.log(roomPowerConsumption);
    var housePowerConsumption = {};
    Room.find(function(err, rooms){
      rooms.forEach(function(room){
        var powerConsumption = (!roomPowerConsumption[room._id]) ? 0 :
          roomPowerConsumption[room._id]
        while(room.powerData.length > ARRAY_SAVE_LENGTH-1){
          room.powerData.shift();
        }
        room.powerData.push(powerConsumption);
        room.save(function(err){
          if(err){
            console.log("Room ERROR");

            console.log(err);
          }
        });
        if(housePowerConsumption[room.houseId]){
          housePowerConsumption[room.houseId] += powerConsumption;
        }else{
          housePowerConsumption[room.houseId] = powerConsumption;
        }
      });
      House.find(function(err, houses){
        houses.forEach(function(house){
          var powerConsumption = (!housePowerConsumption[house._id]) ? 0 :
            housePowerConsumption[house._id]
          while(house.powerData.length > ARRAY_SAVE_LENGTH-1){
            house.powerData.shift();
          }
          house.powerData.push(powerConsumption);
          house.save(function(err){
            if(err){
              console.log("House ERROR");

              console.log(err);
            }
          });
        });
        updateTemperatures();
      });
    })
  });
  done();
});

function getDevicePowerConsumption(device){
  if(device.powered){
    switch (device.__t) {
      case 'Lamp':
        return device.powerConsumption * (device.dimmer/100);
      case 'Radiator':
        return device.powerConsumption * device.temp;
      default:
    }
  }
  return 0;
}

function updateTemperatures(){
  var roomTemperature = {};
  Radiator.find(function(err, devices){
    devices.forEach(function(device){
      var temperature = getDeviceTemperature(device);
      while(device.temperature.length > ARRAY_SAVE_LENGTH-1){
        device.temperature.shift();
      }
      device.temperature.push(temperature);
      device.save(function(err){
        if(err){
          console.log("Device ERROR");
          console.log(err);
        }
      });
      if(roomTemperature[device.roomId]){
        roomTemperature[device.roomId] += temperature;
      }else{
        roomTemperature[device.roomId] = temperature;
      }

    });
    console.log(roomTemperature);
    var houseTemperature = {};
    Room.find(function(err, rooms){
      rooms.forEach(function(room){
        var temperature = (!roomTemperature[room._id]) ? 0 :
          roomTemperature[room._id]
        while(room.temperature.length > ARRAY_SAVE_LENGTH-1){
          room.temperature.shift();
        }
        room.temperature.push(temperature);
        room.save(function(err){
          if(err){
            console.log("ROOM ERROR");
            console.log(err);
          }
        });
        if(houseTemperature[room.houseId]){
          houseTemperature[room.houseId] += temperature;
        }else{
          houseTemperature[room.houseId] = temperature;
        }
      });
      House.find(function(err, houses){
        houses.forEach(function(house){
          var temperature = (!houseTemperature[house._id]) ? 0 :
            houseTemperature[house._id]/rooms.length;
          while(house.temperature.length > ARRAY_SAVE_LENGTH-1){
            house.temperature.shift();
          }
          house.temperature.push(temperature);
          house.save(function(err){
            if(err){
              console.log("House ERROR");
              console.log(err);
            }
          });
        });
      });
    })
  });
}

function getDeviceTemperature(device){
    var lastTemp = device.temperature.slice(-1)[0];
    var lastPower = device.powerData.slice(-1)[0];
    var addition = (lastTemp < lastPower/50) ?
      (lastPower/10000)-0.01 :
      (lastPower/10000*-1)-0.01;
    var newTemp = (lastTemp + addition >= 0) ?
      lastTemp+addition : 0;
    return (newTemp);
}
