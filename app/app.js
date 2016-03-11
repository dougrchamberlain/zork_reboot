"use strict";

angular.module("underscore", []).factory("_", ["$window", function ($window) {
    return $window._; // assumes underscore has already been loaded on the page
}]);

// Declare app level module which depends on views, and components
angular.module("myApp", [
    "ui.router",
    "ui.bootstrap",
    "ngAnimate",
    "ngResource",
    "underscore"
]).factory("messageFactory", ["_", function (_) {

}]).config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider.state("game", {
        url: "/",
        templateUrl: "game.html",
        controller: "appController",
        controllerAs: "vm"
    });
}]).controller("appController", ["$scope", "$resource", "_", "$controller", "inventoryService", "gameService","zorkMessageService",  function ($scope, $resource, _, $controller, inventoryService, G,messageService) {
    var vm = this;

    vm.createVendingMachine = function () {
        var vendingMachine = G.createGameObject("vending machine", "inventoryController");
        var soda = G.createGameObject("soda", "inventoryItemController");
        var chips = G.createGameObject("chips", "inventoryItemController");
        var key = G.createGameObject("key", "inventoryItemController");
        var candy = G.createGameObject("candy", "inventoryItemController");

        vendingMachine.add(soda);
        vendingMachine.add(chips);
        vendingMachine.add(key);
        vendingMachine.add(candy);
        vendingMachine.canTake = false;

        vm.vendingMachine = vendingMachine;
        return vendingMachine;
    };

    vm.createCouch = function () {
        var couch = G.createGameObject("couch", "inventoryController");
        var change = G.createGameObject("change", "inventoryItemController");

        couch.close();
        couch.add(change);


        vm.couch = couch;
        return couch;
    }

    vm.createDesk = function () {
        var desk = G.createGameObject("desk", "inventoryController");
        var letter = G.createGameObject("letter", "inventoryItemController");

        desk.close();
        desk.add(letter);

        vm.desk = desk;
        return desk;
    }

    vm.createPlayer = function (name) {
        var player = G.createGameObject(name,"playerController");
        var letter = G.createGameObject("game-letter","inventoryItemController");


        player.add(letter);

        vm.player = player;
        return player;
    };

    vm.processCommand = function (command) {
        var words = command.split(' ');

        if(words[2]) {
            vm.player[words[0]](words[1], words[2]);
        }
        else if(words[1]){
            vm.player[words[0]](words[1]);
        }
        else{
            vm.player[words[0]]();
        }

    }

    vm.queueCommand = function (command, event) {
        if (event.keyCode == 13) {
            vm.status = [];
            messageService.add("> " + command);
            vm.processCommand(command);
            G.update();
            vm.command = "";
        }
    };

    $scope.$on("item.action",function(event,data){
        console.log(data.item.name  + " used " + data.target.name);
    });


    $scope.$on("inventory.add",function(event,data){
        console.log(data.item.name  + " added");
    });

    $scope.$on("inventory.remove",function(event,data){
        console.log(data.item.name  + " dropped");
    });


    var room1 = G.createGameObject("Starting Room",["roomController","inventoryController"]);
    var room2 = G.createGameObject("Auditorium",["roomController","inventoryController"]);
    var room3 = G.createGameObject("room 3",["roomController","inventoryController"]);
    var room4 = G.createGameObject("room 4",["roomController","inventoryController"]);
    var room5 = G.createGameObject("room 5",["roomController","inventoryController"]);
    var room6 = G.createGameObject("room 6",["roomController","inventoryController"]);
    var room7 = G.createGameObject("room 7",["roomController","inventoryController"]);
    var room8 = G.createGameObject("room 8",["roomController","inventoryController"]);
    var room9 = G.createGameObject("room 9",["roomController","inventoryController"]);
    var room10 = G.createGameObject("room 10",["roomController","inventoryController"]);
    var room11 =  G.createGameObject("room 11",["roomController","inventoryController"]);
    var room12 = G.createGameObject("room 12",["roomController","inventoryController"]);
    var room13 = G.createGameObject("room 13",["roomController","inventoryController"]);
    var room14 = G.createGameObject("room 14",["roomController","inventoryController"]);
    var room15 = G.createGameObject("room 15",["roomController","inventoryController"]);
    var room16 = G.createGameObject("room 16",["roomController","inventoryController"]);
    var room17 = G.createGameObject("room 17",["roomController","inventoryController"]);
    var room18 = G.createGameObject("room 18",["roomController","inventoryController"]);
    var room19 = G.createGameObject("room 19",["roomController","inventoryController"]);
    var room20 = G.createGameObject("room 20",["roomController","inventoryController"]);
    var room21 = G.createGameObject("room 21",["roomController","inventoryController"]);
    var room22 = G.createGameObject("room 22",["roomController","inventoryController"]);
    var room23 = G.createGameObject("room 23",["roomController","inventoryController"]);
    var room24 = G.createGameObject("room 24",["roomController","inventoryController"]);

    vm.createPlayer("Doug");

    room1.setExits("south",room9);

    room2.setExits("east", room3);

    room3.setExits("west", room2);
    room3.setExits("south", room12);

    room4.setExits("south", room16);
    room4.setExits("east", room5);


    room5.setExits("west", room4);
    room5.setExits("south", room6);

    room6.setExits("north", room5);
    room6.setExits("south", room16);

    room7.setExits("down", room9);

    room8.setExits("up", room9);

    room9.setExits("north",room1);
    room9.setExits("sw",room11);
    room9.setExits("south",room10);
    room9.setExits("east",room12);
    room9.setExits("up", room7);
    room9.setExits("down", room8);

    room10.setExits("north", room9);

    room11.setExits("north", room9);

    room12.setExits("west", room9);
    room12.setExits("south", room15);
    room12.setExits("north", room3);

    room13.setExits("se", room14);

    room14.setExits("west", room15);
    room14.setExits("east", room18);
    room14.setExits("north", room13);
    room14.setExits("south", room22);

    room15.setExits("west", room9);
    room15.setExits("sw", room19);
    room15.setExits("north", room12);
    room15.setExits("east", room14);

    room16.setExits("north", room6);
    room16.setExits("south", room18);
    room16.setExits("west", room4);
    room16.setExits("up", room17);

    room17.setExits("down", room16);

    room18.setExits("north", room16);
    room18.setExits("south", room14);
    room18.setExits("east", room24);

    room19.setExits("west", room15);
    room19.setExits("east", room20);


    room20.setExits("west", room19);

    room21.setExits("east", room22);


    room22.setExits("south", room14);
    room22.setExits("west", room21);
    room22.setExits("east", room23);

    room23.setExits("south", room22);
    room23.setExits("east", room24);

    room24.setExits("north", room18);
    room24.setExits("nw", room23);

    vm.messages = messageService.messages();


    vm.player.currentRoom = room1;

    room1.description = "Hundreds of feet above you see light from where you were lowered here by your captors.  The room is dimly lit, but you can make out this is an underground storage facility of some kind.";
    room2.description = "Ending Room: If you made it here, you can leave or whatever.";
    room9.description = "You are in the kitchen of the white house. A table seems to have been used recently for the preparation of food. A passage leads to the east and a dark staircase can be seen leading upward, another staircase leads down. there are other openings to the north south, and southwest"

    var key = G.createGameObject("key",["inventoryItemController"])
    var sack = G.createGameObject("sack", ["inventoryItemController","inventoryController"]);
    var jar = G.createGameObject("bottle", ["inventoryItemController","inventoryController"]);
    var water = G.createGameObject("water", ["inventoryItemController"]);

    sack.description = "On the table is an elongated brown sack, smelling of hot peppers.";
    jar.description = "A bottle is sitting on the table."
    water.description = "A quantity of water"

    room9.add(sack);
    room9.add(jar);
    jar.add(water);
    jar.visibleContents = true;



    G.start();


}]);
