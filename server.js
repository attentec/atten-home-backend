// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost/attenhome'); // connect to our database

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;        // set our port

//========= MODELS =========
var House = require('./app/models/house');
var Room = require('./app/models/room');
var Device = require('./app/models/device');
var Lamp = require('./app/models/lamp');
var Radiator = require('./app/models/radiator');

//========= COMMON ERROR MESSAGES =========
var deviceNotApplicable = 'Type was not specified, choose from [lamp, radiator]';

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:3000/api)
router.get('/', function(req, res) {
    res.json({ message: 'Test' });
});

router.route('/houses')

    // create a house (accessed at POST http://localhost:3000/api/houses)
    .post(function(req, res) {
        var house = new House();
        house.name = req.body.name;
        house.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'House created!' });
        });
    })
    .get(function(req, res){
        House.find(req.query, function(err, houses){
            if(err)
                res.send(err);
            res.json(houses);
        });
    });

router.route('/houses/:id')
    .get(function(req, res){
      House.findById(req.params.id, function(err, house){
        if(err)
          res.send(err);
        res.json(house);
      });
    })
    .put(function(req, res){
      House.findById(req.params.id, function(err, house){
        if(err)
          res.send(err);
        house.name = req.body.name;
        house.save(function(err){
          if(err)
            res.send(err);
          res.json({message: "House updated!"});
        });
      });
    })
    .delete(function(req, res){
      House.findById(req.params.id, function(err, house){
        if(err)
          res.send(err);
        house.remove(function(err){
          if(err)
            res.send(err);
          res.json({message: "House deleted!"})
        });
      });
    });

router.route('/rooms')
        // create a room (accessed at POST http://localhost:3000/api/rooms)
        .post(function(req, res) {
            var room = new Room();
            room.name = req.body.name;
            room.houseId = req.body.houseId;
            room.save(function(err) {
                if (err)
                    res.send(err);
                res.json({ message: 'Room created!' });
            });
        })
        .get(function(req, res){
            Room.find(req.query,function(err, rooms){
                if(err)
                    res.send(err);
                res.json(rooms);
            });
        });

router.route('/rooms/:id')

        .get(function(req, res){
          Room.findById(req.params.id, function(err, room){
            if(err)
              res.send(err);
            res.json(room);
          });
        })
        .put(function(req, res){
          Room.findById(req.params.id, function(err, room){
            if(err)
              res.send(err);
            room.name = req.body.name;
            room.houseId = req.body.houseId;
            room.save(function(err){
              if(err)
                res.send(err);
              res.json({message: "Room updated!"});
            });

          });
        })
        .delete(function(req, res){
          Room.findById(req.params.id, function(err, room){
            if(err)
              res.send(err);
            room.remove(function(err){
              if(err)
                res.send(err);
              res.json({message: "Room deleted!"})
            });
          });
        });

router.route('/devices')
        // create a device (accessed at POST http://localhost:3000/api/devices)
        .post(function(req, res) {
            var device;
            switch (req.body.type) {
              case 'lamp':
                device = new Lamp();
                device.dimmer = req.body.dimmer;
                break;
              case 'radiator':
                device = new Radiator();
                device.temp = req.body.temp;
                break;
              default:
                res.json({message: deviceNotApplicable})
            }
            device.name = req.body.name;
            device.roomId = req.body.roomId;
            device.powerConsumption = req.body.powerConsumption;
            device.save(function(err) {
                if (err)
                    res.send(err);
                res.json({ message: req.body.type + ' created!' });
            });
        })
        .get(function(req, res){
            Device.find(req.query,function(err, devices){
                if(err)
                    res.send(err);
                res.json(devices);
            });
        });

router.route('/devices/:id')
          .get(function(req, res){
              Device.findById(req.params.id, function(err, device){
                if(err)
                  res.send(err);
                res.json(device);
              });
          })
          .put(function(req, res){
              Device.findById(req.params.id, function(err, device){
                if(err)
                  res.send(err);
                switch (req.body.type) {
                  case 'Lamp':
                    device.dimmer = req.body.dimmer;
                    break;
                  case 'Radiator':
                    device.temp = req.body.temp;
                    break;
                  default:
                    res.json({message: deviceNotApplicable})
                }
                device.name = req.body.name;
                device.roomId = req.body.roomId;
                device.powered = req.body.powered;
                device.powerConsumption = req.body.powerConsumption;
                console.log("Updates device");
                device.save(function(err){
                  if(err)
                    res.send(err);
                  console.log("Successfully updated device");
                  res.json({message: "Device updated!"});
                });
              });
            })
            .delete(function(req, res){
              Device.findById(req.params.id, function(err, device){
                if(err)
                  res.send(err);
                  device.remove(function(err){
                  if(err)
                    res.send(err);
                  res.json({message: "Device deleted!"})
                });
              });
            });

router.route('/reset').get(function(req, res){
  Device.find(function(err, devices){
      if(err)
          res.send(err);
      devices.forEach((device) => {
        if(device.__t == "Lamp"){
          var randomDimmer = 78;
          while(randomDimmer == 78){
            randomDimmer = Math.floor(Math.random() * 100);
          }
          device.dimmer = randomDimmer;
        }
        else{
          var randomTemp = 4;
          while(randomTemp == 4){
            randomTemp = Math.floor(Math.random() * 9);
          }
          device.temp = randomTemp;
        }
        device.powered = Math.random() >= 0.5;
        if(device.name == 'Roof Lamp'){
          device.powered = false;
        }
        if(device.name == 'Oven Lamp'){
          var randomDimmer = device.dimmer;
          while(randomDimmer >= 25 && randomDimmer <= 32){
            randomDimmer = Math.floor(Math.random() * 100);
          }
          device.dimmer = randomDimmer;
        }
        device.save(function(err){
          if(err)
            res.send(err);
        });
      })
    res.json({message: "Reset data!"})
  });
})

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
