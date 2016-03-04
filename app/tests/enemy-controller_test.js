/**
 * Created by doug on 2/27/2016.
 */
describe("Enemy tests: ", function () {
    "use strict";
    var $controller, _,G;


    beforeEach(function () {
        module("underscore");
        module("myApp");
    });

    beforeEach(inject(function (_$controller_, ___,_gameService_) {
        $controller = _$controller_;
        _ = ___;
        G = _gameService_;
    }));

    it("Should attack player", function () {
        var enemy = G.createGameObject("enemy",["enemyController"]) ;
        var player = G.createGameObject("player",["playerController"]) ;

        enemy.attack(player, 10);

        expect(player.healthController.health.current).toBe(90);
    });


    it("Should do nothing to player", function () {
        var enemy = G.createGameObject("enemy",["enemyController"]) ;
        var player = G.createGameObject("player",["playerController"]) ;

        enemy.attack(player, 0);

        expect(player.healthController.health.current).toBe(100);
    });


    it("Should kill player", function () {
        var enemy = G.createGameObject("enemy",["enemyController"]) ;
        var player = G.createGameObject("player",["playerController"]) ;

        enemy.attack(player, 100);

        expect(player.isDead()).toBe(true);
    });

    it("should create a game object", inject(function (gameService,$rootScope) {


        var gameObject = G.createGameObject("enemy");


        expect(gameObject.name).toBe("enemy");
    }));

    it("should destroy a game object", inject(function (gameService,$rootScope) {

        var gameObject = G.createGameObject("enemy").destroy();


        expect(gameObject).toBeUndefined();
    }));


    it("should not add duplicate objects", inject(function (gameService,$rootScope) {
        G.createGameObject("enemy");


        expect(function(){
            gameService.createGameObject("enemy")
        }).toThrow(new Error("Cannot add duplicate game object"));
    }));


    it("should create a player object", inject(function (gameService,$rootScope) {
        var player = G.createGameObject("player",["playerController"]);

        player.healthController.takeDamage(99);
        expect(player.name).toBe("player");
        expect(player.isDead()).toBe(false);
    }));


    it("should attack  a player", inject(function () {
        var enemy = G.createGameObject("enemy",["enemyController"]) ;
        var player = G.createGameObject("player",["playerController"]) ;

        enemy.attack(player, 1);

        expect(player.healthController.health.current).toBe(99);
    }));

});
