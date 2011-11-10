var CCanvas = (function() {
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
  
  function CCanvas(ele)
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
        canvas = document.getElementById(ele);
      }
      else if(isCanvas(ele))
      {
        canvas = ele;
      }
      else if(ele[0] && isCanvas(ele[0]))
      {
        canvas = ele[0];
      }
      else if(ele.get instanceof Function)
      {
        canvas = ele.get(0)
        if(!isCanvas(canvas))
        {
          canvas = null;
        }
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
    var child = createChildObject(this)
    child.prevObject = this;
    return child;
  };
  
  CCanvas.prototype.end = function() {
    return this.prevObject;
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
        return this[name];
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
  
  var lib = function(ele)
  {
    return new CCanvas(ele);
  };
  
  return lib;
})();