/**
 * Created by doug on 2/27/2016.
 */
describe("Enemy tests: ",function() {
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

    it("Should attack player", function(){
        var enemy = $controller("enemyController");
        var player = $controller("playerController");

        enemy.attack(player,10);

        expect(player.healthController.health.current).toBe(90);
    });


    it("Should do nothing to player", function(){
        var enemy = $controller("enemyController");
        var player = $controller("playerController");

        enemy.attack(player,0);

        expect(player.healthController.health.current).toBe(100);
    });


    it("Should kill player", function(){
        var enemy = $controller("enemyController");
        var player = $controller("playerController");

        player.name = "mock player";
        enemy.attack(player,100);

        expect(player.isDead()).toBe(true);
    })

});
