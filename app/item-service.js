/**
 * Created by doug on 2/21/2016.
 */
angular.module("myApp").factory("itemService", ["_", "mapService", function (_, mapService) {
    "use strict";

    var inventory = [];

    var open = function (item) {
        var foundItem =  findItemByName(item);
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
            var result =  (item.name == itemName ) || item.name.match(itemName);
            return result;
        });
        return itemReference;
    };


    var transfer = function (fromContainer, toContainer, item) {
        var foundItem = findItemByName(item,fromContainer);
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
    }

    return {
        getInventory: function () {
            return inventory;
        },
        open: open,
        take: function(fromContainer,toContainer,item){
            var foundItem;
            if(angular.isString(item)){
                foundItem = findItemByName(item,fromContainer);
                if(foundItem.canCarry){
                    transfer(fromContainer,toContainer,foundItem.name);
                }

            }
        },
        transfer: transfer,
        findItemByName: findItemByName,
        look: function(item,container){
            var foundItem;
            if(angular.isString(item)){
                foundItem = findItemByName(item,container);
            }


            return foundItem.details;
        }
    }
}]);
