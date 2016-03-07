var MsfRpcClient = require('msfrpc-client-node');

// persist can be used to timeout token on the client, giving the illusion of a persisten token
// set persist to true to set timeout one exec, after 4.5 minutes a token will timeout
var client = new MsfRpcClient({
                                password:'agoodPass',
                                user:'msfUser',
                                host:'localhost',
                                persist:false
                              });


client.exec('core.version')
.then(
  (res)=>{
    console.log(res);
    console.log(`MSF Version : ${res.version} `)
    console.log(`API Verson: ${res.api}`)
  }
)
.catch(console.log);

client.exec(['module.exploits'])
.then(
  (res)=>{
    console.log(res);
  }
)
.catch(console.log);

client.exec('session.list')
.then(
  (res)=>{
    console.log(res)
  }
)
.catch(console.log);

client.exec(['db.hosts', {}])
.then(
  (res)=>{
    console.log(res);
  }
)
.catch(console.log);

client.exec(['db.workspaces'])
.then(
  (res)=>{
    console.log(res);
  }
)
.catch(console.log);

client.exec(['db.get_workspace', 'default'])
.then(
  (res)=>{
    console.log(res);
  }
)
.catch(console.log);

client.exec(['job.list'])
.then(
  (res)=>{
    console.log(res);
  }
)
.catch(console.log);


client.exec(['module.info', 'exploit', 'unix/misc/xerox_mfp' ])
.then(
  (res)=>{
    console.log(res);
  }
)
.catch(console.log);

