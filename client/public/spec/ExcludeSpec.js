describe("Exclude tests", function() {
  
  it("can exclude users from groups", function() {
    var window2;
    
    var group = SpecHelper.generateRandomString();
    
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
      window2.now.joinGroup(group);
      now.joinGroup(group);
      now.eval("nowjs.getGroup('"+group+"').now.x = 1");
    });
    
    waitsFor(function(){
      return now.x === 1 && window2.now.x === 1;
    }, "both now window to receive group rv", 2000);
    
     
    runs(function(){
      now.eval("nowjs.getGroup('"+group+"').exclude('"+window2.now.core.clientId+"').now.x = 2");
    });
    
    waits(1000);
    
    waitsFor(function(){
      return now.x === 2 && window2.now.x === 1;
    }, "exclude to prevent one window from receiving rv", 2000);
    
    runs(function(){
      now.eval("nowjs.getGroup('"+group+"').now.x = 4");
      
      now.eval("nowjs.getGroup('"+group+"').exclude(['"+now.core.clientId+"']).now.x = 3");

    });
    
    waits(1000);
    
    waitsFor(function(){
      return now.x === 4 && window2.now.x === 3;
    }, "exclude to prevent one window from receiving rv", 2000);
    
    runs(function(){
      expect(window2.now.x).toEqual(3);
    });
    
  
  });
  
 
});