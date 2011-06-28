var static = require('node-static');

//
// Create a node-static server instance to serve the './public' folder
//
var file = new(static.Server)(__dirname+'/public');

var server = require('http').createServer(function (request, response) {
    request.addListener('end', function () {
      file.serve(request, response);
    });
});

var nowjs = require('now');

var everyone = nowjs.initialize(server);


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
  nowjs.getGroup(group).now[key] = val;
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

server.listen(80)