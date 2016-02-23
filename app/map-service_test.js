/**
 * Created by doug on 2/21/2016.
 */
describe("Map Service", function(){

    var mapService, _;

    beforeEach(function(){
        module("underscore");
        module("myApp");
    });

    beforeEach(inject(function(___,_mapService_){
        mapService = _mapService_;
        _ = ___;

    }))

    describe("Map navigation and creation",function(){
        it("should create rooms",function(){
            mapService.createRooms(["room 1", "room 2","room 3", "room 4"])  ;

            expect(mapService.getMap().rooms["room 1"]).toBeDefined();
            expect(mapService.getMap().rooms["room 2"]).toBeDefined();
            expect(mapService.getMap().rooms["room 3"]).toBeDefined();
            expect(mapService.getMap().rooms["room 4"]).toBeDefined();
        });

        it("should move north to another room",function(){
            mapService.createRooms(["room 1", "room 2","room 3", "room 4"])  ;

            mapService.getMap().rooms["room 1"].exits.north = "room 4";
            mapService.setLocation("room 1");
            mapService.move("north");
            expect(mapService.currentLocation().name).toBe("room 4");

        });

        it("should move up to another room",function(){
            mapService.createRooms(["room 1", "room 2","room 3", "room 4"])  ;

            mapService.getMap().rooms["room 1"].exits.up = "room 4";
            mapService.setLocation("room 1");
            mapService.move("up");
            expect(mapService.currentLocation().name).toBe("room 4");

        });

        it("should move down to another room",function(){
            mapService.createRooms(["room 1", "room 2","room 3", "room 4"])  ;

            mapService.getMap().rooms["room 1"].exits.down = "room 4";
            mapService.setLocation("room 1");
            mapService.move("down");
            expect(mapService.currentLocation().name).toBe("room 4");

        });

        it("should move not move if no exit exists",function(){
            mapService.createRooms(["room 1", "room 2","room 3", "room 4"])  ;

            mapService.setLocation("room 1");
            expect(function(){mapService.move("up")}).toThrow(new Error("You can't go that way"));

        });



    });
})
