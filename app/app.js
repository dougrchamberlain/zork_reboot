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
}]).controller("appController", ["$scope", "$resource", "_","$controller", function ($scope, $resource, _,$controller) {
    var vm = this;



    vm.createVendingMachine = function(){
        var vendingMachine = $controller("containerController");
        var soda = $controller("inventoryItemController");
        var chips = $controller("inventoryItemController");
        var key = $controller("inventoryItemController");
        var candy = $controller("inventoryItemController");

        vendingMachine.take(soda);
        vendingMachine.take(chips);
        vendingMachine.take(key);
        vendingMachine.take(candy);
        return vendingMachine;
    };

    vm.createCouch = function(){
        var couch = $controller("containerController");
        var change = $controller("inventoryItemController");
        couch.take(change);
        return couch;
    }

    vm.createDesk = function(){
        var desk = $controller("containerController");
        var letter = $controller("inventoryItemController");
        desk.take(letter);
        return desk;
    }

    vm.createPlayer = function (name) {
        var player = $controller("playerController");
        player.name = name;
        vm.player = player;
        return player;

    };

    vm.createPlayer("Doug");

    vm.processCommand = function (command) {
      vm.player[command.split(' ')[0]];
    }

    vm.queueCommand = function (command, event) {
        if (event.keyCode == 13) {
            vm.status = [];
            vm.processCommand(command.toLowerCase());
        }
    }

}]);
