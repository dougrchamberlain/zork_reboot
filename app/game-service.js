/**
 * Created by dchamberlain on 3/8/2016.
 */
angular.module("myApp").factory("gameService", ["$controller", "_", "$rootScope", function ($controller, _, $rootScope) {

    var gameObjects = [];


    $rootScope.$on("gameObject.created", function(event,data){
        console.log(data.gameObject.name + " created.");
    });

    $rootScope.$on("gameObject.destroyed", function(event,data){
        console.log(data.gameObject.name + " destoryed.");
    });

    var removeItem = function (item, arr) {
        var index = _.findIndex(arr, function (i) {
            return i.name == item.name
        });
        if (index > -1) {
            arr.splice(index, 1);
        }
    };


    var findItemByName = function(item,arr){
        var index = -1;
        if(angular.isString(item)) {
            index = _.findIndex(arr, function (i) {
                return i.name.toLowerCase() == item.toLowerCase();
            });

        }
        else
        {
            index = _.findIndex(arr, function (i) {
                return i.name.toLowerCase() == item.name.toLowerCase();
            });
        }
        return index > -1 ? arr[index] : null;
    };

    var getGameObjects = function(name){
        name = name || "";
        return findItemByName(name,gameObjects);

    };
    var createGameObject = function (name,controllers) {
        var me = {};
        me.name = name;
        if(angular.isString(controllers)){
            me.controllers = [controllers];
        }
        else{
            me.controllers = controllers;
        }

        angular.forEach(me.controllers,function(controller){
            angular.extend(me,$controller(controller,{me: me, $scope: $rootScope.$new()}));
        });

        if(findItemByName(me,gameObjects) != null ){
            me = undefined;
            throw new Error("Cannot add duplicate game object");
        }


        me.destroy = function () {
            removeItem(me, gameObjects);
            $rootScope.$broadcast("gameObject.destroyed", {gameObject: me});
        };


        gameObjects.push(me);
        $rootScope.$broadcast("gameObject.created", {gameObject: me});


        return me;
    };

    return {
        createGameObject: createGameObject,
        getGameObjects: getGameObjects
    }
}]);
