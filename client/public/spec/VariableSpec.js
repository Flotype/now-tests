describe("Variable Sync", function() {
  
  xit("can sync primitives from client to server", function() {
    
    function setIfEqual(k, v) {
      equals = val === v && key === k;
    }
    
    var key = SpecHelper.generateRandomString();
    var val = "test";
    
    // Create new variables
    now[key] = val;
    
    
    // Call server function to check if value synced
    var equals;
    runs(function(){
      now.variableCheck(key, setIfEqual);
    });
    
    waitsFor(function(){
      return equals;
    }, "server to notify current value of key", 5000);
    
    runs(function(){
      expect(equals).toBeTruthy();
    });
    
    runs(function(){
      val = 1;
      now[key] = val; 
      equals = false;
    });
    
    
    runs(function(){
      now.variableCheck(key, setIfEqual);
    });
    
    waitsFor(function(){
      return equals;
    }, "server to notify current value of key", 5000);
    
    runs(function(){
      expect(equals).toBeTruthy();
    });
    
  });
  
  
  it("can create terminal non-leaf nodes and do something with later ", function() {
    
    var key = SpecHelper.generateRandomString();
    var key2 = SpecHelper.generateRandomString();
    
    var equals = false;
  
    now.eval("this.now['"+key+"'] = {a: 1, b: []}");
    
    waits(1000);
    
    runs(function(){
      expect(now[key].b.length).toEqual(0);
    
      now.eval("this.now['"+key+"'].b.push(1)");
      now.eval("this.now['"+key+"'].b[1] = 2");      
    
    });
    
    waits(1000);
    
    
    runs(function(){
      expect(now[key].b[0]).toEqual(1);
      expect(now[key].b[1]).toEqual(2);
      expect(now[key].b.length).toEqual(2);
    
      now[key2] = {a: 1, b: []};
      
      now.variableCheck(key2, function(k, v) {
        console.log(arguments);
        equals = v.b.length === 0;  
      });
    });
    
    waitsFor(function(){
      return equals;
    }, "server to confirm array set", 2000);
    
    runs(function(){
      
      equals = false;
      
      now[key2].b.push(1);
      now[key2].b[1] = 2;
      
      now.variableCheck(key2, function(k, v) {
        equals = v.b[0] === 1 && v.b[1] === 2 && v.b.length === 2;
      });
    
    });
    
    waitsFor(function(){
      return equals;
    }, "server to confirm array changes were set", 2000);
    
    
    
    
  });
  
  xit("can sync complicated objects from client to server", function() {
    
    function setIfEqual(k, v){
      equals = key === k && SpecHelper.deepEqual(v, val);
    }
    
    var key = SpecHelper.generateRandomString();
    var val = {a: 1, b: 2};
    
    // Create new variables
    now[key] = val;
    
    // Call server function to check if value synced
    var equals;
    runs(function(){
      now.variableCheck(key, setIfEqual);
    });
    
    waitsFor(function(){
      return equals;
    }, "server to confirm object was set", 5000);
    
    runs(function(){
      expect(equals).toBeTruthy();
    });
    
    runs(function(){
      now[key].a = SpecHelper.generateRandomString(); 
      val = now[key];
      equals = false;
    });
    
    
    runs(function(){
      now.variableCheck(key, setIfEqual)
    });
    
    waitsFor(function(){
      return equals;
    }, "server to confirm child property was changed", 5000);
    
    runs(function(){
      expect(equals).toBeTruthy();
    });
    
    
    runs(function(){
      try {
        now[key].a = {c: SpecHelper.generateRandomString(), d: 3};
      } catch(e) {console.log(e.stack)}
      //equals = false;
    });
    
    
    runs(function(){
      now.variableCheck(key, setIfEqual)
    });
    
    waitsFor(function(){
      return equals;
    }, "server to confirm child property changed to object", 5000);
    
    runs(function(){
      expect(equals).toBeTruthy();
    });
    
    
    runs(function(){
      now[key].a.c = 1; 
      equals = false;
    });
    
    
    runs(function(){
      now.variableCheck(key, setIfEqual);
    });
    
    waitsFor(function(){
      return equals;
    }, "server to confirm child property change from object to primitive", 5000);
    
    runs(function(){
      expect(equals).toBeTruthy();
    });
    
  });
  
  xit("can handle deep objects synced from server and watch along the path", function(){
  
    
    function setIfEqual(k, v){
      return equals = key === k && SpecHelper.deepEqual(v, val);
    }
    
    var key = SpecHelper.generateRandomString();
    var val = {a: 1, b: {c: 1, d: {e: 1}}};
    
    now.setValue(key, val);
    
    // Call server function to check if value synced
    var equals;
    
    waitsFor(function(){
      return setIfEqual(key, now[key]);
    }, "server to confirm object was set", 5000);
    
    runs(function(){
      now[key]['b']['c'] = 6;
    });
    
    runs(function(){
      now.variableCheck(key, setIfEqual);
    });
    
    runs(function(){
      expect(equals).toBeTruthy();
    });
  });
  
  xit("can sync complicated arrays from client to server", function() {
    
    function setIfEqual(k, v){
      equals = key === k && SpecHelper.deepEqual(v, val);
    }
    
    var key = SpecHelper.generateRandomString();
    var val = [1, 2];
    
    // Create new variables
    now[key] = val;
    
    
    // Call server function to check if value synced
    var equals;
    runs(function(){
      now.variableCheck(key, setIfEqual);
    });
    
    waitsFor(function(){
      return equals;
    }, "server to confirm array was set", 5000);
    
    runs(function(){
      expect(equals).toBeTruthy();
    });
    
    runs(function(){
      now[key][0] = SpecHelper.generateRandomString(); 
      val = now[key];
      equals = false;
    });
    
    
    runs(function(){
      now.variableCheck(key, setIfEqual)
    });
    
    waitsFor(function(){
      return equals;
    }, "server to confirm array element was changed", 5000);
    
    runs(function(){
      expect(equals).toBeTruthy();
    });
    
    runs(function(){
      now[key][0] = {c: SpecHelper.generateRandomString(), d: 3};   
      equals = false;
    });
    
    
    runs(function(){
      now.variableCheck(key, setIfEqual)
    });
    
    waitsFor(function(){
      return equals;
    }, "server to confirm array element changed to object", 5000);
      
      
    runs(function(){
      expect(equals).toBeTruthy();
    });
    
    runs(function(){
      now[key].pop();
      equals = false;
    });
    
    
    runs(function(){
      now.variableCheck(key, setIfEqual)
    });
    
    waitsFor(function(){
      return equals;
    }, "server to confirm popping from array", 5000);
     
    runs(function(){
      expect(equals).toBeTruthy();
    });
    
    runs(function(){
      now[key].push(1);
      equals = false;
    });
    
    
    runs(function(){
      now.variableCheck(key, setIfEqual)
    });
    
    waitsFor(function(){
      return equals;
    }, "server to confirm pushing to array", 5000);

    runs(function(){
      expect(equals).toBeTruthy();
    });
    
  });
});