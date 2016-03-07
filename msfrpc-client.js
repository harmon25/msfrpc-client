var rp = require('request-promise');
var msgpack = require('msgpack5')(), encode = msgpack.encode , decode = msgpack.decode
var Promise = require("bluebird");
var translateResponse = require('./lib/translate-response')

// prototype function
function clientMsfrpc(options) {
        var options = options || {}
        this.init(options)
  }

clientMsfrpc.prototype.init = function(options){
  this.user = options.user || 'msfUser';
  this.password = options.password || 'pass';
  this.ssl = options.ssl || true;
  this.host = options.host || 'localhost';
  this.port = options.port || 55553
  this.token = options.token || null
  this.tokenTimeout = null;
  this.persist = options.persist || false; 

    if ((!options.password || !options.user) && !options.token) {
      console.log('Must initialize with user and password or persistent token');
    }
}

clientMsfrpc.prototype.login = Promise.method(function(){
    var cmd = ['auth.login', this.user, this.password]

    function setToken (res){
      this.token = res.token;
      return res.token
    }
    // already logged in just return token
    if (this.token) {
      //console.log('already logged in')
        return this.token;
    }
    //need to login, login set token, and return token
    return this.rpc(cmd).then(setToken.bind(this));
});

clientMsfrpc.prototype.rpc = function(cmd){
  var data = encode(cmd);
  var clength = Buffer.byteLength(data.toString('ascii'));
  var proto = (this.ssl == true) ? 'https://' : 'http://'

  var url = proto + this.host + ":" + this.port + '/api/1.0/'
  var options = {
    url:url,
    headers:{
      'content-type':'binary/message-pack',
      'content-length': clength
    },
    timeout:5000,
    encoding:null,
    strictSSL:false,
    body:data
  }
  //post API Command, decode response, translale buffered strings to utf8 strings
  function handleErr(err){
    var err_msg = "Failed to connect to msfrpcd"
    return Promise.reject(err_msg);
  }

 return rp.post(options).then(decode,handleErr).then(translateResponse);  
}


clientMsfrpc.prototype.exec = Promise.method(function(args) {

  if(this.persist === true){
    if(this.tokenTimeout != null){
      clearTimeout(this.tokenTimeout)
    }
    this.tokenTimeout = setTimeout(
      function(){
        this.token = null
      }.bind(this),270000
      );
  }
  
  function addToken(token){
     args = (args instanceof Array) ? args : [args]
     var arr = [];
     arr.push(args.shift());
     arr.push(token);
      if (args.length) {
        args.forEach(function(arg) {
            arr.push(arg);
        });
      };
        return arr;
    }
      //retrieve token, add token to cmd, run rpc with cmd + token
      return this.login().then(addToken).then(this.rpc.bind(this));
    })

module.exports = clientMsfrpc;
