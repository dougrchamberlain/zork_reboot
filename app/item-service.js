/**
 * Created by doug on 2/21/2016.
 */
angular.module("myApp").factory("itemService", ["_","mapService", function (_,mapService) {
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

    return {
        getInventory: function () {
            return inventory;
        },
        open: open,
        drop: function (items) {
            if (angular.isArray(items)) {
                console.log(items)
                angular.forEach(items, function (item) {
                    console.log("dropping");
                    mapService.currentLocation().addLoot(item);

                })
                inventory = _.reject(inventory, function (item) {
                    return _.contains(_.pluck(items, "name"), item.name);
                });

            }
        },
        take: function (items) {
            if (angular.isArray(items)) {
                _.forEach(items, function (item) {
                    if (item.canCarry) {
                        inventory.push(item);
                    }
                })
            }
            else {
                inventory.push(items);
            }
        }
    }
}]);
