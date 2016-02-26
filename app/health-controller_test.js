/**
 * Created by dchamberlain on 2/25/2016.
 */
describe("Health Controller Test", function () {

    var $controller, _, $rootScope, $scope;

    beforeEach(function () {
        module("myApp");
        module("underscore");
    });


    beforeEach(inject(function (___, _$controller_, _$rootScope_) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();

        $controller = _$controller_;

        _ = ___;

    }));


    it("should open a container that is not locked", function () {
        var vm = $controller("containerController");

        vm.open();

        expect(vm.getState()).toBe(0);
    });

    it("should lock a container that is not locked", function () {
        var vm = $controller("containerController");

        vm.close();
        vm.lock();

        expect(vm.getState()).toBe(2);
    });


    it("should not open a container that is locked", function () {
        var vm = $controller("containerController");

        vm.lock();
        vm.open();

        expect(vm.getState()).toBe(2);
    })

    it("should close a container that is open", function () {
        var vm = $controller("containerController");

        vm.open();
        vm.close();

        expect(vm.getState()).toBe(1);
    })

    it("should not close a container that is locked ", function () {
        var vm = $controller("containerController");

        vm.lock();
        vm.close();

        expect(vm.getState()).toBe(2);
    });


    it("should 3 items should vary in states", function () {

        var items = [{container: null}, {container: null}, {container: null}];

        items.forEach(function (item) {
            item.container = $controller("containerController");
        });

        items[0].container.open();

        items[1].container.close();

        items[2].container.lock();

        expect(items[0].container.getState()).toBe(0);
        expect(items[1].container.getState()).toBe(1);
        expect(items[2].container.getState()).toBe(2);
        expect(items[0].container.getState()).not.toBe(2);
    });


    it("should attack player if it's an enemy", function () {
        //TODO: create a base object to hand my controllers off of
        var monster = $controller("enemyController");
        var player = $controller("playerController");

        player.attack(monster, 10);
        console.log(monster.health.current);
        expect(monster.health.current).toBeLessThan(100);
    });


    it("should honor max health ", function () {
        //TODO: create a base object to hand my controllers off of
        var monster = $controller("enemyController");

        monster.health.max = 1000;

        expect(monster.health.max).toBe(1000);
    });

    it("should restore health using a power up", function () {
        //TODO: create a base object to hand my controllers off of
        var monster = $controller("enemyController");
        var powerup = $controller("powerUpController");
        monster.health.max = 1000;
        monster.health.current = 10;
        powerup.restore(monster, 10);

        expect(monster.health.current).toBe(20);
    });

    it("should restore health", function () {
        //TODO: create a base object to hand my controllers off of
        var monster = $controller("enemyController");
        monster.health.max = 1000;
        monster.health.current = 10;
        monster.restore(10);

        expect(monster.health.current).toBe(20);
    });

    it("should score for killing monster", function () {
        //TODO: create a base object to hand my controllers off of
        var monster = $controller("enemyController");
        var player = $controller("playerController");
        monster.health.max = 100;
        monster.health.current = 100;

        player.attack(monster, 100);
        expect(player.score.current).toBe(110);
    });


})
