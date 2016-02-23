/**
 * Created by doug on 2/22/2016.
 */
describe("Game Module",function(){
    var _, itemService,mapService,gameService;

    beforeEach(
        function () {
            module("underscore");
            module("myApp");
        }
    )
    beforeEach(inject(function (___, _itemService_,_mapService_,_gameService_) {
        itemService = _itemService_;
        mapService = _mapService_;
        gameService = _gameService_;
        _ = ___;
    }))

    it("should initialize the player",function(){
       var player = gameService.createPlayer("George");

        expect(player.life).toBe(100);
    });

});
