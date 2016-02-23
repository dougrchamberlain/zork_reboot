/**
 * Created by doug on 2/22/2016.
 */
angular.module("myApp").factory("gameService", ["itemService", "mapService", "_", function (itemService, mapService, _) {

    var defaultPlayer = {life: 100};

    return {
        createPlayer: function(name){
            defaultPlayer.name = name;
            return defaultPlayer;
        }

    }
}]);
