describe('appController', function() {

    beforeEach(function(){
        module("ui.router");
        module("underscore");
        module('myApp');
    })

    var $rootScope, $scope,$controller,createController,_;

    beforeEach(inject(function(_$rootScope_,_$controller_,___){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $controller = _$controller_;
        _ = ___

        createController = function(){
            return $controller("appController",{"$scope": $scope })
        }
    }));

    describe("Item Commands",function(){

        it("should get/take single item that can be carried", function(){
            var vm = createController();
            vm.location.loot = [{name:"lamp",canCarry:true}];
            vm.player.inventory = [];
            $scope.$apply();

            vm.processCommand("take lamp");
            $scope.$apply();

            expect(vm.location.loot.length).toBe(0)
            expect(vm.player.inventory.length).toBe(1);
            expect(vm.status.pop()).toBe("lamp taken.");
        });

        it("should get/take all items that can be carried",function(){
           var vm = createController();
            vm.location.loot =
            [
                {name: "fake item 1",canCarry: true},{name: "fake item 2",canCarry: true},{name: "fake item 3",canCarry: true}
            ];

            vm.player.inventory = [];

            vm.processCommand("take all");

            expect(vm.player.inventory.length).toBe(3);
            expect(vm.location.loot.length).toBe(0);

        });

        it("should drop single item only if in inventory",function(){
            var vm = createController();
            vm.location.loot = [{name: "fixed object",canCarry:false}];

            vm.player.inventory = [{name: "item", canCarry: true}];

            vm.processCommand("drop item");
            $scope.$apply();

            expect(vm.status.pop()).toBe("item dropped.");
            expect(vm.player.inventory.length).toBe(0);
            expect(vm.location.loot.length).toBe(2);

        });

        it("should drop all items if in inventory",function(){
            var vm = createController();
            vm.location.loot = [{name: "fixed object",canCarry:false}];

            vm.player.inventory = [{name: "item", canCarry: true},{name: "item 2", canCarry: true}];


            vm.processCommand("drop all");
            $scope.$apply();

            expect(vm.status.pop()).toBe("item 2 dropped.");
            expect(vm.player.inventory.length).toBe(0);
            expect(vm.location.loot.length).toBe(3);

        });

        it("should open container",function(){
           var vm = createController();
            vm.location.loot = [{name: "jar", isOpen: false}]
            vm.processCommand("open jar");

            expect(vm.status.pop()).toBe("You open the jar.");
        });

        it("should report already opened container",function(){
            var vm = createController();
            vm.location.loot = [{type: "container", name: "jar", isOpen: true}]
            vm.processCommand("open jar");

            expect(vm.status.pop()).toBe("jar is already opened.");
        });

        it("should not allow a non-container to be opened",function(){
            var vm = createController();
            vm.location.loot = [{type: "loot", name: "item"}]
            vm.processCommand("open jar");

            expect(vm.status.pop()).toBe("You can't open that.");
        });

        it("should open exit for travel",function(){
          //todo: implement
        })


    });
});
