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
}]).controller("appController", ["$scope", "$resource", "_","gameService", function ($scope, $resource, _, gameService) {
    var vm = this;

    vm.player = gameService.createPlayer("Doug");



    vm.processCommand = function (command) {

      vm.player[command.split(' ')[0]];
    }

    vm.queueCommand = function (command, event) {
        if (event.keyCode == 13) {
            vm.status = [];
            vm.processCommand(command.toLowerCase());
        }


    }


}]).factory("gameService", ["_", "$controller", function (_, $controller) {
    return {
        createPlayer: function (name) {
            var player = $controller("playerController");
            player.name = name;
            return player;

        }
    }
}])
;
