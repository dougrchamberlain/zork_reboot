/**
 * Created by doug on 2/27/2016.
 */
angular.module("myApp").controller("playerController", ["$controller","$rootScope","me","gameService", function ($controller,$rootScope,me,G) {
    var vm = this;
    vm.score = {
        current: 0
    };
    vm.me = me;

    vm.currentRoom;


    //extend player with these controllers
    vm.healthController = $controller("healthController",{me: vm.me});
    vm = angular.extend(vm, $controller("inventoryController",{me: vm.me}));


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

    vm.use = function(item,target){
        item = G.getGameObjects(item);
        target = G.getGameObjects(target);
        if(target && target.use){
            target.use(item);
            $rootScope.$broadcast("item.action",{item: item, target: target});
        }
        else{
            item.use();
            $rootScope.$broadcast("item.action",{item: {name: "You"}, target: target});
        }
    };

    vm.look = function (item) {
        item = G.getGameObjects(item);
            console.log("You look in the " + item.name);

    };

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

    ["poop","pee","piss","shit","vomit","crap"].forEach(function(gross){
        vm[gross] = function(){
            console.log("You " + gross + ". Feel better?");
            vm.me.currentRoom.add({name: gross});
            vm.me.currentRoom.look();
        }
    })



    vm.drop = function(item){
        console.log(item + " dropped");
        vm.me.currentRoom.take(item,vm.me.name);
    }

    vm.isDead= function(){
        return vm.healthController.health.current <= 0;
    }
}]).controller("doorController",["me","$rootScope", function(me,$rootScope){
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
        opensWith: function(item){
            opensWith.push(item);
            return me;
        },
        use: function(item){
            if(opensWith.length > 0){
                state = 0 ;
            }
        },
        getState: function(){
           return states[state];
        }
    }
}]).controller("bellController",["me","$rootScope","gameService", function(me, $rootScope,G){
    var vm = this;
    var ringCount = 0;

    var player = G.getGameObjects("player");


    $rootScope.$on("item.action",function(event,data){
        console.log("You ring the bell.");
        player.score.current += 100;
        console.log("current score " + player.score.current);

    });

    vm.ringCount = function(){
        return ringCount;
    };

    vm.use = function(){
        ringCount++;
    }



}]).controller("roomController",["me","$scope", function(me,$scope){
    var vm = this;
    vm.me = me;
    vm.description = "A large round room with a very high ceiling, covered in decorative tiles.";

    rooms = {};

    $scope.$on("action.move", function(event,data){
        console.log("You move to " + data.item.name)
    });

    vm.setExits = function(direction,room){
        rooms[direction] = room;
    };

    vm.move = function(direction){
        var newRoom = rooms[direction];
        if(newRoom) {
            $scope.$broadcast("action.move", {item: newRoom});
            console.log(newRoom.name + ": " + vm.description);
            if(newRoom.inventory) {
                console.log("here you see a " + _.pluck(newRoom.inventory.items, "name").join(",") + ".");
            }
        }
        return newRoom || vm;
    }

    vm.look = function(){
        console.log(vm.me.name + ": " + vm.me.description);
        console.log("here you see a " + _.pluck(vm.me.inventory.items,"name").join(",") + ".");
    }


}]);
