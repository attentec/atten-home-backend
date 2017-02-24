var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var DeviceSchema = require('./device');

var LampSchema   = new Schema({
  dimmer : {type: Number, default: 0, min:0, max: 100},
});

module.exports = DeviceSchema.discriminator('Lamp', LampSchema);
