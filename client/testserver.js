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



server.listen(80);

var nowjs = require('now');

var everyone = nowjs.initialize(server, {socketio: {'log level': 1}});



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
  console.log("*********", key, '=>', val);
}

everyone.now.test = function(key){
  everyone.now['poop'] = key;
  everyone.now[key] = 'doo';
  eval('everyone.now["x"] = 3;');
  
}

everyone.now.setGroupValue = function(group, key, val) {
  nowjs.getGroup(group).now[key] = val;
}

everyone.now.setValue = function(key, val){
  this.now[key] = val;
}

everyone.now.eval = function(code){
  console.log(code);
  eval(code);
}

everyone.now.joinGroup = function(groupName, cb) {
  var group = nowjs.getGroup(groupName);
  group.addUser(this.user.clientId);
}

everyone.now.removeGroupTest = function(groupName, cb) {
  var clientId = this.user.clientId;
  var group = nowjs.getGroup(groupName);
  group.addUser(clientId);
  group.on('leave', function() {
    if(this.user.clientId == clientId) {
      cb();
    }
  });
  nowjs.removeGroup(groupName);
}
