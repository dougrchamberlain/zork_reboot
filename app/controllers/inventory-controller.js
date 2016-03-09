/**
 * Created by doug on 2/27/2016.
 */
angular.module("myApp").controller("inventoryController", ["inventoryService", "$controller","$rootScope","me","gameService", function (inventoryService, $controller,$rootScope,me,gameService) {
    var vm = this;

    vm.me = me;

    vm.healthController = $controller("healthController");


    var contains = function (item) {
        return inventoryService.contains(item, vm.inventory);
    }

    vm.inventory = {
        items: [],
        contains: contains
    };

    const OPEN = 0;
    const CLOSED = 1;
    const LOCKED = 2;

    var currentState = OPEN;

    vm.add = function (item) {
        $rootScope.$broadcast("inventory.add",{item: vm.me});
        inventoryService.add(item, vm.inventory);
    };

    vm.take = function (target,source) {
        target = gameService.getGameObjects(target) ;
        source = gameService.getGameObjects(source);

        if (!target) {
            angular.forEach(vm.inventory.items, function (invItem) {
                inventoryService.take(invItem.item, vm.inventory);
            });
        }

        else if (source.inventory.contains(target) && target.item) {
            if (source) {
                var index = _.findIndex(source.inventory.items, function (i) {
                    return i.name == target.name;
                });
                source.inventory.items.splice(index, 1);
                inventoryService.take(target, vm.me.inventory);
                console.log(vm.me.name + " takes the "  + target.name);
            }

        }
        else if (!source.inventory.contains(target)){
            console.log("There isn't any " + target.name + " to take.");
        }

    }

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
