describe("Cluster-specific functionality", function(){

  it("can call a group multicaller of a server-side function, callback defined on server A", function(){
    var success = false;

    //Get the count for everyone
    now.callFunction("everyone.now.serverside", function(count, total){
      success = (count == total);
    });
    
    waitsFor(function(){
      return success;
    }, "all callbacks to be received by server", 2000);

    runs(function(){
      expect(success).toBeTruthy();
    });

  });

  it("can call a group multicall of a function server-side function, callback defined on client 1", function(){
    var success = false;
    var count = 0;
    now.getCount("everyone", function(total){
      now.callFunctionWithCallback("everyone.now.serverside", function(){
        success = (++count == total);
      });
    });

    waitsFor(function(){
      return success;
    }, "all callbacks to be received by client", 2000);

    runs(function(){
      expect(success).toBeTruthy();
    });

  });

  it("can call a group multicaller of a client-side function, callback defined on server A", function(){
    var success = false;

    //Get the count for everyone
    now.callFunction("everyone.now.clientside", function(count, total){
      success = (count == total);
    });
    
    waitsFor(function(){
      return success;
    }, "all callbacks to be received by server", 2000);

    runs(function(){
      expect(success).toBeTruthy();
    });

  });

  it("can call a group multicaller of a client-side function, callback defined on c1", function(){
    var success = false;
    var count = 0;
    now.getCount("everyone", function(total){
      now.callFunctionWithCallback("everyone.now.serverside", function(){
        success = (++count == total);
      });
    });

    waitsFor(function(){
      return success;
    }, "all callbacks to be received by server", 2000);

    runs(function(){
      expect(success).toBeTruthy();
    });

  });

  it("can pass a callback as an arg to a sA->sB callback", function(){

    var success = false;

    //Get the count for everyone
    now.callFunctionExpectCallback("everyone.now.serverside2", function(result){
      success = result;
    });
    
    waitsFor(function(){
      return success;
    }, "all callbacks to be received by server", 2000);

    runs(function(){
      expect(success).toBeTruthy();
    });
  });

  it("can pass a callback as an arg to a c1->sB callback", function(){
    var success = false;
    var count = 0;

    now.getCount("everyone", function(total){
      now.callFunctionWithCallbackExpectCallback("everyone.now.serverside2", 
                                                 function one(two){two();}, 
                                                 function three(){
                                                   console.log(count + 1);
                                                   console.log(total);
                                                   success = (++count == total);});
    });

    waitsFor(function(){
      return success;
    }, "all callbacks to be received by client", 2000);

    runs(function(){
      expect(success).toBeTruthy();
    });

  });

  it("can pass a callback as an arg to a sA->c2 callback", function(){

    var success = false;

    //Get the count for everyone
    now.callFunctionExpectCallback("everyone.now.clientside2", function(result){
      success = result;
    });
    
    waitsFor(function(){
      return success;
    }, "all callbacks to be received by server", 2000);

    runs(function(){
      expect(success).toBeTruthy();
    });

  });

  it("can pass a callback as an arg to a c1->c2 callback", function(){
    var success = false;
    var count = 0;

    now.getCount("everyone", function(total){
      now.callFunctionWithCallbackExpectCallback("everyone.now.clientside2", 
                                                 function one(two){two();}, 
                                                 function three(){
                                                   console.log(count + 1);
                                                   console.log(total);
                                                   success = (++count == total);});
    });

    waitsFor(function(){
      return success;
    }, "all callbacks to be received by client", 2000);

    runs(function(){
      expect(success).toBeTruthy();
    });
  });

  it("can get remote client and set a primitive variable", function(){
    var success = false;
    
    now.setVarOnClient(function(result){
      success = result;
    });

    waitsFor(function(){return success;}, "value to get set on remote client", 2000);

    runs(function(){
      expect(success).toBeTruthy();
    });

  });

  it("can get a remote client and delete a variable", function(){

    var success = false;
    
    now.delVarOnClient(function(result){
      success = result;
    });

    waitsFor(function(){return success;}, "value to get set on remote client", 2000);

    runs(function(){
      expect(success).toBeTruthy();
    });

  });

  it("can get a remote client and call a server-side function, c1 callback", function(){

    var success = false;
    now.callRemoteClientFn("serverside", function(){
      success = true;
    });
    
    waitsFor(function(){
      return success;
    }, "callback to be called by remote client", 2000);

    runs(function(){
      expect(success).toBeTruthy();
    });

  });

  it("can get a remote client and call a client-side function, c1 callback", function(){

    var success = false;
    now.callRemoteClientFn("clientside", function(){
      success = true;
    });
    
    waitsFor(function(){
      return success;
    }, "callback to be called by remote client", 2000);

    runs(function(){
      expect(success).toBeTruthy();
    }); 

  });


});