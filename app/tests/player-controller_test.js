/**
 * Created by doug on 2/27/2016.
 */
describe("Player tests: ", function () {
    "use strict";
    var G, _;


    beforeEach(function () {
        module("underscore");
        module("myApp");
    });

    beforeEach(inject(function (_gameService_, ___) {
        G = _gameService_;
        _ = ___;
    }));

    it("should attack player if it's an enemy", function () {
        //TODO: create a base object to hand my controllers off of
        var monster = G.createGameObject("enemy","enemyController");
        var player =  G.createGameObject("player","playerController");

        player.attack(monster, 10);
        expect(monster.healthController.health.current).toBeLessThan(100);
    });

    it("should score for killing monster", function () {
        //TODO: create a base object to hand my controllers off of
        var monster = G.createGameObject("enemy","enemyController");
        var player = G.createGameObject("player","playerController");

        monster.healthController.health.max = 100;
        monster.healthController.health.current = 100;

        player.attack(monster, 100);
        expect(player.score.current).toBe(110);
    });


    it("should attack an enemy and get a score!", function () {
        var enemy = G.createGameObject("enemy","enemyController");
        var player =  G.createGameObject("player","playerController");

        player.attack(enemy, 10);

        expect(enemy.healthController.health.current.toBe);
        expect(player.score.current).toBe(10);
    });

});
