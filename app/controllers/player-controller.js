/**
 * Created by doug on 2/27/2016.
 */
angular.module("myApp").controller("playerController", ["$controller", "$rootScope", "me", "gameService", function ($controller, $rootScope, me, G) {
    var vm = this;
    vm.score = {
        current: 0
    };
    vm.me = me;

    vm.currentRoom;


    //extend player with these controllers
    vm.healthController = $controller("healthController", {me: vm.me});
    vm = angular.extend(vm, $controller("inventoryController", {me: vm.me}));


    var dead = function () {
        vm.score.current += 100;
    };

    vm.attack = function (target, amount) {
        if (target.healthController.takeDamage) {
            target.healthController.takeDamage(amount);
            vm.score.current += 10;
            if (target.isDead && target.isDead()) {
                dead(target);
            }
        }
    };

    vm.use = function (item, target) {
        item = G.getGameObjects(item);
        target = G.getGameObjects(target);
        if (target && target.use) {
            target.use(item);
            $rootScope.$broadcast("item.action", {item: item, target: target});
        }
        else {
            item.use();
            $rootScope.$broadcast("item.action", {item: vm.me, target: item});
        }
    };

    vm.look = function () {
        console.log(vm.me.currentRoom.name + ": " + vm.me.currentRoom.description);
        console.log("here you see a " + _.pluck(vm.me.currentRoom.inventory.items, "name").join(",") + ".");
    }

    var listContents = function (container) {
        container = G.getGameObjects(container);
        angular.forEach(container.inventory.items, function (item) {
            console.log(vm.name + " contains : " + item.name);
        })
    }


    vm.move = function (direction) {
        vm.me.currentRoom = vm.me.currentRoom.move(direction);
        return vm.me.currentRoom;
    };

    ["poop", "pee", "piss", "shit", "vomit", "crap"].forEach(function (gross) {
        vm[gross] = function () {
            console.log("You " + gross + ". Feel better?");
            vm.me.currentRoom.add({name: gross});
            vm.me.currentRoom.look();
        }
    });

    vm.take = function (item, source) {
        item = G.getGameObjects(item);
        if (_.contains(item.controllers, "inventoryItemController")) {
            source = G.getGameObjects(source) || vm.me.currentRoom;

            if (!item) {
                angular.forEach(source.inventory.items, function (invItem) {
                    vm.me.add(invItem);
                    vm.me.remove(invItem);
                });
            }
            else if (item && source.me.inventory.contains(item.name)) {
                vm.me.add(item);
                source.remove(item);
                console.log(vm.me.name + " takes the " + item.name);
            }
            else if (!source.inventory.contains(item.name)) {
                console.log("There isn't any " + item.name + " to take.");
            }
        }
        else {
            console.log("You can't take the " + item.name);
        }

    }

    vm.i = function () {
        angular.forEach(vm.me.inventory.items, function (i) {
            console.log(i.name);
        })
    }

    vm.drop = function (item) {
        item = G.getGameObjects(item);
        vm.me.currentRoom.add(item);
        vm.me.remove(item);

    };

    vm.isDead = function () {
        return vm.healthController.health.current <= 0;
    }
}]).controller("doorController", ["me", "$rootScope", function (me, $rootScope) {
    var vm = this;
    vm.me = me;

    var states = [
        "open",
        "closed",
        "locked"
    ]

    var state = 0;
    var opensWith = [];


    return {
        opensWith: function (item) {
            opensWith.push(item);
            return me;
        },
        use: function (item) {
            if (opensWith.length > 0) {
                state = 0;
            }
        },
        getState: function () {
            return states[state];
        }
    }
}]).controller("bellController", ["me", "$rootScope", "gameService", function (me, $rootScope, G) {
    var vm = this;
    var ringCount = 0;

    vm.onStart = function () {
        player = G.getByComponent("playerController");
        key = G.getGameObjects("key")
    }


    $rootScope.$on("item.action", function (event, data) {
        console.log("You ring the bell.");
        player.score.current += 100;
        console.log("current score " + player.score.current);

    });

    vm.ringCount = function () {
        return ringCount;
    };

    vm.use = function () {
        ringCount++;
    }


}]).controller("roomController", ["me", "$scope", "gameService", function (me, $scope, G) {
    var vm = this;
    vm.me = me;
    vm.description = "";

    vm.rooms = {};

    var player,key;

    vm.onStart = function () {
        player = G.getByComponent("playerController");
        key = G.getGameObjects("key")
    }


    $scope.$on("action.move", function (event, data) {
        console.log("You move to " + data.item.name)
    });

    vm.setExits = function (direction, room) {
        vm.rooms[direction] = room;
    };

    var onEnter = function (room) {

        if (player.inventory.contains(key) === true && room.name === "room 2") {
            console.log("you win");
        }
    };

    var onExit = function () {
    };

    vm.move = function (direction) {

        var newRoom = vm.rooms[direction];
        if (newRoom) {
            onEnter(newRoom);
            onExit();
            $scope.$broadcast("action.move", {item: newRoom});
            console.log(newRoom.name + ": " + vm.description);
            if (newRoom.inventory) {
                console.log("here you see a " + _.pluck(newRoom.inventory.items, "name").join(",") + ".");
            }
        }
        return newRoom || vm;
    }

    vm.look = function () {
        console.log(vm.me.name + ": " + vm.me.description);
        console.log("here you see a " + _.pluck(vm.me.inventory.items, "name").join(",") + ".");
    }


}]);
