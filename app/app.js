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
    vm.player.inventory = itemService.getInventory();


    itemService.transfer([{
        name: "lamp",
        life: 20,
        canActivate: true,
        canCarry: true,
        details:{ description: "Wanko brand darkness removal tool."}
    }],vm.player.inventory,"lamp");

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


    var lookService = function (item, words) {
        words = words || [];
        if (words.length == 1) {
            vm.status.push("You look at " + (item.name || "nothing."));
        }
        else {
            if (vm.location.loot) {
                vm.status.push("You look around. You can see: ");
                vm.location.loot.filter(function (l) {
                    return !l.inventory
                }).forEach(function (lootItem) {
                    vm.status.push(lootItem.name + " " + (lootItem.state || ""));
                });
            }

        }
    };
    //return;

    vm.describeRoom = function (locationId) {
        console.log();
        return vm.location.longDescription;
    };

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
            name: ["look", "l"], needsObject: false, callback: lookService
        },
        {
            name: ["listen"], callback: function (item) {
            //return;
        }
        },
        {

            name: ["north", "south", "west", "east", "northeast", "southeast", "southwest", "northwest"],
            needsObject: false,
            callback: function (item) {
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
            name: ["talk"], callback: function (item, words) {
            // return;
        }
        },
        {
            name: ["clear"], needsObject: false, callback: clearService
        },
        {
            name: ["open"], needsObject: false, callback: function (item, words) {
            var inventory, loot, monsters;
            var foundThing;

            inventory = _.find(vm.player.inventory, function (item) {
                return item.name == words[0];
            });


            loot = _.find(vm.location.loot, function (item) {
                return item.name == words[0];
            });

            monsters = _.find(vm.location.monsters, function (item) {
                return item.name == words[0];
            });

            foundThing = inventory || loot || monsters;

            if (!foundThing || !foundThing.type == "container") {
                vm.status.push("You can't open that.");
            }
            else if (foundThing && foundThing.isOpen == false) {
                foundThing.isOpen = true;
                vm.status.push("You open the " + foundThing.name + ".");

            }
            else if (foundThing && foundThing.isOpen) {
                vm.status.push(foundThing.name + " is already opened.");
            }

        }
        },

        {
            name: ["take", "get"], needsObject: false, callback: function (item, words) {
                itemService.take(vm.location.loot,vm.player.inventory,words[0]);
        }
        },
        {
            name: ["drop", "d"], needsObject: false, callback: function (item, words) {
            var inventory = vm.player.inventory;

            if (inventory.length == 0) {
                vm.status.push("You have nothing to drop");
            }

            for (var i = 0, len = inventory.length - 1; i <= len; i++) {
                if (_.find(words, function (w) {
                        if (w == "all") {
                            w = ".+?"
                        }
                        var regex = new RegExp(w, "g");

                        return regex.test(inventory[i].name);
                    })) {
                    if (inventory[i]) {
                        vm.location.loot.push(inventory[i]);
                        vm.status.push(inventory[i].name + " dropped.");

                    }
                }
            }
            vm.location.loot.forEach(function (invItem) {

                var index = _.findIndex(inventory, function (j) {
                    return j.name == invItem.name;
                });

                if (index > -1) {
                    inventory.splice(index, 1);
                }
            });
        }
        },


        {
            name: ["activate", "turn", "use"], callback: function (item, words) {

            if (words[0] == "eric's") {
                vm.status.push("She seems to rather enjoy that.");
                return;
            }
            var item = _.find(vm.player.inventory, function (item) {
                return item.canActivate == true && item.name == words[1];
            });

            var item = _.find(vm.player.inventory, function (item) {
                return item.canActivate == true && item.name == words[1];
            });

            if (item) {
                if (words[0] == "on") {
                    if (item) {
                        item.state = "on";
                        if (words[1] == "lamp") {
                            lookService();
                        }
                    }
                }
                else if (words[0] == "off") {
                    if (item) {
                        item.state = "off";
                        if (words[1] == "lamp") {
                        }
                    }
                }

                vm.status.push(item.name + " turned" + ( " " + item.state || "."));
            }
            else {
                vm.status.push("You can't do this.")
            }

            // return;
        }
        },
        {
            name: ["fight", "attack", "kill"], callback: function (item, words) {


            // return;s
        }
        },

        {
            name: ["desc", "describe", "examine"], callback: function (item, words) {
            var details = itemService.look(words[0],vm.player.inventory);

            vm.status.push(details.description);

        }
        }];

    vm.parseCommand = function (command) {

        //is it an item command?
        var itemCommand = command.match(/^(put|tie|attack|throw|turn|break|attack|kill|put|look)\s(.+\s?)\s(?:with|to|at|in)\s(\w+)$/i);
        var moveCommand = command.match(/^[nsew]$|(ne|nw|se|sw|north|south|east|west|northwest|southwest|northeast|southeast|down|up|d|u)$/i);


        if (moveCommand) {
            angular.forEach(moveCommand, function (item) {
                console.log(item);
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
                    action.callback(name, words);
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


}]);
