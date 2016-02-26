/**
 * Created by dchamberlain on 2/25/2016.
 */
describe("Health Controller Test", function () {

    var $controller, _, $rootScope,$scope;

    beforeEach(function () {
        module("myApp")
        module("underscore")
    });


    beforeEach(inject(function (___, _$controller_, _$rootScope_) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();

        $controller = _$controller_;

        _ = ___;

    }));

    it("should affect health if hit",function(){
        var controller = $controller("healthController");

        controller.takeHit(10);

        expect(controller.getHealth()).toBe(90);
    })


    it("should affect health if hit and it's not a singleton",function(){
        var controller = $controller("healthController");
        var controller2 = $controller("healthController");

        controller.takeHit(10);
        controller2.takeHit(15);


        expect(controller.getHealth()).toBe(90);
        expect(controller2.getHealth()).toBe(85);
    });


    it("should open a container that is not locked",function(){
        var vm = $controller("containerController");

        vm.open();

        expect(vm.getState()).toBe(0);
    });

    it("should lock a container that is not locked",function(){
        var vm = $controller("containerController");

        vm.close();
        vm.lock();

        expect(vm.getState()).toBe(2);
    });



    it("should not open a container that is locked",function(){
        var vm = $controller("containerController");

        vm.lock();
        vm.open();

        expect(vm.getState()).toBe(2);
    })

    it("should close a container that is open",function(){
        var vm = $controller("containerController");

        vm.open();
        vm.close();

        expect(vm.getState()).toBe(1);
    })

    it("should not close a container that is locked ",function(){
        var vm = $controller("containerController");

        vm.lock();
        vm.close();

        expect(vm.getState()).toBe(2);
    });


    it("should 3 items should vary in states",function() {

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


    it("should beat a container open",function() {

        var item = $controller("containerController");

        item.lock();

        item.health.takeHit(51);

        var isOpen = item.open();

        expect(isOpen).toBe(true);
    });

    it("should beat a container open but with the damageService",inject(function(damageService) {

        //TODO: create a base object to hand my controllers off of
        var item = angular.extend({name: "jar"},$controller("containerController"));

        item.lock();

        damageService.attackByAmount(item, 51);

        var isOpen = item.open();

        expect(isOpen).toBe(true);
    }));


    it("should beat a container open but with the damageService",inject(function(damageService) {

        //TODO: create a base object to hand my controllers off of
        var item = angular.extend({name: "jar"},$controller("containerController"));

        item.lock();

        damageService.attackByAmount(item, 51);

        var isOpen = item.open();

        expect(isOpen).toBe(true);
    }));


    it("should attack if it's an enemy",inject(function(damageService) {

        //TODO: create a base object to hand my controllers off of
        var item = angular.extend({name: "jar"},$controller("enemyController"));

        item.lock();

        damageService.attackByAmount(item, 51);

        var isOpen = item.open();

        expect(isOpen).toBe(true);
    }));




})
