/**
 * Created by doug on 2/27/2016.
 */
angular.module("myApp").controller("playerController", ["$controller","$rootScope","me", function ($controller,me) {
    var vm = this;
    vm.score = {
        current: 0
    };

    vm.me = me;

    //extend player with these controllers
    vm.healthController = $controller("healthController",{me: vm.me});
    vm = angular.extend(vm, $controller("inventoryController",{me: vm.me}));


    var dead = function () {
        vm.score.current += 100;
    };

    vm.attack = function (target, amount) {
        if (target.healthController.takeDamage) {
            target.healthController.takeDamage(amount);
            vm.score.current += 10;
            if (target.isDead && target.isDead()) {
                dead(target);
            }
        }
    };


    vm.move = function (direction) {

    };

    vm.isDead= function(){
        return vm.healthController.health.current <= 0;
    }
}]);
