/**
 * Created by doug on 2/27/2016.
 */
angular.module("myApp").controller("inventoryItemController", ["inventoryService", function (inventoryService) {
    var vm = this;

    vm.item = {
        canTake: true,
        inInventory: false
    }

}]);
