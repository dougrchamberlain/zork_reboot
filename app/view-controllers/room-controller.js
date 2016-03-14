/**
 * Created by dchamberlain on 3/14/2016.
 */
angular.module("viewControllers", ["ngResource"]).controller("roomsController", ["$resource", function ($resource) {
    var internalResource = $resource("/api/rooms/:_id", {id: "@id"});
    console.log("loaded rooms controller");

    var vm = this;

    vm.room = new internalResource();
    vm.room.name = "room sample";

    vm.rooms = internalResource.query();

    vm.add = function(){
        var room = new internalResource();
        room.name = vm.room.name;
        vm.room.$save();
        vm.rooms = internalResource.query();
    }

    vm.save = function(room){
        room.$save();
        vm.rooms = internalResource.query();
    }

    vm.delete = function(room){
        internalResource.delete(room);
        vm.rooms = internalResource.query();
    }
}]);