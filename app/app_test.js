describe('appController', function () {

    beforeEach(function () {
        module("ui.router");
        module("underscore");
        module('myApp');
    })

    var $rootScope, $scope, $controller, createController, _, mapService;

    beforeEach(inject(function (_$rootScope_, _$controller_, ___, _mapService_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $controller = _$controller_;
        _ = ___;
        mapService = _mapService_;


        createController = function () {
            return $controller("appController", {"$scope": $scope, "_": _ ,mapService: mapService})
        }
    }));



    describe("Move Commands", function () {



    });

    describe("Win Conditions",function(){


    })

});
