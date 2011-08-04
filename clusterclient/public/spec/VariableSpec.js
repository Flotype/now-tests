describe("Variable Sync", function() {
  
  it("can sync primitives from client to server", function() {
    
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
  
  
  
  it("can sync complicated objects from client to server", function() {
    
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
  
  it("can handle deep objects synced from server and watch along the path", function(){
  
    
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
  
  it("can sync complicated arrays from client to server", function() {
    
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