var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var BaseSchema = require('./base');

var DeviceSchema   = new BaseSchema({
  roomId : {type: Schema.Types.ObjectId, required: true},
  powered : {type: Boolean, default:false},
  powerConsumption : {type: Number, default:0},
});

module.exports = mongoose.model('Device', DeviceSchema);
