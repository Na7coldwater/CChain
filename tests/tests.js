(function(){
	"use strict";
	
  module("core");
  
  test("Constructor", function() {
    var main = document.getElementById("main");
    
    expect(4);
    
    ok(CCanvas, "CCanvas global variable exists");
    equal(CCanvas("main").canvas, main, "Passing id of canvas");
    equal(CCanvas(main).canvas, main, "Passing canvas element");
    ok(CCanvas().canvas, "Passing no argument");
  });
  
  test("Stroke and fill styles", function() {
    var parent = CCanvas();
    var child = parent.fillStyle("red");
    
    equal(child._fillStyle, "red", "Set fillStyle to red");
    notEqual(parent._fillStyle, "red", "Changes to child don't affect parent");
    
  });
	
}());