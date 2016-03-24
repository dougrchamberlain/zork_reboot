/**
 * Created by doug on 3/23/2016.
 */
describe("Command Interpreter",function(){

    var $controller;

    beforeEach(function(){
        module("myApp");
    });

    beforeEach(inject(function(_$controller_){
        $controller = _$controller_;
    }));

    it("should find valid commands",function(){
        var vm = $controller("appController");
        vm.inputText = "Look";

        vm.readCommand({keyCode: 13});

        expect(vm.command.isValid).toBe(true);
    });

    it("should find valid commands",function(){
        var vm = $controller("appController");
        vm.inputText = "Look";

        vm.readCommand({keyCode: 13});

        expect(vm.command.isValid).toBe(true);
    });
});
