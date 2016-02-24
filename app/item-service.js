/**
 * Created by doug on 2/21/2016.
 */
angular.module("myApp").factory("itemService", ["_", "mapService", function (_, mapService) {
    "use strict";

    var inventory = {};
    var availableItems = {};


    var loadRoom = function (array) {
        angular.forEach(array, function (item) {
            availableItems[item.name] = item;
        })

        return availableItems;
    };

    var open = function (item) {
        var foundItem = inventory[item] || availableItems[item];
        if (foundItem.container) {
            if (foundItem.container.isOpen == false) {
                foundItem.container.isOpen = true;
                console.log(foundItem.name + " opened.")
            }
            else {
                console.log(foundItem.name + " already opened");
            }
        }
        else {
            throw new Error("You can't open that.");
        }
    };

    var put = function (item) {
        var foundItem = availableItems[item] || inventory[item];
        return {
            into: function (container) {
                var foundContainer = availableItems[container] || inventory[container];
                if (foundContainer.container.contents && foundContainer.container.isOpen) {
                    foundContainer.container.contents[item] = foundItem;
                    console.log("You put the " + foundItem.name + " into " + foundContainer.name);
                    delete availableItems[item];
                    delete inventory[item];
                }
                else{
                    console.log(foundContainer.name + " is not open. do you want to open it?");
                }
            }
        }
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
        var results = availableItems[item] || inventory[item];

        return results.text;
    };

    return {
        getInventory: function () {
            return {
                count: function () {
                    return Object.keys(inventory).length;
                },
                inventory: inventory
            };
        },
        getAvailable: function () {
            return {
                count: function () {
                    return Object.keys(availableItems).length;
                }
                ,
                items: availableItems
            };

        },
        loadRoom: loadRoom,
        open: open,
        put: put,
        read: read,
        take: take,
        drop: drop,
        look: function (item) {
            var lookAt = availableItems[item] || inventory[item];
            var details;
            if (item && angular.isString(item)) {
                details = lookAt.details || {};
                console.log("You see a " + lookAt.name + ". " + details.description);
            }
            else {
                angular.forEach(availableItems, function (detail) {

                    if (detail) {
                        console.log("You see a " + detail.name);

                    }

                })
            }
            return details;
        }
    }
}])
;
