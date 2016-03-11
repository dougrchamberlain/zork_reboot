/**
 * Created by doug on 2/27/2016.
 */
angular.module("myApp").controller("playerController", ["$controller",
    "$rootScope", "me", "gameService","zorkMessageService", function ($controller, $rootScope, me, G,messageService) {
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
        vm.me.currentRoom.roomLook(vm.me.currentRoom);
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
        if (!item) {
            angular.forEach(vm.me.currentRoom.inventory.items, function (invItem) {
                messageService.add(invItem.name + " taken.");
                vm.me.add(invItem);
                vm.me.remove(invItem);
            });
            return;
        }

        item = G.getGameObjects(item);

        if (_.contains(item.controllers, "inventoryItemController")) {
            source = G.getGameObjects(source) || vm.me.currentRoom;

         if (item && source.me.inventory.contains(item.name)) {
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


}]).controller("roomController", ["me", "$scope", "gameService","zorkMessageService", function (me, $scope, G, messageService) {
    var vm = this;
    vm.me = me;
    vm.description = "";

    var getKeysAsArray = function(obj){
        var keys = [];
        for(var key in obj){
            keys.push(key);
        }
        return keys;
    };

    vm.fullyDescribe = function(){
        return vm.me.description + " " + listExits();
    }

    var listExits = function(){
        var roomExits = getKeysAsArray(vm.rooms);
        if(roomExits.length > 1){
            return "There are exits " +roomExits.join(", ") + ".";
        }
        return  "There is an exit to the " +roomExits.join(" ") + ".";
    }

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
        vm.roomLook(room);
    };

    var onExit = function () {
    };

    vm.move = function (direction) {

        var newRoom = vm.me.rooms[direction];
        if (newRoom) {
            onExit();
            onEnter(newRoom);
            $scope.$broadcast("action.move", {item: newRoom});
        }
        return newRoom || vm;
    }

    vm.roomLook = function (room) {
        messageService.add(room.name + ": " + room.description);
        angular.forEach(room.inventory.items,function(item){
            messageService.add(item.description);
            item.look();
        });
    }


}]).factory("zorkMessageService",[
    function(){

        var messages = [];

        return {
            messages : function (){
                return messages;
            }
            ,
            add : function(message){
                messages.push(message);
            }
        }
    }
]);
