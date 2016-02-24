/**
 * Created by doug on 2/21/2016.
 */
angular.module("myApp").factory("itemService", ["_", "mapService", function (_, mapService) {
    "use strict";

    var inventory = {};
    var availableItems = {};
    var currentRoom;


    var loadRoom = function (array, room) {
        availableItems[room] =  availableItems[room] || {contents: {}};
        angular.forEach(array, function (item) {

            availableItems[room].contents[item.name] = item;

        });
        currentRoom = availableItems[room].contents
        return currentRoom;
    };

    var open = function (item) {
        var foundItem = inventory[item] || currentRoom[item];
        if (foundItem.container) {
            if (foundItem.container.isOpen == false) {
                foundItem.container.isOpen = true;
                console.log(foundItem.name + " opened.")
            }
            else {
                console.log(foundItem.name + " already opened");
            }
        }
        else if (foundItem.state == "closed") {
            foundItem.state = "opened";
            console.log(foundItem.name + " opened.")
        }
        else if (!foundItem.state == "locked" || !foundItem.state) {
            throw new Error("You can't open that.");
        }
        return {
            with: function (secondItem) {

                if (foundItem.state == "locked") {
                    var secondThing = currentRoom[secondItem] || inventory[secondItem]
                    if (secondThing.canUnlock == true) {
                        foundItem.state = "opened";
                        console.log(foundItem.name + " opened.")
                    }
                    else {
                        throw new Error("You can't open that.");
                    }
                }

            }
        }
    };

    var put = function (item) {
        var foundItem = currentRoom[item] || inventory[item];
        return {
            into: function (container) {
                var foundContainer = currentRoom[container] || inventory[container];
                if (foundContainer.container.contents && foundContainer.container.isOpen) {
                    foundContainer.container.contents[item] = foundItem;
                    console.log("You put the " + foundItem.name + " into " + foundContainer.name);
                    delete currentRoom[item];
                    delete inventory[item];
                }
                else {
                    console.log(foundContainer.name + " is not open. do you want to open it?");
                }
            }
        }
    };

    var take = function (item) {
        var foundItem = currentRoom[item];

        if (foundItem && foundItem.canCarry) {
            inventory[foundItem.name] = foundItem;
            delete currentRoom[foundItem.name];
            console.log(foundItem.name + " taken.");
        }


    };

    var drop = function (item) {
        var foundItem = inventory[item];

        if (foundItem) {
            currentRoom[foundItem.name] = foundItem;
            delete inventory[foundItem.name];
            console.log(foundItem.name + " dropped.");
        }


    };

    var read = function (item) {
        var results = currentRoom[item] || inventory[item];

        return results.text;
    };

    var look = function (item) {
        var lookAt = currentRoom[item] || inventory[item];
        var details;
        if (item && angular.isString(item)) {
            details = lookAt.details || {};
            console.log("You see a " + lookAt.name + ". " + details.description);
            if(lookAt.container){
                angular.forEach(lookAt.container.contents,function(content){
                    console.log(lookAt.name + " contains " + content.name);
                })
            }
        }
        else {
            angular.forEach(currentRoom, function (detail) {

                if (detail) {
                    console.log("You see a " + detail.name);

                }

            })
        }
        return details;
    }

    var getInventory = function () {
        return {
            count: function () {
                return Object.keys(inventory).length;
            },
            inventory: inventory
        };
    };

    var getAvailable = function () {
        return {
            count: function () {
                return Object.keys(availableItems).length;
            }
            ,
            items: availableItems
        };

    };

    return {
        getInventory: getInventory,
        getAvailable: getAvailable,
        loadRoom: loadRoom,
        open: open,
        put: put,
        read: read,
        take: take,
        drop: drop,
        look: look
    }
}])
;
