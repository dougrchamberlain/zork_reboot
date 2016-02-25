describe('appController', function () {
    var playerConfigObj;
    beforeEach(function () {


        module("ui.router");
        module("underscore");
        module("myApp");


    })

    var $rootScope, $scope, $controller, createController, _, mapService, player;

    beforeEach(inject(function (_$rootScope_, _$controller_, ___, _mapService_, _playerService_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $controller = _$controller_;
        _ = ___;
        mapService = _mapService_;
        player = _playerService_;


    }));


    describe("Move Commands", function () {
        it("Should create an instance of a player", function () {
            //var p = player;

            expect(player.greet()).toBe("hello");
        });

    });

    describe("Win Conditions", function () {


    });

})
;
