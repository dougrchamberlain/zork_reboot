/**
 * Created by doug on 2/27/2016.
 */
angular.module("myApp").controller("powerUpController", ["$controller",
    function ($controller) {
        var vm = this;
        vm = angular.extend(vm, $controller("inventoryItemController"));

        vm.restore = function (target, amount) {
            if (target.restore) {
                target.restore(amount);
            }
        }

    }
]);
