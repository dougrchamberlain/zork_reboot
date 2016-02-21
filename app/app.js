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
}]).controller("appController", ["$resource", "_", function ($resource, _) {
    var vm = this;
    vm.commands = [];
    vm.status = []
    vm.player = {};
    vm.player.inventory = [{
        name: "lamp",
        life: 20,
        canActivate: true,
        canCarry: true,
        description: "Wanko brand darkness removal tool."
    }];


    vm.items = [];
    vm.creatures = [];
    vm.rooms = [];


    vm.map = {
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
    };

    vm.location = 1;


    vm.setLocation = function (locationId) {
        vm.location = (_.filter(vm.map.rooms, function (room) {
            return room.id == locationId;
        }))[0];
        if (vm.location.lit) {
            lookService();
        }
    };

    vm.onActionTaken = function () {
        vm.player.inventory.forEach(function (item) {
            if (item.life) {
                item.life--;
            }
        })
    };

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

    vm.activateController = function () {
        var lil = this;

        lil.canActivate = function (obj) {
            obj = obj || {};
            return obj.canActivate;
        };


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
                    vm.setLocation(vm.location.exits[item]);
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
            else if(foundThing && foundThing.isOpen){
                vm.status.push(foundThing.name + " is already opened.");
            }

        }
        },

        {
            name: ["take", "get"], needsObject: false, callback: function (item, words) {
            var loot = vm.location.loot;

            if (loot.length == 0) {
                vm.status.push("nothing to take.");
            }


            for (var i = 0, len = loot.length - 1; i <= len; i++) {
                if (_.find(words, function (w) {
                        if (w == "all") {
                            w = ".+?"
                        }
                        var regex = new RegExp(w, "g");

                        return regex.test(loot[i].name);
                    })) {
                    if (loot[i].canCarry) {
                        vm.player.inventory.push(loot[i]);
                        vm.status.push(loot[i].name + " taken.");

                    }
                    else if (!loot[i].canCarry) {
                        vm.status.push(loot[i].name + " can not be taken.");
                    }
                }
            }
            vm.player.inventory.forEach(function (invItem) {

                var index = _.findIndex(loot, function (j) {
                    return j.name == invItem.name;
                });

                if (index > -1) {
                    loot.splice(index, 1);
                }
            });
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
                            vm.location.lit = true;
                            lookService();
                        }
                    }
                }
                else if (words[0] == "off") {
                    if (item) {
                        item.state = "off";
                        if (words[1] == "lamp") {
                            vm.location.lit = false;
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

            if (!foundThing && words[0] == vm.location.name) {
                vm.status.push(vm.location.description);
            }
            else if (foundThing) {
                vm.status.push("This " + foundThing.name + " is a " + foundThing.description);

            }


            // return;s
        }
        }];

    vm.parseCommand = function (command) {

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

    vm.sysCommand = function (actions, objects) {

        objects.forEach(function (obj) {
            actions.forEach(function (action) {
                action.callback(obj);
            });

            //evaluateObjectAfterAction(obj)
        });

        if (objects.length == 0) {
            actions.forEach(function (action) {
                if (action.needsObject == false) {
                    action.callback();
                }
            });
        }

    }

    vm.processCommand = function (command) {
        var returnedValues = vm.parseCommand(command);

        if (returnedValues.isValid) {
            vm.onActionTaken();
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

    vm.setLocation(1);


}]);
