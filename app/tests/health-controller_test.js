/**
 * Created by dchamberlain on 2/25/2016.
 */
describe("Health Controller Test", function () {
"use strict";
    var G, _, $rootScope, $scope;

    beforeEach(function () {
        module("myApp");
        module("underscore");
    });


    beforeEach(inject(function (___, _gameService_, _$rootScope_) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();

        G = _gameService_;

        _ = ___;

    }));


    it("should honor max health ", function () {
        //TODO: create a base object to hand my controllers off of
        var monster = G.createGameObject("enemy","enemyController");

        monster.healthController.health.max = 1000;

        expect(monster.healthController.health.max).toBe(1000);
    });

    it("should restore health using a power up", function () {
        //TODO: create a base object to hand my controllers off of
        var monster = G.createGameObject("enemy","enemyController");
        var powerup = G.createGameObject("powerUp","powerUpController");
        monster.healthController.health.max = 1000;
        monster.healthController.health.current = 10;
        powerup.restore(monster, 10);

        expect(monster.healthController.health.current).toBe(20);
    });

    it("should restore health", function () {
        //TODO: create a base object to hand my controllers off of
        var monster = G.createGameObject("enemy","enemyController");
        monster.healthController.health.max = 1000;
        monster.healthController.health.current = 10;
        monster.healthController.restore(10);

        expect(monster.healthController.health.current).toBe(20);
    });

});
