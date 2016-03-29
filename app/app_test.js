/**
 * Created by doug on 3/23/2016.
 */
describe("Command Interpreter", function () {

    var $controller, lookService, gameService;

    beforeEach(function () {
        module("myApp");
    });

    beforeEach(inject(function (_$controller_, _lookService_, _gameService_) {
        $controller = _$controller_;
        lookService = _lookService_;
        gameService = _gameService_;


    }));

    describe("look at input commands", function () {
        beforeEach(function () {
            spyOn(lookService, "lookAt").and.callFake(function (item) {
            });
        });

        it("should have starting room",function(){
            var room = {name: "starting room"};

            gameService.set(room);

           expect(gameService.currentRoom().name).toBe("starting room");
        });

        it("should find valid commands", function () {
            var vm = $controller("appController");
            var enterKeyEvent = {keyCode: 13};
            vm.inputText = "Look";

            vm.readCommand(enterKeyEvent);

            expect(vm.command.isValid).toBe(true);
        });

        it("should try and execute command if command is valid", function () {
            var vm = $controller("appController");

            vm.inputText = "Look";

            //Act
            vm.readCommand({keyCode: 13});

            //Assert
            expect(lookService.lookAt).toHaveBeenCalledWith();
        });
    })

    describe("lookService", function () {
        it("should look at a thing and describe if it can be described.", function () {
            var item = {describe: function(){}};


            spyOn(item, "describe").and.returnValue("the description");
            lookService.lookAt(item);
            expect(item.describe).toHaveBeenCalled();
        });

        fit("should look at a thing and describe if it can be described.", function () {
            var room = {description : "this room is neat"};
            spyOn(gameService, "describe").and.callThrough();

           gameService.setRoom(room);


            lookService.lookAt();
            expect(gameService.describe).toHaveBeenCalled();
        });



    });
});


