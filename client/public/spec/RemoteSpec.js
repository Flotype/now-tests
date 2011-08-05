describe("Remote function calls", function() {
  
  it("can call a remote function", function() {
    
    var called = false;
    
    now.callback(function(){
      called = true;
    });
    
    waitsFor(function(){
      return called;
    }, "server to confirm function was called", 2000);
    
    runs(function(){
      expect(called).toBeTruthy();
    });
    
  });
  
  it("can call a remote function and provide a callback", function() {
    
    var called = false;
    
    now.callback(function(){
      called = true;
    });
    
    waitsFor(function(){
      return called;
    }, "server to confirm function was called", 2000);
    
    runs(function(){
      expect(called).toBeTruthy();
    });
    
  });
  
  
  it("can call a remote function and provide multiple callbacks", function() {
    
    var called1 = false;
    var called2 = false;
    
    now.multipleCallbacks(function(){
      called1 = true;
    }, function(){
      called2 = true;
    });
    
    waitsFor(function(){
      return called1 && called2;
    }, "server to confirm function was called", 2000);
    
    runs(function(){
      expect(called1).toBeTruthy();
      expect(called2).toBeTruthy();
    });
    
  });
  
});
