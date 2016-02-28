/**
 * Created by doug on 2/27/2016.
 */
angular.module("myApp").controller("inventoryController", ["inventoryService", function (inventoryService) {
    var vm = this;

    var contains = function (item) {
        return inventoryService.contains(item, vm.inventory.items);
    }

    vm.take = function (target) {
        if (target.item && target.item.canTake) {
            inventoryService.take(target, vm.inventory.items);
            console.log(target.name + " taken");
        }
    }


    vm.inventory = {
        items: [],
        contains: contains
    };


}]);
