"use strict";

angular.module("underscore", []).factory("_", ["$window", function ($window) {
    return $window._; // assumes underscore has already been loaded on the page
}]);

// Declare app level module which depends on views, and components
angular.module("myApp", [
    "ui.router", "ui.bootstrap",
    "ngAnimate",
    "ngResource",
    "underscore"
]).factory("messageFactory", ["_", function (_) {

}]).config(["$stateProvider", function ($stateProvider) {
    $stateProvider.state("game", {
        url: "/",
        templateUrl: "game.html",
        controller: "appController",
        controllerAs: "vm"
    });
}]).controller("appController", ["$scope", "$resource", "_", "mapService", "itemService", function ($scope, $resource, _, mapService, itemService) {
    var vm = this;
    vm.commands = [];
    vm.status = []
    vm.player = {};
    vm.player.inventory = itemService.getInventory().inventory;

    var startingItems = [{
        name: "lamp",
        life: 20,
        canActivate: true,
        canCarry: true,
        details: {description: "Wanko brand darkness removal tool."}
    },
        {name: "jar",canCarry: true,container: {isOpen: false,contents:{}}, details: {description: "long description"}, text: "A Mason jar is a molded glass jar used in home canning to preserve food. The mouth of the jar has screw threads on its outer perimeter to accept a metal ring (or \"band\"). The band, when screwed down, presses a separate stamped steel disc-shaped lid against the rim of the jar. An integral rubber ring on the underside of the lid creates a hermetic seal to the jar. The bands and lids usually come with new jars, and bands and lids are also sold separately; while the bands are reusable, the lids are intended for single use when canning.                While largely supplanted by other methods, such as the tin can and plastic containers, for commercial mass production, they are still commonly used in home canning.                The Mason jar was invented and patented in 1858 by Philadelphia tinsmith John Landis Mason[1][2] (1832–1902). Among other common names for them are Ball jars, after Ball Corporation, an early and prolific manufacturer of the jars; fruit jars for a common content; and simply glass canning jars reflecting their material."            },
        {name: "butterfly"}
    ]

    itemService.loadRoom(startingItems);

    vm.map = mapService.load({rooms: {}});
    mapService.createRooms([1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (item) {
        return "room " + item;
    }));

    mapService.getMap().rooms["room 1"].exits.north = "room 9";
    mapService.getMap().rooms["room 9"].exits.west = "room 1";
    mapService.getMap().rooms["room 2"].exits.east = "room 4";
    mapService.setLocation("room 1");


    vm.location = mapService.currentLocation();


    vm.isWinner = function () {
        return vm.location.name == "room 9" && vm.hasLitLamp();
    }

    vm.hasLitLamp = function () {
        var result = _.find(vm.player.inventory, function (item) {
            return item.state == "on" && item.name == "lamp"
        });
        return angular.isDefined(result);
    }

    var clearService = function (item) {
        vm.status = [];
        // return;
    };

    vm.possibleExits = function (items) {
        var result = {};
        angular.forEach(items, function (value, key) {
            if (value) {
                result[key] = value;
            }
        });
        return result;
    }

    var possibleActions = [
        {
            name: ["look", "l"], needsObject: false, callback: function (item) {
            if(item.length == 0){
                itemService.look();
            }
            angular.forEach(item, function (i) {
                itemService.look(i);
            });
        }
        },
        {
            name: ["put"], callback: function (items) {
            itemService.put(items[0]).into(items[2]);
        }
        },
        {

            name: ["go", "north", "south", "west", "east", "northeast", "southeast", "southwest", "northwest"],
            needsObject: false,
            callback: function (item, words) {
                item = item == "go" ? words[0] : item;
                vm.status = [];
                if (vm.location.exits[item]) {
                    mapService.move(item);
                    vm.location = mapService.currentLocation();
                }
                else {
                    vm.status.push("You can't go that way");
                }

                // return;
            }
        },
        {
            name: ["read"], callback: function (item) {
            itemService.read(item[0]);
        }
        },
        {
            name: ["clear"], needsObject: false, callback: clearService
        },
        {
            name: ["open"], needsObject: false, callback: function(item) {
                itemService.open(item[0]);

        }
        },

        {
            name: ["take", "get"], needsObject: false, callback: function (item) {
            angular.forEach(item, function (i) {
                itemService.take(i);
            });
        }
        },
        {
            name: ["drop", "d"], needsObject: false, callback: function (item) {
            angular.forEach(item, function (i) {
                itemService.drop(i);
            });
        }
        },


        {
            name: ["activate", "turn", "use"], callback: function (item, words) {
                itemService.getInventory().inventory["lamp"].state = "on";
        }
        },
        {
            name: ["fight", "attack", "kill"], callback: function (item, words) {


            // return;s
        }
        },

        {
            name: ["desc", "describe", "examine"], callback: function (item, words) {
            var details = itemService.look(words[0]);

            vm.status.push(details.description);

        }
        }];

    vm.parseCommand = function (command) {

        //is it an item command?
        var itemCommand = command.match(/^(put|tie|attack|throw|turn|break|attack|kill|put|look)\s(.+\s?)\s(?:with|to|at|in)\s(\w+)$/i);
        var moveCommand = command.match(/^(?:go\s)[nsew]$|(ne|nw|se|sw|north|south|east|west|northwest|southwest|northeast|southeast|down|up|d|u)$/i);


        if (moveCommand) {
            angular.forEach(moveCommand, function (item) {
                //mapService.move(item);
            });
        }

        var words = command.split(/(?:\s+|the|this|that|with)/g);
        var actions = [];

        possibleActions.forEach(function (action) {
            action.name.forEach(function (name) {
                name = name.toLowerCase();
                if (_.contains(words, name)) {
                    actions.push(action);
                    words.splice(_.findWhere(words, name), 1);
                    action.callback(words);
                }
            })
        });

        _.forEach(words, function (w) {
            w = w.toLowerCase()
        });

        return {actions: actions, objects: words, isValid: actions.length > 0}

    };

    vm.parseMessage = function (action, obj) {
        vm.status.push("You " + action.name + " at " + obj)
    };


    vm.processCommand = function (command) {
        var returnedValues = vm.parseCommand(command);

        if (returnedValues.isValid) {
            vm.commands.push(command.toString());
            vm.command = "";
        }
        else {
            vm.status.push("I beg your pardon?");
        }
    }

    vm.queueCommand = function (command, event) {
        if (event.keyCode == 13) {
            vm.status = [];
            vm.processCommand(command);
        }


    }


}])
;
