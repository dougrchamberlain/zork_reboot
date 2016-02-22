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

    describe("Map Creation",function(){
        it("should create rooms",function(){
            mapService.createRooms(["room 1", "room 2","room 3", "room 4"])  ;

            expect(mapService.getMap().rooms["room 1"]).toBeDefined();
            expect(mapService.getMap().rooms["room 2"]).toBeDefined();
            expect(mapService.getMap().rooms["room 3"]).toBeDefined();
            expect(mapService.getMap().rooms["room 4"]).toBeDefined();
        });

        it("should move to another room",function(){
            mapService.createRooms(["room 1", "room 2","room 3", "room 4"])  ;

            mapService.getMap().rooms["room 1"].exits.north = "room 4";
            mapService.setLocation("room 1");
            mapService.move("north");
            console.log(mapService.currentLocation().name);
            expect(mapService.currentLocation().name).toBe("room 4");

        });

    });
})
