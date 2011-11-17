var CCanvas = (function() {
  "use strict";
  
  var PI = Math.PI,
      TAU = PI * 2;
  
  function isCanvas(obj)
  {
    return obj instanceof Element && obj.nodeName === "CANVAS";
  }
  
  function createChildObject(obj)
  {
    return Object.create(obj);
  }
  
  function makeColor(args)
  {
    return args[0];
  }
  
  function CCanvas(ele, context)
  {
    if(!(this instanceof CCanvas))
    {
      return new CCanvas(ele);
    }
    var canvas;
    
    if(ele)
    {
      if(typeof ele === "string")
      {
        canvas = ((context && context.document)?context.document:document)
                   .getElementById(ele);
      }
      else if(isCanvas(ele))
      {
        canvas = ele;
      }
      /* jQuery and other javascript libraries */
      else if(ele[0] && isCanvas(ele[0]))
      {
        canvas = ele[0];
      }
      else if(ele.get instanceof Function)
      {
        canvas = ele.get(0);
        if(!isCanvas(canvas))
        {
          canvas = null;
        }
      }
      else if(ele instanceof CChain)
      {
        return CCanvas.prototype.push.apply(ele);
      }
    }
    if(!canvas)
    {
      canvas = document.createElement("canvas");
    }
    this.canvas = canvas;
    var context = this.context = canvas.getContext("2d");
    this._fillStyle = context.fillStyle;
    this._strokeStyle = context.strokeStyle;
  }
  
  CCanvas.prototype.push = function() {
    var child = createChildObject(this);
    child.prevObject = this;
    return child;
  };
  
  ["strokeStyle", "fillStyle"].forEach(function(name) {
    CCanvas.prototype[name] = function() {
      if(arguments.length > 0)
      {
        var child = this.push();
        child["_" + name] = makeColor(arguments);
        return child;
      }
      else
      {
        return this["_" + name];
      }
    }
  });
  
  CCanvas.prototype.applyStyles = function() {
    var context = this.context;
    
    context.fillStyle = this._fillStyle;
    context.strokeStyle = this._strokeStyle;
    
    return this;
  };
  
  CCanvas.prototype.stroke = function() {
    var context = this.context;
    
    context.strokeStyle = this._strokeStyle;
    
    context.stroke();
    
    return this;
  };
  
  CCanvas.prototype.end = function() {
    return this.prevObject;
  };
  
  CCanvas.prototype.circle = function(x, y, radius)
  {
    return this.arc(x, y, radius, 0, TAU);
  };
  
  CCanvas.prototype.arc = function(x, y, radius, startAngle, endAngle, anticlockwise)
  {
    this.context.arc(x, y, radius, startAngle, endAngle, anticlockwise);
    return this;
  };
  
  CCanvas.prototype.fillRect = function(x, y, width, height)
  {
    var context = this.context;
    context.fillStyle = this._fillStyle;
    context.fillRect(x, y, width, height);
  };
  
  CCanvas.prototype.clearRect = function(x, y, width, height)
  {
    this.context.clearRect(x, y, width, height);
  }
  
  CCanvas.prototype.path = function()
  {
    this.context.beginPath();
    return this;
  };
  
  var lib = function(ele, context)
  {
    return new CCanvas(ele, context);
  };
  
  return lib;
})();