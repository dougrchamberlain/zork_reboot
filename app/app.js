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
}]).controller("appController", ["$resource", "_", function ( $resource, _) {
    var vm = this;
    vm.inputText = "";
    var commandList = ["look"];

    var processCommand = function (command) {
        var text = command.split(' ');
        var keyword = text[0].toLowerCase();
        console.log(keyword);
        var foundCommand = _.filter(commandList,function(value){
            return value == keyword;
        });

        return {isValid: angular.isDefined(foundCommand) }
    };

    vm.readCommand = function (event) {
        if (event.keyCode == 13) {
            vm.command = processCommand(vm.inputText);
        }
    };

}]);

//TODO: make an input processing service, that when it finds the right method, it tries to execute it, and passes back if it can't
