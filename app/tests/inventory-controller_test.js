describe("Player inventory: ", function () {
    "use strict";
    var $controller;

    beforeEach(function () {
        module("underscore");
        module("myApp");
    });

    beforeEach(inject(function (_$controller_) {
        $controller = _$controller_;
    }))
    it("should not take non-inventory items", function () {
        //TODO: create a base object to hand my controllers off of
        var monster = $controller("enemyController");
        var player = $controller("playerController");
        monster.health.max = 100;
        monster.health.current = 100;

        player.take(monster);
        expect(player.inventory.contains(monster)).toBe(false);
        expect(player.inventory.items.length).toBe(0);
    });

    it("should take item that can be taken", function () {
        //TODO: create a base object to hand my controllers off of
        var powerUp = $controller("powerUpController");
        var player = $controller("playerController");

        powerUp.name = "health";

        player.take(powerUp, player.inventory);
        expect(player.inventory.contains(powerUp)).toBe(true);
        expect(player.inventory.items.length).toBe(1);
    });
});
