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
}]).controller("appController", ["$resource", "_", "lookService", "gameService", "outputService", function ($resource, _, lookService, gameService, outputService) {
    var vm = this;
    vm.inputText = "";
    vm.outputText = outputService.out;

    var startingRoom = $resource("starting-room.json");

    startingRoom.get(function (room) {
        gameService.setRoom(room);

        _.forEach(room.exits, function(exit){
            gameService.createObject(exit);
        });
    });

    var commandList = [{
        keyword: "look", delegate: lookService.lookAt,
        params: {

            0: {args: []},

            1: {args: []}
        }
    }];


    var processCommand = function (command) {
        command = command.toLowerCase();

        var text = command.split(' ');
        var keyword = text.splice(0, 1)[0]; //get keyword
        var args = text;

        var foundCommand = _.filter(commandList, function (commandObject) {
            return keyword === commandObject.keyword;
        })[0];

        var isValid = angular.isDefined(foundCommand) && angular.isDefined(foundCommand.params[args.length]);

        _.forEach(args, function (arg) {
            foundCommand.args.push(arg);
        });


        angular.extend(foundCommand, {isValid: isValid});

        return foundCommand;
    };

    vm.readCommand = function (event) {
        if (event.keyCode == 13) {
            vm.command = processCommand(vm.inputText);
            if (vm.command.isValid) {
                outputService.writeOut("\n\r>> " + vm.command.keyword + "\n\r");
                vm.command.delegate.apply(null, vm.command.args);
                vm.scroll = 1;
                //TODO: try and execute the command against the service, passing in the needed objects
            }
        }
    };

}]).factory("lookService", ["_", "gameService", function (_, gameService) {

    var lookAt = function (item) {
        if (item && item.describe) {
            console.log("try to describe" + item);
            item.describe();
        }
        else {
            gameService.describe(gameService.currentRoom());
        }
    }

    return {
        lookAt: lookAt
    }
}]).factory("gameService", ["outputService", function (outputService) {
    var _currentRoom;

    var setRoom = function (room) {
        _currentRoom = room;
    }
    var currentRoom = function () {
         var createRoomDescription = function(){
            var newDescription  = "";
            var visibleExits = _.where(_currentRoom.exits, {discovered: true});

             newDescription = _currentRoom.description;

             _.forEach(visibleExits, function(exit){
                 var regex = new RegExp("\{\{" + exit.name + "\}\}","i");
                newDescription = newDescription.replace(regex,exit.description);
             });


             newDescription = newDescription.replace(/\{\{.+?\}\}/,"");
            return newDescription
        };

        _currentRoom.describe = createRoomDescription;

        return _currentRoom;
    };

    var describe = function (item) {
        //TODO: a whole bunch of logic to write out descriptions
        if(item.describe){
            outputService.writeOut(item.describe());
        }
            else{
            outputService.writeOut(item.description);
        }

    }

    return {
        currentRoom: currentRoom,
        setRoom: setRoom,
        describe: describe
    }
}]).factory("outputService", function () {
    var output = "";


    return {
        writeOut: function (text) {
            output = output + text + "\n\r";
        },
        out: function () {

            return output;
        }
    }

}).directive('showTail', function () {
    return {
        scope: {
            scroll: "="
        },
        link: function (scope, elem, attr) {
            scope.$watch(function () {
                    return scope.scroll;
                },
                function (e) {
                    scope.scroll = 0;
                    elem[0].scrollTop = elem[0].scrollHeight;
                });
        }
    }

});

//TODO: make an input processing service, that when it finds the right method, it tries to execute it, and passes back if it can't
