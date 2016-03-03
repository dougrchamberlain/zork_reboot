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

    $scope.$on("inventory.add", function(event, data){
        console.log(data.item.name + " added.");
    });


    vm.createVendingMachine = function () {
        var vendingMachine = $controller("inventoryController");
        var soda = $controller("inventoryItemController",{me: vendingMachine});
        var chips = $controller("inventoryItemController",{me: vendingMachine});
        var key = $controller("inventoryItemController",{me: vendingMachine});
        var candy = $controller("inventoryItemController",{me: vendingMachine});

        vendingMachine.name = "Vending Machine";
        soda.name = "soda";
        chips.name = "chips";
        key.name = "key";
        candy.name = "candy";

        vendingMachine.add(soda);
        vendingMachine.add(chips);
        vendingMachine.add(key);
        vendingMachine.add(candy);
        vendingMachine.canTake = false;

        vm.vendingMachine = vendingMachine;
        return vendingMachine;
    };

    vm.createCouch = function () {
        var couch = $controller("inventoryController");
        var change = $controller("inventoryItemController");

        couch.name = "couch";
        couch.close();

        change.name = "coin";

        couch.add(change);
        vm.couch = couch;
        return couch;
    }

    vm.createDesk = function () {
        var desk = $controller("inventoryController");
        var letter = $controller("inventoryItemController");

        desk.name = "desk";
        desk.close();

        letter.name = "letter";

        desk.add(letter);
        vm.desk = desk;
        return desk;
    }

    vm.createPlayer = function (name) {
        var player = $controller("playerController");
        var letter = $controller("inventoryItemController");
        letter.name = "game instructions";


        player.add(letter);

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

    vm.room = $controller("inventoryController");
    vm.room.name  = "Clock Room";

    vm.room.add(vm.vendingMachine);
    vm.room.add(vm.couch);
    vm.room.add(vm.desk);
    vm.room.add(vm.player);




}]);
