/**
 * Created by doug on 2/27/2016.
 */
angular.module("myApp").controller("enemyController", ["$controller","me", function ($controller,me) {
    var vm = this;
    vm.me = me;
    vm.healthController = $controller("healthController",{me : vm.me});

    vm.attack = function (target, amount) {
        if (target.healthController.health && !target.isDead()) {
            target.healthController.takeDamage(amount);
        }
    };

    vm.isDead = function () {
        return vm.healthController.health.current <= 0;
    };

}]);