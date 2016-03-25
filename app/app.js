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
}]).controller("appController", ["$resource", "_","lookService","gameService","outputService", function ( $resource, _,lookService,gameService,outputService) {
    var vm = this;
    vm.inputText = "";
    vm.outputText = outputService.out;

    var startingRoom = $resource("starting-room.json");

    startingRoom.get( function(payload){
        console.log(payload);
        gameService.setRoom(payload);
    });

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
                outputService.writeOut("\n\r>> " + vm.command.keyword + "\n\r");
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
           gameService.describe(gameService.currentRoom());
        }
    }

    return {
        lookAt: lookAt
    }
}]).factory("gameService", ["outputService", function(outputService){
    var _currentRoom;

    var setRoom = function(room){
        _currentRoom = room;
    }
    var currentRoom = function(){
        return _currentRoom;
    };

    var describe = function(item){
        //TODO: a whole bunch of logic to write out descriptions
        console.log(item.description);
        outputService.writeOut(item.description);
    }

    return {
        currentRoom: currentRoom,
        setRoom: setRoom,
        describe: describe
    }
}]).factory("outputService", function(){
        var output = "";


        return {
            writeOut: function(text){
                output = output + text + "\n\r";
            },
            out: function(){
                console.log(output);
                return output;
            }
        }

});

//TODO: make an input processing service, that when it finds the right method, it tries to execute it, and passes back if it can't
