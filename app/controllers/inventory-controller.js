/**
 * Created by doug on 2/27/2016.
 */
angular.module("myApp").controller("inventoryController", ["inventoryService", "$controller","$rootScope", function (inventoryService, $controller,$rootScope) {
    var vm = this;


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

    var vm = this;


    var currentState = OPEN;

    vm.add = function (item) {
        $rootScope.$broadcast("inventory.add",{item: item});
        inventoryService.add(item, vm.inventory);
    };


    vm.take = function (target, source) {
        if (target && target.item.canTake) {
            if (source) {
                var index = _.findIndex(source.inventory.items, function (i) {
                    return i.name == target.name
                });
                source.inventory.items.splice(index, 1);
            }
            inventoryService.take(target, vm.inventory);
            console.log(target.name + " taken");
        }
        else if (!target){
            angular.forEach(vm.inventory.items,function(invItem){
                inventoryService.take(invItem.item, vm.inventory);
            });
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
    }

    vm.unlock = function () {
        if (currentState !== OPEN && currentState != CLOSED) {
            currentState = LOCKED - 1;
            console.log(vm.name + " is now unlocked");
        }
        return currentState == CLOSED;
    }


    vm.open = function () {
        if (currentState == CLOSED || (vm.healthController.health.current < 50)) {
            currentState = OPEN;
            console.log(vm.name + " is now open");
        }

        return currentState == OPEN;

    }

    vm.look = function () {

        if (currentState == OPEN) {
            console.log("You look in the " + vm.name);
            listContents();
        }
    }

    var listContents = function () {
        angular.forEach(vm.inventory.items, function (item) {
            console.log(vm.name + " contains : " + item.name);
        })
    }


}]);
