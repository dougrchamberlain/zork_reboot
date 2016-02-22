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
            var someContainer = [{name:"mock item", canCarry: true},{name:"item 2", canCarry: false}];

            itemService.transfer(someContainer,itemService.getInventory(),"mock item");

            expect(itemService.getInventory().length).toBe(1);

        });

        it("should fail to drop item not in  inventory", function () {
            var someContainer = [{name:"mock item", canCarry: true},{name:"item 2", canCarry: false}];

            itemService.transfer(someContainer,itemService.getInventory(),"mock item 2")
            expect(itemService.transfer).toThrow(new Error("Item does not exist"));
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
