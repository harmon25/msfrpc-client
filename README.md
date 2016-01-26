# msfrpc-client
NodeJS client for msfrpcd using bluebird promises

```
npm install msfrpc-client-node --save
```

## Usage
```javascript
var MsfRpcClient = require('msfrpc-client-node');

// persist can be used to timeout token on the client, giving the illusion of a persisten token
// set persist to true to set timeout one exec, after 4.5 minutes a token will timeout
var client = new MsfRpcClient({
                                password:'agoodPass',
                                user:'msfUser',
                                host:'localhost',
                                persist:false
                              });

client.exec(['core.version'])
.then(
  (res)=>{
    console.log(`MSF Version : ${res.version} `)
    console.log(`API Verson: ${res.api}`)
  }
)
.catch(console.log);

client.exec(['module.exploits'])
.then(
  (res)=>{
    for(var i=0; i < res.length; i++){
      console.log(res[i])
    }
  }
)
.catch(console.log);

```