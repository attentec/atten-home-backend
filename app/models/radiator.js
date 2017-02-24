var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var DeviceSchema = require('./device');

var RadiatorSchema   = new Schema({
  temp : {type: Number, default: 0, min:0, max: 9},
  temperature : {type: [Number], default:0},
});

module.exports = DeviceSchema.discriminator('Radiator', RadiatorSchema);
