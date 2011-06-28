var SpecHelper = {
  generateRandomString: function(){
    return Math.random().toString().substr(2); 
  },
  
  generateIFrame: function(url, cb){
    var el = document.createElement("iframe");
    var id = SpecHelper.generateRandomString();
    el.setAttribute('id', id);
    document.body.appendChild(el);
    el.setAttribute('height', 0);
    el.setAttribute('width', 1);
    el.setAttribute('src', url);
    if(cb) {
      el.onload = cb;
    }
    return document.getElementById(id).contentWindow;
  },
  deepEqual: function(a, b) {
    // check object identity
    if (a === b) return true;
    // different types?
    var atype = typeof a
    var btype = typeof b;
    if (atype !== btype) return false;
    // basic equality test (watch out for coercions)
    if (a == b) return true;
    // one is falsy and the other truthy
    if ((!a && b) || (a && !b)) return false;
    // check dates' integer values
    if (a instanceof Date && b instanceof Date) {
      return a.getTime() === b.getTime();
    }
    // both are NaN?
    if (a !== a && b !== b) return false;
    // compare regular expressions
    if (a.source && b.source && a.test && b.test && a.exec && b.exec)
      return a.source === b.source &&
        a.global === b.global &&
        a.ignoreCase === b.ignoreCase &&
        a.multiline === b.multiline;
    // if a is not an object by this point, we can't handle it
    if (atype !== 'object') return false;
    // check for different array lengths before comparing contents
    if (a.length && (a.length !== b.length)) return false;
    // nothing else worked, deep compare the contents
    var aKeys = this.keys(a);
    var bKeys = this.keys(b);
    // different object sizes?
    if (aKeys.length != bKeys.length) return false;
    // recursive comparison of contents
    for (var key in a) {
      if (!(key in b) || !this.deepEqual(a[key], b[key])) return false;
    }
    // they are equal
    return true;
  },
  keys: Object.keys || function(obj) {
    var r = [];
    if (obj === Object(obj)) {
      for (var key in obj) if (has(obj, key)) {
        r.push(key);
      }
    }
    return r;
  }
}; 