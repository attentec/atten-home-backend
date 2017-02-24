## Backend


### Remote deploy
git remote add deploy ssh://python@188.166.33.205/home/python/pod/repos/attenHome.git

Push to deploy master to deploy changes automatically.


### API Documentation

The base-url is http://188.166.33.205:3000/api/



#### Houses
Available at http://188.166.33.205:3000/api/houses

GET to this adress to get a list of all houses. Query parameters are taken as for example ?name=exampleName
POST to this adress to create a new house. Required body value is name.

##### Individual house

Available athttp://188.166.33.205:3000/api/houses/:id where id is the id of a house.

GET to this adress to get a specific house.
PUT to this adress to update all values of this house.
DELETE to this adress to delete the house and all related objects.

#### Rooms
Available at http://188.166.33.205:3000/api/rooms

GET to this adress to get a list of all rooms. Query parameters are taken as for example ?houseId=ID
POST to this adress to create a new room. Required body value is name and houseId.

##### Individual house

Available at http://188.166.33.205:3000/api/rooms/:id where id is the id of a room.

GET to this adress to get a specific room.
PUT to this adress to update all values of this room.
DELETE to this adress to delete the room and all related objects.

#### Devices
Available at http://188.166.33.205:3000/api/devices

GET to this adress to get a list of all devices. Query parameters are taken as for example ?roomId=ID
POST to this adress to create a new device. Required body value is name, roomId and type that is part of devices = [lamp].

Devices has individual values that can be set. The values powered {Boolean}, powerConsumption {Number} is available on all devices.

Lamp has a special value dimmer {0,100}.

##### Individual device

Available at http://188.166.33.205:3000/api/devices/:id where id is the id of a device.

GET to this adress to get a specific device.
PUT to this adress to update all values of this device.
DELETE to this adress to delete the device.
