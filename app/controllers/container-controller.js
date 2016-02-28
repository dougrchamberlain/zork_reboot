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
        if (currentState == CLOSED || (vm.health.current < 50)) {
            currentState = OPEN;
            console.log(vm.name + " is now open");
        }

        return currentState == OPEN;

    }

    vm.look = function (){

        if (currentState == OPEN ){
            console.log("You look in the " + vm.name);
            listContents();
        }
    }

    var listContents = function(){
        angular.forEach(vm.inventory.items,function(item){
            console.log(vm.name + " contains : " + item.name);
        })
    }

}]);
