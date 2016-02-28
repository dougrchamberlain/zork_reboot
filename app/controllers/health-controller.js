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
        if (vm.health.current > 0) {
            vm.health.current -= a;
        }
    }

    vm.restore = function (a) {
        vm.health.current += a || 10;
    }



}]);
