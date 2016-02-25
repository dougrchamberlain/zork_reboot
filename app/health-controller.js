/**
 * Created by dchamberlain on 2/25/2016.
 */
angular.module("myApp").controller("healthController", [function () {
    var vm = this;

    var amount = 100;

    vm.getHealth = function () {
        return amount;
    }

    vm.takeHit = function (a) {
        amount -= a || 10;
    }

    vm.restore = function (a) {
        amount += a || 10;
    }

    vm.isDead = function () {
        return amount < 1;
    }
}]).controller("containerController", ["$controller",function ($controller) {

    const OPEN = 0;
    const CLOSED = 1;
    const LOCKED = 2;

    var vm = this;

    var currentState = OPEN;

    vm.health = $controller("healthController");

    vm.getState = function(){
        return currentState;
    }

    vm.close = function(){
        if(currentState !== CLOSED && currentState != LOCKED ) {
            currentState = CLOSED;
        }
        return currentState == CLOSED;
    };

    vm.lock = function(){
        if(currentState !== LOCKED ) {
            currentState = LOCKED;
        }
        return currentState == LOCKED;
    }

    vm.unlock = function(){
        if(currentState !== OPEN && currentState != CLOSED ) {
            currentState = LOCKED - 1;
        }

        return currentState == CLOSED;
    }


    vm.open = function () {
        if (currentState == CLOSED  || ( currentState == LOCKED && vm.health.getHealth() <= 50 )) {
            currentState = OPEN;
        }

        return currentState == OPEN;

    }
}]).factory("damageService",function(){
    return {
        attackByAmount : function(item, amount){
            item.health.takeHit(amount);
            console.log("dealing " + amount + " damage to " + item);
            console.log(item.name + " now has " + item.health.getHealth());
            return this;
        }
    }

});
