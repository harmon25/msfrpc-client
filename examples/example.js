var MsfRpcClient = require('../msfrpc-client')

var client = new MsfRpcClient({password:'agoodPass',user:'msfUser', host:'172.17.0.2'})

// execure single commands as a string or array
client.exec('core.version')
.then(
  (res)=>{
    console.log(`MSF Version : ${res.version} `)
    console.log(`API Verson: ${res.api}`)
  }
)
.catch(console.log)

client.exec(['module.exploits'])
.then(
  (res)=>{
    for(var i=0;i<res.length;i++){
      console.log(res[i])
    }
  }
)
.catch(console.log)

// generate a token which will be persistently stored in postgres for API Access
// var client = new MsfRpcClient({token:token})
client.genToken()
.then(
  (token)=>{
    console.log(`here is your token ${token}`)
  }
).catch(console.log)