/**
 * Created by doug on 2/21/2016.
 */
angular.module("myApp").factory("itemService", ["_", "mapService", function (_, mapService) {
    "use strict";

    var inventory = {};
    var availableItems = {};


    var loadRoom = function(array){
        angular.forEach(array, function(item){
            availableItems[item.name] = item;
        })

        return availableItems;
    };

    var open = function (item) {
        var foundItem = findItemByName(item);
        if (item.container) {
            if (item.container.isOpen == false) {
                item.container.isOpen = true;
            }
            else {
                throw new Error(item.name + " already opened");
            }
        }
        else {
            throw new Error("You can't open that.");
        }
    };

    var findItemByName = function (itemName, container) {
        var itemReference = _.find(container, function (item) {
            var result = (item.name == itemName ) || item.name.match(itemName);
            return result;
        });
        return itemReference;
    };


    var getItemNames = function (items) {
        var result
        if
        (!angular.isArray(items)) {
            result = [{name: items}];
        }
        else {
            result = items;
        }
        return result;
    };
    var put = function () {

    };

    var take = function (item) {
        var foundItem = availableItems[item];

        if (foundItem && foundItem.canCarry) {
            inventory[foundItem.name] = foundItem;
            delete availableItems[foundItem.name];
            console.log(foundItem.name + " taken.");
        }



    };

    var drop = function (item) {
        var foundItem = inventory[item];

        if (foundItem) {
            availableItems[foundItem.name] = foundItem;
            delete inventory[foundItem.name];
            console.log(foundItem.name + " dropped.");
        }



    };

    var read = function (item) {
        var results = findItemByName(item, inventory).details;

        return results.text;
    };

    return {
        getInventory: function () {
            return inventory;
        },
        getAvailable: function(){
            return availableItems;
        },
        loadRoom: loadRoom,
        open: open,
        put: put,
        read: read,
        take: take,
        drop: drop,
        findItemByName: findItemByName,
        look: function (item, container) {
            var foundItem;
            if (angular.isString(item)) {
                foundItem = findItemByName(item, container);
            }


            return foundItem.details;
        }
    }
}]);
