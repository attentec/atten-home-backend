var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var BaseSchema = require('./base');
var Device = require('./device');

var RoomSchema   = new BaseSchema({
  houseId : {type: Schema.Types.ObjectId, required: true},
  temperature : {type: [Number]},
});

RoomSchema.post('remove', function(next) {
  Device.find({roomId: this._id},function(err, devices){
      if(err)
          console.log("Error when removing devices")

      devices.forEach(function(device){
        Device.findById(device._id, function(err, device){
          if(err)
            console.log("Error removing device " + device.id)
          device.remove(function(err){
            if(err)
              res.send(err);
            console.log("Removed device " + device.id)
          });
        });
      });

  });
});

module.exports = mongoose.model('Room', RoomSchema);
