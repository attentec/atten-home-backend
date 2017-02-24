var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var BaseSchema = require('./base');
var Room = require('./room');

var HouseSchema   = new BaseSchema({
  temperature : {type: [Number]},
});
HouseSchema.post('remove', function(next) {
    Room.find({houseId: this._id},function(err, rooms){
        if(err)
            console.log("Error when removing rooms")

        rooms.forEach(function(room){
          Room.findById(room._id, function(err, room){
            if(err)
              console.log("Error removing room " + room.id)
            room.remove(function(err){
              if(err)
                res.send(err);
              console.log("Removed room " + room.id)
            });
          });
        });

    });
});

module.exports = mongoose.model('House', HouseSchema);
