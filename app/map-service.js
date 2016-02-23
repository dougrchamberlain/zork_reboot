/**
 * Created by doug on 2/21/2016.
 */
angular.module("myApp").factory("lootService", ["_", function (_) {

    var loot = [];
    return {
        addLoot: function (room,lootItem) {
            loot.push(lootItem);
            return lootItem;
        }
        ,
    }

}]);
angular.module("myApp").factory("mapService", ["_", "lootService", function (_, lootService) {
    var map = {currentRoom: {}};
    map.rooms = {}


    var loadMap = function (obj) {
        var newMap = obj || {
                rooms: [
                    {
                        id: "1",
                        name: "test room",
                        lit: false,
                        image: "topleft0risus0dungeon0altered044.jpg",
                        exits: {
                            south: 2,
                            east: 0

                        },
                        monsters: [],
                        loot: [

                            {name: "picture of a clown", life: 100000, canCarry: true},
                            {name: "grue corpse", life: 20, canCarry: false},
                            {name: "knife", life: -1, canCarry: true},
                            {name: "shotgun", life: 2, canCarry: true},
                            {name: "car", life: 20, canCarry: false}
                        ],
                        description: "Awesome lamp Room!"
                    },
                    {
                        id: "2",
                        name: "test room 2",
                        exits: {
                            west: 1,
                            northwest: 0
                        },
                        lit: true,
                        image: "maintile0risus0dungeon0original00379.jpg",
                        monsters: [
                            {
                                name: "Al Gore",
                                life: 100,
                                type: "enemy"
                            }
                        ],
                        loot: [
                            {name: "eric's Mom", life: 20, canCarry: true, inventory: false},

                        ],
                        description: "stupid butt room"
                    }
                ]
            }
        map = newMap;
        return map;
    }
    return {
        load: loadMap,
        currentLocation: function () {
            return angular.extend(map.currentRoom, lootService);
        },
        createRooms: function (rooms) {
            _.forEach(rooms, function (room) {
                var newRoom = {
                    name: room,
                    exits: {
                        north: null,
                        south: null,
                        east: null,
                        west: null
                    }
                }
                map.rooms[room] = newRoom;
            });
        },
        getMap: function () {

            return map;
        },
        setLocation: function (room) {
            if (angular.isString(room)) {
                map.currentRoom = map.rooms[room];
            }
        },
        move: function (direction) {
            if(map.currentRoom.exits[direction]) {
                map.currentRoom = map.rooms[map.currentRoom.exits[direction]];
            }
            else {
                throw new Error("You can't go that way");
            }
        },
        look: function (item) {
            if (item.details) {
                return item.details;
            }
        }
    }
}]);
