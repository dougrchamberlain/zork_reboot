/**
 * Created by doug on 2/21/2016.
 */
describe("Item Service", function () {

    var _, itemService;

    beforeEach(
        function () {
            module("underscore");
            module("myApp");
        }
    )
    beforeEach(inject(function (___, _itemService_) {
        itemService = _itemService_;
        _ = ___;
    }))

    describe("Item Commands", function () {


        it("should drop single item only if in inventory", function () {
            var someContainer = [{name: "mock item", canCarry: true}, {name: "item 2", canCarry: false}];

            itemService.transfer(someContainer, itemService.getInventory(), "mock item");

            expect(itemService.getInventory().length).toBe(1);

        });

        it("should fail to drop item not in  inventory", function () {
            var someContainer = [{name: "mock item", canCarry: true}, {name: "item 2", canCarry: false}];

            itemService.transfer(someContainer, itemService.getInventory(), "mock item 2")
            expect(itemService.transfer).toThrow(new Error("Item does not exist"));
        });

        it("should be able to put an item in a container", function () {
            var someContainer = [{
                name: "mock item",
                canCarry: true,
                container: {isOpen: false, contents: []}
            }, {name: "small thing", canCarry: false}];
            var getJar = itemService.findItemByName("mock item", someContainer);


            itemService.transfer(someContainer, getJar.container.contents, "small thing");
            expect(getJar.container.contents.length).toBe(1);
        });

        it("should be able to open a type of container", function () {
            var someContainer = {name: "jar", container: {isOpen: false}};

            itemService.open(someContainer);
            expect(someContainer.container.isOpen).toBe(true);
        });

        it("should not allow a non-container to be opened", function () {
            var item = {name: "jar"};
            expect(function () {
                itemService.open(item);
            }).toThrow(new Error("You can't open that."));
        });

        it("should look at an item and get all the details", function () {
            var item = {name: "jar", details: {description: "long description"}};

            itemService.transfer([item], itemService.getInventory(), "jar");
            var details = itemService.look("jar", itemService.getInventory());
            expect(details.description).toBe("long description");
        });

        fit("should not be able to take a large item", function () {
            var items = [
                {name: "car", canCarry: false},
                {name: "book", canCarry: true},
                {name: "thing",canCarry: true},
                {name: "thing 2",canCarry: true}

            ];
            var inventory = itemService.getInventory();

            angular.forEach(items,function(i){
                itemService.take(items, inventory, i.name);
                console.log(i.name);
            });

            itemService.take(items, inventory, "car");
            expect(inventory.length).toBe(1);

        });

    });
})
