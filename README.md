# msfrpc-client
NodeJS client for msfrpcd with es6 promises

```
npm install msfrpc-client-node --save
```

## Usage
```javascript
var MsfRpcClient = require('msfrpc-client');

var client = new MsfRpcClient({
                               user:"user",
                               password:'apass',
                           //  token:'TEMP9619621247881849871235361738',  //Can be used instead of password
                               ssl:true,          // default
                               host:'localhost',  // default
                               port:55553         // default
                             });

// execure single commands as a string or array
client.exec('core.version')
.then(
  (res)=>{
    console.log(`MSF Version : ${res.version}`);;
    console.log(` API Verson : ${res.api}`);
  }
)
.catch(console.log);

// single object array api response {exploits:[]} returned as just the array
client.exec(['module.exploits'])
.then(
  (res)=>{
    for(var i in res){
      console.log(res[i]);
    }
  }
)
.catch(console.log);

// generate a token which will be persistently stored in postgres for API Access
// var client = new MsfRpcClient({token:token,address:'somehost'})
client.genToken()
.then(
  (token)=>{
    console.log(`here is your token ${token}`);
  }
).catch(console.log);
```