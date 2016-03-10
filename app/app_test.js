describe('appController', function () {
    beforeEach(function () {


        module("ui.router");
        module("underscore");
        module("myApp");


    });

    var $rootScope, $scope, $controller, G, createController, _, mapService;

    beforeEach(inject(function (_$rootScope_, _$controller_, ___, _mapService_,_gameService_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $controller = _$controller_;
        _ = ___;
        mapService = _mapService_;
        G = _gameService_;

        createController = function () {
            return $controller("appController",{$scope: $scope});
        }

    }));

    it("should create a new player instance", function () {
        var vm = createController();
        var player = vm.player;


        expect(player.name).toBe("Doug");
        expect(player.healthController.health.current).toBe(100);
    });

    it("should check players starting health and score", function () {
        var vm = createController();

        var player = vm.player;


        expect(player.healthController.health.current).toBe(100);
        expect(player.score.current).toBe(0);
    });




});
