/**
 * Created by doug on 2/27/2016.
 */
describe("Player tests: ",function() {
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

    it("should beat a locked container open ", function () {
        var vm = $controller("containerController");
        var player = $controller("playerController");

        vm.lock();

        player.attack(vm,51);

        vm.open();


        expect(vm.getState()).toBe(0);
    });


    it("should look at a container and list it's contents if it is opened", function () {
        var container = $controller("containerController");
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
        var container = $controller("containerController");
        var letter = $controller("inventoryItemController");

        container.name = "desk";
        letter.name = "letter";
        container.take(letter);
        container.close();
        container.look();

        expect(container.inventory.items.length).toBe(1);
    });

});
