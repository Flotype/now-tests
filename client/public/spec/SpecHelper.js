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

  isArray: function(someVar){
     return Object.prototype.toString.call( someVar ) === '[object Array]';
  },
  
  deepEqual: function(a, b) {
    // check object identity
    if (a === b) return true;
    // different types?
    var atype = typeof a
    var btype = typeof b;
    if (atype !== btype) return false;
    // Arrays?
    var aarr = SpecHelper.isArray(a)
    var barr = SpecHelper.isArray(b);
    if (aarr !== barr) return false;
    
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
      for (var key in obj) if (SpecHelper.has(obj, key)) {
        r.push(key);
      }
    }
    return r;
  },
  
  has: function (obj, prop) {
    return Object.prototype.hasOwnProperty.call(Object(obj), prop);
  }
}; 


if(!this.JSON){JSON=function(){function f(n){return n<10?'0'+n:n;}  Date.prototype.toJSON=function(){return this.getUTCFullYear()+'-'+  f(this.getUTCMonth()+1)+'-'+  f(this.getUTCDate())+'T'+  f(this.getUTCHours())+':'+  f(this.getUTCMinutes())+':'+  f(this.getUTCSeconds())+'Z';};var m={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'};function stringify(value,whitelist){var a,i,k,l,r=/["\\\x00-\x1f\x7f-\x9f]/g,v;switch(typeof value){case'string':return r.test(value)?'"'+value.replace(r,function(a){var c=m[a];if(c){return c;}  c=a.charCodeAt();return'\\u00'+Math.floor(c/16).toString(16)+  (c%16).toString(16);})+'"':'"'+value+'"';case'number':return isFinite(value)?String(value):'null';case'boolean':case'null':return String(value);case'object':if(!value){return'null';}  if(typeof value.toJSON==='function'){return stringify(value.toJSON());}  a=[];if(typeof value.length==='number'&&!(value.propertyIsEnumerable('length'))){l=value.length;for(i=0;i<l;i+=1){a.push(stringify(value[i],whitelist)||'null');}  return'['+a.join(',')+']';}  if(whitelist){l=whitelist.length;for(i=0;i<l;i+=1){k=whitelist[i];if(typeof k==='string'){v=stringify(value[k],whitelist);if(v){a.push(stringify(k)+':'+v);}}}}else{for(k in value){if(typeof k==='string'){v=stringify(value[k],whitelist);if(v){a.push(stringify(k)+':'+v);}}}}  return'{'+a.join(',')+'}';}}  return{stringify:stringify,parse:function(text,filter){var j;function walk(k,v){var i,n;if(v&&typeof v==='object'){for(i in v){if(Object.prototype.hasOwnProperty.apply(v,[i])){n=walk(i,v[i]);if(n!==undefined){v[i]=n;}}}}  return filter(k,v);}  if(/^[\],:{}\s]*$/.test(text.replace(/\\./g,'@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').replace(/(?:^|:|,)(?:\s*\[)+/g,''))){j=eval('('+text+')');return typeof filter==='function'?walk('',j):j;}  throw new SyntaxError('parseJSON');}};}();}  