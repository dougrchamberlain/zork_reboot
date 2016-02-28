/**
 * Created by doug on 2/27/2016.
 */
angular.module("myApp").controller("inventoryController", ["inventoryService", function (inventoryService) {
    var vm = this;

    var contains = function (item) {
        return inventoryService.contains(item, vm.inventory);
    }

    vm.take = function (target) {
        if (target && target.item.canTake) {
            inventoryService.take(target, vm.inventory);
            console.log(target.name + " taken");
        }
        else if (!target){
            angular.forEach(vm.inventory.items,function(invItem){
                inventoryService.take(invItem.item, vm.inventory);
            });
        }
    }


    vm.inventory = {
        items: [],
        contains: contains
    };


}]);
