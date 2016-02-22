/**
 * Created by doug on 2/21/2016.
 */
angular.module("myApp").factory("itemService", ["_", "mapService", function (_, mapService) {
    "use strict";

    var inventory = [];

    var open = function (item) {
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

    var findByName = function (itemName, container) {
        var itemReference = _.findWhere(container, function (name) {
            return name == itemName || name.match(itemName);
        });
        return itemReference;
    };


    var transfer = function (fromContainer, toContainer, item) {
        var foundItem = findByName(item,fromContainer);
        if (foundItem) {
            toContainer.push(foundItem);
        }

        var index = _.findIndex(fromContainer, function (i) {
            return i.name == foundItem.name
        })
        if (index > -1) {
            fromContainer.splice(index, 1);
        }
        else {
            throw new Error("Item does not exist");
        }
        return foundItem;
    }

    return {
        getInventory: function () {
            return inventory;
        },
        open: open,
        transfer: transfer
    }
}]);
