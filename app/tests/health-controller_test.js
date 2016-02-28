/**
 * Created by dchamberlain on 2/25/2016.
 */
describe("Health Controller Test", function () {
"use strict";
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

});
