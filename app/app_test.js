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

    it("should create a desk with a drawer", function () {
        var vm = createController();


        expect(vm.desk.inventory.items.length).toBe(1);

    });


    it("should create a couch with change in it", function () {
        var vm = createController();

        var couch = vm.couch;

        expect(couch.inventory.items.length).toBe(1);
    });


    it("should create a vending machine with snacks in it", function () {
        var vm = createController();

        var vendingMachine = vm.vendingMachine;

        expect(vendingMachine.inventory.items.length).toBe(4);
    });



});
