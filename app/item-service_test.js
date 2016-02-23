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
            var someContainer = [{name: "mock item", canCarry: true}, {name: "item 2", canCarry: true}];

            itemService.loadRoom(someContainer);
            itemService.take("mock item");
            itemService.drop("mock item");

            expect(itemService.getAvailable()["mock item"].canCarry).toBe(true);

        });

        it("should fail to drop item not in inventory", function () {
            var someContainer = [{name: "mock item", canCarry: true}, {name: "item 2", canCarry: true}];

            itemService.loadRoom(someContainer);
            itemService.take("mock item");
            itemService.drop("mock item 2");
            expect(itemService.getAvailable()["mock item 2"]).toBeUndefined();
            expect(itemService.getInventory()["mock item"].canCarry).toBe(true);
        });

        fit("should be able to put an item in a container", function () {
            var someContainer = [{
                name: "mock item",
                canCarry: true,
                container: {isOpen: true, contents: []}
            }, {name: "small thing", canCarry: true}];
            var getJar = itemService.findItemByName("mock item", someContainer);


            itemService.put("small thing").into("");
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
            var item = [{name: "jar", details: {description: "long description"}}];

            itemService.transfer(item, itemService.getInventory(), item);
            var details = itemService.look("jar", itemService.getInventory());
            expect(details.description).toBe("long description");
        });

        it("should not be able to take a large item", function () {
            var items = [
                {name: "car", canCarry: false},
                {name: "book", canCarry: false},
                {name: "thing",canCarry: true},
                {name: "thing 2",canCarry: true},
                {name: "thing 3",canCarry: true},
                {name: "thing 4",canCarry: true},
                {name: "thing 5",canCarry: true},
                {name: "thing 6",canCarry: true}


            ];
            var inventory = itemService.getInventory();

                itemService.take(items, _.pluck(items,"name"));


            expect(inventory.length).toBe(6);

        });


        it("should drop an item ", function () {
            var items =[ {name: "jar", details: {description: "long description"}}];
            var loot = [];
            itemService.take(items,items[0]);
            itemService.drop([], "jar");
            expect(itemService.getInventory().length).toBe(0);
        });

       it("should read the text ", function () {
            var items =[ {name: "jar",canCarry: true, details: {description: "long description"}, text: "A Mason jar is a molded glass jar used in home canning to preserve food. The mouth of the jar has screw threads on its outer perimeter to accept a metal ring (or \"band\"). The band, when screwed down, presses a separate stamped steel disc-shaped lid against the rim of the jar. An integral rubber ring on the underside of the lid creates a hermetic seal to the jar. The bands and lids usually come with new jars, and bands and lids are also sold separately; while the bands are reusable, the lids are intended for single use when canning.                While largely supplanted by other methods, such as the tin can and plastic containers, for commercial mass production, they are still commonly used in home canning.                The Mason jar was invented and patented in 1858 by Philadelphia tinsmith John Landis Mason[1][2] (1832–1902). Among other common names for them are Ball jars, after Ball Corporation, an early and prolific manufacturer of the jars; fruit jars for a common content; and simply glass canning jars reflecting their material."            }];

            console.log(itemService.read("jar"));

        });



    });
})
