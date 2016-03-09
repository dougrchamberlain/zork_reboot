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
}]).controller("appController", ["$scope", "$resource", "_", "$controller", "inventoryService", "gameService", function ($scope, $resource, _, $controller, inventoryService, G) {
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
        var letter = G.createGameObject("game letter","inventoryItemController");


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
            vm.processCommand(command);

        }
    };

    $scope.$on("item.action",function(event,data){
        console.log(data.item.name  + " used on " + data.target.name);
    });


    vm.room = G.createGameObject("clock room","inventoryController");

    var door = G.createGameObject("door","doorController");
    door.opensWith("key");

    vm.createPlayer("Doug");
    vm.createCouch();
    vm.createDesk();
    vm.createVendingMachine();

    vm.room.add(vm.vendingMachine);
    vm.room.add(vm.couch);
    vm.room.add(vm.desk);
    vm.room.add(vm.player);


}]);
