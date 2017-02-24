var mongoose = require('mongoose');
var util = require('util');

var Schema = mongoose.Schema;

var BaseSchema = function() {
  Schema.apply(this, arguments);

  this.add({
    name: {type: String, required: true},
    powerData : {type: [Number]},
  });
}
util.inherits(BaseSchema, Schema);

module.exports = BaseSchema;
