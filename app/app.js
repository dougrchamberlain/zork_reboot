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
}]).controller("appController", ["$scope", "$resource", "_", "$controller","inventoryService", function ($scope, $resource, _, $controller,inventoryService) {
    var vm = this;


    vm.createVendingMachine = function () {
        var vendingMachine = $controller("containerController");
        var soda = $controller("inventoryItemController");
        var chips = $controller("inventoryItemController");
        var key = $controller("inventoryItemController");
        var candy = $controller("inventoryItemController");

        vendingMachine.name = "Vending Machine";
        soda.name = "soda";
        chips.name = "chips";
        key.name = "key";
        candy.name = "candy";

        vendingMachine.take(soda);
        vendingMachine.take(chips);
        vendingMachine.take(key);
        vendingMachine.take(candy);

        vm.vendingMachine = vendingMachine;
        return vendingMachine;
    };

    vm.createCouch = function () {
        var couch = $controller("containerController");
        var change = $controller("inventoryItemController");

        couch.name = "couch";
        couch.close();

        change.name = "coin";

        couch.take(change);
        vm.couch = couch;
        return couch;
    }

    vm.createDesk = function () {
        var desk = $controller("containerController");
        var letter = $controller("inventoryItemController");

        desk.name = "desk";
        desk.close();

        letter.name = "letter";

        desk.take(letter);
        vm.desk = desk;
        return desk;
    }

    vm.createPlayer = function (name) {
        var player = $controller("playerController");
        player.name = name;
        vm.player = player;
        return player;

    };

    vm.processCommand = function (command) {
        var words = command.split(' ');
        var obj = vm[words[1]];
        var item = inventoryService.findByName(words[1],vm.desk.inventory);

    }

    vm.queueCommand = function (command, event) {
        if (event.keyCode == 13) {
            vm.status = [];

        }
    }

    vm.createPlayer("Doug");
    vm.createVendingMachine();
    vm.createDesk();
    vm.createCouch();

    //happy path the damn game
    vm.couch.look();
    vm.couch.take();
    vm.desk.look();
    vm.vendingMachine.look();
    vm.player.take(inventoryService.findByName("key",vm.vendingMachine.inventory));

}]);
