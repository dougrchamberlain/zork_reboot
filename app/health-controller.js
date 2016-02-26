/**
 * Created by dchamberlain on 2/25/2016.
 */
angular.module("myApp").controller("healthController", [function () {
    var vm = this;

    vm.health = {
        current: 100,
        max: 100
    }


    vm.takeDamage = function (a) {
        vm.health.current  = vm.health.current - a;

        if(vm.health.current <= 0){
            console.log("enemy is dead");
        }
    }

    vm.restore = function (a) {
        vm.health.current += a || 10;
    }

    vm.isDead = function () {
        return vm.health.current <= 0;
    }
}]).controller("containerController", ["$controller", function ($controller) {

    const OPEN = 0;
    const CLOSED = 1;
    const LOCKED = 2;

    var vm = this;

    vm.health = $controller("healthController");
    var currentState = OPEN;

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
        if (currentState == CLOSED) {
            currentState = OPEN;
        }

        return currentState == OPEN;

    }
}]).controller("enemyController",["$controller",function($controller){
    var vm = this;

    vm = angular.extend(vm,$controller("healthController"));


}])
    .controller("playerController",["$controller",function($controller){
        var vm = this;
        vm.score ={
            current: 0
        }
        vm = angular.extend(vm,$controller("healthController"));

        vm.attack = function(target, amount){
            if(target.takeDamage){
                target.takeDamage(amount);
                vm.score.current += 10;
                if(target.isDead()){
                    vm.score.current +=100;
                }
            }
        }

    }]).controller("powerUpController",function(){
        var vm = this;

        vm.restore = function(target,amount){
            if(target.restore){
                target.restore(amount);
            }
        }
});
