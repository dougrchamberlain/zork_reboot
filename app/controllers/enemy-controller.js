/**
 * Created by doug on 2/27/2016.
 */
angular.module("myApp").controller("enemyController", ["$controller","me", function ($controller,me) {
    var vm = this;
    vm.me = me;
    vm.healthController = $controller("healthController",{me : vm.me});

    vm.attack = function (target, amount) {
        if (target.healthController.health && !target.isDead()) {
            target.healthController.takeDamage(amount);
        }
    };

    vm.isDead = function () {
        return vm.healthController.health.current <= 0;
    };

}]).factory("gameService", ["$controller", "_", "$rootScope", function ($controller, _, $rootScope) {

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
        var index = _.findIndex(arr, function (i) {
            return i.name == item.name;
        });

        return index > -1
    }


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
            angular.extend(me,$controller(controller,{me: me}));
        });

        if(findItemByName(me,gameObjects)){
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
        createGameObject: createGameObject
    }
}]);
