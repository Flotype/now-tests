describe("Server scoping tests", function() {
  
  it("adds to the defaultScope so new users get properties set in the `everyone.now` object", function() {
    var window2;
    
    var key = SpecHelper.generateRandomString();
    var val = SpecHelper.generateRandomString();
    
    now.setEveryoneValue(key, val);
    
    
    runs(function(){
      window2 = SpecHelper.generateIFrame('now.html');
    });
    
    waits(500);
    
    var nowReady = false;
    
    runs(function(){
      window2.now.ready(function(){
        nowReady = true;
      });
    });
    
    waitsFor(function(){
      return nowReady;
    }, "now to be ready", 2000);
   
    runs(function(){
      expect(window.now[key]).toEqual(val);
    });
    
  });
  
  it("adds to the group so new users get properties set in the group.now object", function() {
    var window2;
    
    var key = SpecHelper.generateRandomString();
    var val = SpecHelper.generateRandomString();
    var group = SpecHelper.generateRandomString();
    
    now.joinGroup(group);
    now.setGroupValue(group, key, val);
    
    
    
    runs(function(){
      window2 = SpecHelper.generateIFrame('now.html');
    });
    
    waits(500);
    
    var nowReady = false;
    
    runs(function(){
      window2.now.ready(function(){
        now.joinGroup(group);
        nowReady = true;
      });
    });
    
    waitsFor(function(){
      return nowReady;
    }, "now to be ready", 2000);
   
    runs(function(){
      expect(window.now[key]).toEqual(val);
    });
    
  });
  
  it("propagates multicallers to everyone", function() {
    var called = false;
    
    var key = SpecHelper.generateRandomString();
    var val = function(){
      called = true;
    };
    
    now.setValue(key, val);
    
    waits(500);
    
    runs(function(){
      now.eval("everyone.now['"+key+"']();");
    });
    
   
    waitsFor(function(){
      return called;
    }, "generated callback to be called", 2000);
    
    runs(function(){
      expect(called).toBeTruthy();
    });
    
  });
  
  it("propagates a users functions to group when that user is added to a group", function() {
    var called = false;
    
    var key = SpecHelper.generateRandomString();
    var val = function(){
      called = true;
    };
    var group = SpecHelper.generateRandomString();
  
    now.setValue(key, val);
    now.joinGroup(group);
    
    now.eval("nowjs.getGroup('"+group+"').now['"+key+"']();");
    
   
    waitsFor(function(){
      return called;
    }, "generated callback to be called", 2000);
    
    
    runs(function(){
      expect(called).toBeTruthy();
    });
  });
});