# msfrpc-client
NodeJS client for msfrpcd using Promises 

```
npm install msfrpc-client --save
```

## Usage
```javascript
var clientMsfrpc = require('msfrpc-client')

// align with msfrpcd settings
// initialize client object
var client = new clientMsfrpc({
                            host:'172.17.0.2',  // optional : default = localhost
                            port:55553,         // optional : default = 55553
                            user:"msfUser",     // optional : default = msfUser
                            password:"agoodPass",    // optional : default = password
                            ssl:true
                          });

// execute API command client.exec returns a promise
client.exec(['core.version']).then(function(response){
  console.log(response);
});
```