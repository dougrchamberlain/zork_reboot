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
}]).controller("appController", ["$resource", "_","lookService", function ( $resource, _,lookService) {
    var vm = this;
    vm.inputText = "";
    var commandList = [{keyword: "look", delegate: lookService.lookAt }];

    var processCommand = function (command) {
        var text = command.split(' ');
        var keyword = text[0].toLowerCase();
        console.log(keyword);
        var foundCommand = _.filter(commandList,function(commandObject){
            return keyword === commandObject.keyword;
        })[0];

        console.log(foundCommand);
        var isValid =  angular.isDefined(foundCommand);

        angular.extend(foundCommand, {isValid: isValid});

        return foundCommand;
    };

    vm.readCommand = function (event) {
        if (event.keyCode == 13) {
            vm.command = processCommand(vm.inputText);
            if(vm.command.isValid){
                console.log(vm.command.delegate);
                vm.command.delegate.apply(null, []);
                //TODO: try and execute the command against the service, passing in the needed objects
            }
        }
    };

}]).factory("lookService", ["_","gameService", function(_, gameService){

    var lookAt = function(item){
        if(item && item.describe) {
            item.describe();
        }
        else{
            gameService.currentRoom().describe();
        }
    }

    return {
        lookAt: lookAt
    }
}]).factory("gameService", function(){
    var _currentRoom;

    var setRoom = function(room){
        _currentRoom = room;
    }
    var currentRoom = function(){
        return _currentRoom;
    };

    return {
        currentRoom: currentRoom,
        setRoom: setRoom
    }
});

//TODO: make an input processing service, that when it finds the right method, it tries to execute it, and passes back if it can't
