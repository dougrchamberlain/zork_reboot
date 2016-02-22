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

        it("should get/take single item that can be carried", function () {
            var currentInventoryCount = itemService.getInventory().length;
            var newItem = [{name:"mock item", canCarry: true},{name:"item 2", canCarry: false}];

            itemService.take(newItem);

            var newInventoryCount = itemService.getInventory().length;

            expect(currentInventoryCount + 1).toBe(newInventoryCount);
        });

        it("should get/take all items that can be carried", function () {
            var currentInventoryCount = itemService.getInventory().length;
            var loot = [{name:"mock item", canCarry: true},{name:"item 2", canCarry: true}, {name: "item 3", canCarry: false}];

            itemService.take(loot);

            var newInventoryCount = itemService.getInventory().length;

            expect(currentInventoryCount + 2).toBe(newInventoryCount);

        });

        it("should drop single item only if in inventory", function () {
            var item = {name: "hammer"};

            itemService.take([item])
            itemService.drop([item]);

            expect(itemService.getInventory().length).toBe(0);

        });


        it("should open container", function () {
            var item = {name: "jar", container:{isOpen: false}};
           itemService.open(item);

            expect(item.container.isOpen).toBe(true);
        });

        it("should report already opened container", function () {
            var item = {name: "jar", container:{isOpen: true}};


            expect(function(){
                itemService.open(item);
            }).toThrow(new Error("jar already opened"));
        });

        it("should not allow a non-container to be opened", function () {
            var item = {name: "jar"};
            expect(function(){
                itemService.open(item);
            }).toThrow(new Error("You can't open that."));
        });

    });
})
