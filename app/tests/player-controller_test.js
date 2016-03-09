/**
 * Created by doug on 2/27/2016.
 */
describe("Player tests: ", function () {
    "use strict";
    var G, _,$rootScope,$scope;


    beforeEach(function () {
        module("underscore");
        module("myApp");
    });

    beforeEach(inject(function (_gameService_, ___,_$rootScope_) {
        G = _gameService_;
        _ = ___;
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
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

    it("should call take using a string", function () {
        var player =  G.createGameObject("player","playerController");
        var key =  G.createGameObject("key","inventoryItemController");
        var room = G.createGameObject("room",["roomController","inventoryController"]);

        player.currentRoom = room;

        room.add(key);

        player["take"]("key");



        expect(player.inventory.items.length).toBe(1);
    });

    it("should call use using a string and open the door", function () {
        $rootScope.$on("item.action",function(event,data){
           console.log(data.item.name  + " used on " + data.target.name);
        });
        var player =  G.createGameObject("player","playerController");
        var key =  G.createGameObject("key","inventoryItemController");
        var door = G.createGameObject("door","doorController");



        player.add(key);
        door.opensWith(key);
        player["use"]("key","door");

        expect(G.getGameObjects("door").getState()).toBe("open");
    });


    it("should call use on a bell and it should ring", function () {
        var player =  G.createGameObject("player","playerController");
        var bell =  G.createGameObject("bell","bellController");

        player["use"]("bell");

        expect(bell.ringCount()).toBe(1);
    });



    it("should call move and move to another room", function () {
        var player =  G.createGameObject("player","playerController");
        var room1 =  G.createGameObject("room1",["roomController","inventoryController"]);
        var room2 =  G.createGameObject("room2",["roomController","inventoryController"]);

        room1.setExits("north",room2);

        player.currentRoom = room1;

        player["move"]("north");

        expect(player.currentRoom).toBe(room2);
    });



    it("should drop item into currentRoom", function () {
        var player =  G.createGameObject("player","playerController");
        var room1 =  G.createGameObject("room1",["roomController","inventoryController"]);
        var sword = G.createGameObject("sword","inventoryItemController");

        player.currentRoom = room1;

        room1.add(sword);
        player["take"]("sword","room1");
        player["drop"]("sword");

        expect(player.currentRoom.inventory.items.length).toBe(1);
    });


    it("Should be the e2e test",function(){
        var player =  G.createGameObject("player","playerController");
        var room1 =  G.createGameObject("start room",["roomController","inventoryController"]);
        var room2 =  G.createGameObject("bell room",["roomController","inventoryController"]);
        var key = G.createGameObject("key","inventoryItemController");
        var bell = G.createGameObject("bell","bellController");
        var door = G.createGameObject("door","doorController");

        player.currentRoom = room1;
        room1.setExits("north",room2);
        room1.add(key);
        room2.add(bell);
        player.take("key","start room");
        player.move("north");
        player.use("bell");
    });

    it("should not take a thing that isn't in the room", function(){

        var player =  G.createGameObject("player","playerController");
        var room1 =  G.createGameObject("start room",["roomController","inventoryController"]);
        var room2 =  G.createGameObject("bell room",["roomController","inventoryController"]);
        var bell = G.createGameObject("bell",["bellController", "inventoryItemController"]);

        player.currentRoom = room1;
        room1.setExits("north",room2);
        room2.add(bell);
        //player.move("north");
        player.take("bell");
        expect(player.inventory.contains("bell")).toBe(false);


    });

    it("should  take a thing that is in the room", function(){

        var player =  G.createGameObject("player","playerController");
        var room1 =  G.createGameObject("start room",["roomController","inventoryController"]);
        var room2 =  G.createGameObject("bell room",["roomController","inventoryController"]);
        var bell = G.createGameObject("bell",["bellController", "inventoryItemController"]);

        player.currentRoom = room1;
        room1.setExits("north",room2);
        room2.add(bell);
        player.move("north");
        player.take("bell","bell room");
        expect(player.inventory.items.length).toBe(1);


    });

    it("should ring bell and add 100 to score", function(){

        var player =  G.createGameObject("player","playerController");
        var bell = G.createGameObject("bell",["bellController", "inventoryItemController"]);

        player.add("bell");
        player.use("bell");
        expect(player.score.current).toBe(100);


    });

    it("should not take a thing that can't be taken", function(){

    });


});
