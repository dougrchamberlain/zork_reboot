describe("Player inventory: ", function () {
    "use strict";
    var $controller;

    beforeEach(function () {
        module("underscore");
        module("myApp");
    });

    beforeEach(inject(function (_$controller_) {
        $controller = _$controller_;
    }));
    it("should not take non-inventory items", function () {
        //TODO: create a base object to hand my controllers off of
        var room = $controller("inventoryController");
        var monster = $controller("enemyController");
        var player = $controller("playerController");
        monster.healthController.health.max = 100;
        monster.healthController.health.current = 100;

        room.name = "Clock Room";
        room.add(monster);

        player.take(monster,room);
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

    it("should open a container that is not locked", function () {
        var vm = $controller("inventoryController");

        vm.open();

        expect(vm.getState()).toBe(0);
    });

    it("should lock a container that is not locked", function () {
        var vm = $controller("inventoryController");

        vm.close();
        vm.lock();

        expect(vm.getState()).toBe(2);
    });


    it("should not open a container that is locked", function () {
        var vm = $controller("inventoryController");

        vm.lock();
        vm.open();

        expect(vm.getState()).toBe(2);
    })

    it("should close a container that is open", function () {
        var vm = $controller("inventoryController");

        vm.open();
        vm.close();

        expect(vm.getState()).toBe(1);
    })

    it("should not close a container that is locked ", function () {
        var vm = $controller("inventoryController");

        vm.lock();
        vm.close();

        expect(vm.getState()).toBe(2);
    });


    it("should 3 items should vary in states", function () {

        var items = [{container: null}, {container: null}, {container: null}];

        items.forEach(function (item) {
            item.container = $controller("inventoryController");
        });

        items[0].container.open();

        items[1].container.close();

        items[2].container.lock();

        expect(items[0].container.getState()).toBe(0);
        expect(items[1].container.getState()).toBe(1);
        expect(items[2].container.getState()).toBe(2);
        expect(items[0].container.getState()).not.toBe(2);
    });

    it("should beat a locked container open ", function () {
        var vm = $controller("inventoryController");
        var player = $controller("playerController");

        vm.lock();

        player.attack(vm,51);

        vm.open();


        expect(vm.getState()).toBe(0);
    });


    it("should look at a container and list it's contents if it is opened", function () {
        var container = $controller("inventoryController");
        var letter = $controller("inventoryItemController");

        container.name = "desk";
        letter.name = "letter";
        container.take(letter);
        container.close();
        container.open();
        container.look();


        expect(container.inventory.items.length).toBe(1);
    });

    it("should look at a container if it isn't open", function () {
        var container = $controller("inventoryController");
        var letter = $controller("inventoryItemController");

        container.name = "desk";
        letter.name = "letter";
        container.take(letter);
        container.close();
        container.look();

        expect(container.inventory.items.length).toBe(1);
    });


    it("should take item from source and remove it from source", function () {
        var player = $controller("playerController");
        var jar = $controller("inventoryController");
        var beans = $controller("inventoryItemController");

        beans.name = "beans";

        jar.add(beans);
        player.take(beans,jar);


        expect(player.inventory.items.length).toBe(1);
        expect(jar.inventory.items.length).toBe(0);
    });

});
