var clientMsfrpc = require('../msfrpc-client')

// align with msfrpcd settings
// initialize client object
var client = new clientMsfrpc({
                            host:'localhost',  // optional : default = localhost
                            port:55553,         // optional : default = 55553
                            user:"msfUser",     // optional : default = msfUser
                            password:"password",    // optional : default = password
                            ssl:true
                          });

// execute API command client.exec returns a promise
client.exec(['core.version']).then(function(results){
  console.log(results)
});
