/**
 * Created by doug on 2/27/2016.
 */
angular.module("myApp").controller("containerController", ["$controller", function ($controller) {

    const OPEN = 0;
    const CLOSED = 1;
    const LOCKED = 2;

    var vm = this;

    vm = angular.extend(vm,$controller("healthController"));
    vm = angular.extend(vm, $controller("inventoryController"));
    var currentState = OPEN;

    vm.getState = function () {
        return currentState;
    }

    vm.close = function () {
        if (currentState !== CLOSED && currentState != LOCKED) {
            currentState = CLOSED;
        }
        return currentState == CLOSED;
    };

    vm.lock = function () {
        if (currentState !== LOCKED) {
            currentState = LOCKED;
        }
        return currentState == LOCKED;
    }

    vm.unlock = function () {
        if (currentState !== OPEN && currentState != CLOSED) {
            currentState = LOCKED - 1;
        }
        return currentState == CLOSED;
    }


    vm.open = function () {
        if (currentState == CLOSED || (vm.health.current < 50)) {
            currentState = OPEN;
        }

        return currentState == OPEN;

    }
}]);
