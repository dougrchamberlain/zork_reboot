/**
 * Created by doug on 2/27/2016.
 */
angular.module("myApp").factory("inventoryService", ["_", function (_) {
    return {
        contains: function (item, inventory) {
            return _.where(inventory, {name: item.name}).length > 0;
        },
        findByName: function (name, inventory) {
            return _.findWhere(inventory, {name: name});
        },
        take: function (item, inventory) {
            inventory.push(item);
        }
    }
}]);
