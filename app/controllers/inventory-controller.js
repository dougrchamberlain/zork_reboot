/**
 * Created by doug on 2/27/2016.
 */
angular.module("myApp").controller("inventoryController", ["inventoryService", "$controller", "$rootScope", "me", "gameService", function (inventoryService, $controller, $rootScope, me, gameService) {
    var vm = this;

    vm.me = me;

    vm.healthController = $controller("healthController");


    var contains = function (item) {
        item = gameService.getGameObjects(item) || item;

        var results = _.where(vm.me.inventory.items, function (i) {
            var match = item.name.toLowerCase() == i.name.toLowerCase();
            return match;
        });

        return results.length > 0;
    };

    vm.inventory = {
        items: [],
        contains: contains
    };

    const OPEN = 0;
    const CLOSED = 1;
    const LOCKED = 2;

    var currentState = OPEN;

    vm.add = function (item) {
        $rootScope.$broadcast("inventory.add", {item: item});
        vm.me.inventory.items.push(item);
    };

    vm.remove = function (item) {
        $rootScope.$broadcast("inventory.remove", {item: item});
        var index = _.findIndex(vm.me.inventory.items, function (i) {
            return i.name.toLowerCase() == item.name.toLowerCase();
        });
        vm.me.inventory.items.splice(index, 1);

    };

    vm.getState = function () {
        return currentState;
    }

    vm.close = function () {
        if (currentState !== CLOSED && currentState != LOCKED) {
            currentState = CLOSED;
            console.log(vm.name + " is now closed");
        }
        return currentState == CLOSED;
    };

    vm.lock = function () {
        if (currentState !== LOCKED) {
            currentState = LOCKED;
            console.log(vm.name + " is now locked");
        }
        return currentState == LOCKED;
    };

    vm.unlock = function () {
        if (currentState !== OPEN && currentState != CLOSED) {
            currentState = LOCKED - 1;
            console.log(vm.name + " is now unlocked");
        }
        return currentState == CLOSED;
    };


    vm.open = function () {
        if (currentState == CLOSED || (vm.healthController.health.current < 50)) {
            currentState = OPEN;
            console.log(vm.name + " is now open");
        }

        return currentState == OPEN;

    }


}]);
