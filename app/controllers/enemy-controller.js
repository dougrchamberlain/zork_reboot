/**
 * Created by doug on 2/27/2016.
 */
angular.module("myApp").controller("enemyController", ["$controller", function ($controller) {
    var vm = this;

    vm = angular.extend(vm, $controller("healthController"));

    vm.attack = function(target,amount){
        if(target.health && !target.isDead()){
            target.takeDamage(amount);
        }
    };

    vm.isDead= function(){
        return vm.health.current <= 0;
    }

    return vm;
}]);
