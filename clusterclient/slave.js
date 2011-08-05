var sys = require('sys'),
fs = require('fs'), 
spawn = require('child_process').spawn;

//var child = spawn('node', ['slave']);


var static = require('node-static');

//
// Create a node-static server instance to serve the './public' folder
//
var file = new(static.Server)(__dirname+'/public', {cache: 0});

var server = require('http').createServer(function (request, response) {
  request.addListener('end', function () {
    file.serve(request, response);
  });
});

var nowjs = require('now-cluster');
server.listen(8081);
var everyone = nowjs.initialize(server, {redis: {host: '127.0.0.1'}, socketio: {"log level": 1}});


everyone.now.callRemoteClientFn = function(name, cb){
  everyone.getUsers(function(users){
    var rand = Math.floor(Math.random()*(users.length));
    var remote = users[rand];
    nowjs.getClient(remote, function(){
      var fn = this.now[name];
      fn(cb);
    });

  });
}

everyone.now.callClientFn = function(name, args){
  theFunction = this.now[name];
  theFunction.apply(null, args);
}

everyone.now.setVarOnClient = function(cb){

  var key = Math.random().toString().substring(2);
  var val = Math.random().toString().substring(2);

  everyone.getUsers(function(users){
    var rand = Math.floor(Math.random()*(users.length));
    var remote = users[rand];

    nowjs.getClient(remote, function(){
      this.now[key] = val;
      var user = this;
      this.now.getKey(key, function(trueVal){
        cb(trueVal == val);
      });
    });

  });
}

everyone.now.delVarOnClient = function(cb){
  var key = Math.random().toString().substring(2);
  var val = Math.random().toString().substring(2);

  everyone.getUsers(function(users){
    var rand = Math.floor(Math.random()*(users.length));
    var remote = users[rand];
    
    nowjs.getClient(remote, function(){
      this.now[key] = val;
      var user = this;
      this.now.getKey(key, function(valOne){
        if(valOne == val){
          delete user.now[key];
          user.now.getKey(key, function(valTwo){
            cb(valTwo == undefined);
          });
        }
      });
    });
  });

}

everyone.now.getCount = function(groupName, cb){
  nowjs.getGroup(groupName).count(cb);
}

everyone.now.callFunction = function(fqn, cb){
  var theFunction = eval(fqn);
  everyone.count(function(total){
    var num = 0;
    theFunction(function(){
      num += 1;
      cb(num, total);
    });
  });
}

everyone.now.callFunctionExpectCallback = function(fqn, clientCallback){
  var theFunction = eval(fqn);
  var num = 0;
  everyone.count(function(total){
    theFunction(function one(two){two();}, function three(){
      num += 1;
      if(num == total) clientCallback(true);
    });
  });
}

everyone.now.callFunctionWithCallback = function(fqn, cb){
  var theFunction = eval(fqn);
  theFunction(cb);
}

everyone.now.callFunctionWithCallbackExpectCallback = function(fqn, one, three){
  theFunction = eval(fqn);
  theFunction(one, three);
}

everyone.now.serverside2 = function(one, three){
  one(function two(){
    three();
  });
}

everyone.now.serverside = function(cb){
  cb();
};

everyone.now.variableCheck = function(key, cb) {
  cb(key, this.now[key]);
}

everyone.now.callback = function(cb) {
  cb();
}

everyone.now.multipleCallbacks = function(cb1, cb2) {
  cb1();
  cb2();
}

everyone.now.setEveryoneValue = function(key, val) {
  everyone.now[key] = val;
}

everyone.now.setGroupValue = function(group, key, val) {
  var theGroup = nowjs.getGroup(group)
  theGroup.now[key] = val;
}

everyone.now.setValue = function(key, val){
  this.now[key] = val;
}

everyone.now.eval = function(code){
  eval(code);
}

everyone.now.joinGroup = function(group) {
  nowjs.getGroup(group).addUser(this.user.clientId);
}

