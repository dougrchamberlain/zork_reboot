/**
 * Created by doug on 2/27/2016.
 */
angular.module("myApp").factory("inventoryService", ["_","gameService", function (_,gameService) {
    return {
        contains: function (item, inventory) {
            return _.where(inventory.items, {name: item.name}).length > 0;
        },
        findByName: function (name, inventory) {
            return _.findWhere(inventory.items, {name: name});
        },
        take: function (item, inventory) {
            inventory.items.push(item);
        },
        add: function(item,inventory){
            inventory.items.push(item);
        }
    }
}]);
