/**
 * Created by doug on 2/27/2016.
 */
angular.module("myApp").controller("enemyController", ["$controller", function ($controller) {
    var vm = this;

    vm.healthController =  $controller("healthController");

    vm.attack = function(target,amount){
        if(target.healthController.health && !target.isDead()){
            target.healthController.takeDamage(amount);
        }
    };

    vm.isDead= function(){
        return vm.healthController.health.current <= 0;
    }

    return vm;
}]);
