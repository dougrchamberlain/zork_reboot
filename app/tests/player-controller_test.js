/**
 * Created by doug on 2/27/2016.
 */
describe("Player tests: ", function () {
    "use strict";
    var $controller, _;


    beforeEach(function () {
        module("underscore");
        module("myApp");
    });

    beforeEach(inject(function (_$controller_, ___) {
        $controller = _$controller_;
        _ = ___;
    }));

    it("should attack player if it's an enemy", function () {
        //TODO: create a base object to hand my controllers off of
        var monster = $controller("enemyController");
        var player = $controller("playerController");

        player.attack(monster, 10);
        expect(monster.health.current).toBeLessThan(100);
    });

    it("should score for killing monster", function () {
        //TODO: create a base object to hand my controllers off of
        var monster = $controller("enemyController");
        var player = $controller("playerController");

        monster.name = "Mock Monster";
        monster.health.max = 100;
        monster.health.current = 100;

        player.attack(monster, 100);
        expect(player.score.current).toBe(110);
    });


    it("should attack an enemy and get a score!", function () {
        var enemy = $controller("enemyController");
        var player = $controller("playerController");

        player.attack(enemy, 10);

        expect(enemy.health.current.toBe);
        expect(player.score.current).toBe(10);
    });

});
