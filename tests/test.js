var MsfRpcClient = require('../node/msfrpc-client-es6')

// align with msfrpcd settings
// initialize client object
/*
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
*/

//client.exec(['core.version']).then(console.log)
//client.getToken().then(console.log).catch((err)=>{console.log(`core.v error: ${err}`)})
console.log('good version pass');
var client = new MsfRpcClient({
    host: '172.17.0.2',
    password: 'agoodPass',
    port: 55553
});
client.exec(['auth.token_generate']).then((res) => console.log(`good version ${JSON.stringify(res)}`)).catch((err) => {
    console.log(` error: ${err}`)
});


console.log('no pass version fail');
var client3 = new MsfRpcClient({
    host: '172.17.0.2',
    port: 55553
});
client3.exec(['core.version']).then((res) => console.log(`no pass  ${res.version}`)).catch((err) => {
    console.log(`no pass error: ${err}`)
});

//console.log(JSON.stringify(client))
//setTimeout(()=>client.exec(['auth.token_remove', 'TEMP1552885478578059058207234121']).then(console.log).catch((err)=>{console.log(`${err}`)}),5000)

console.log('token version pass ');
var client2 = new MsfRpcClient({
    host: '172.17.0.2',
    token: 'TEMP4604102486453929652145846156',
    port: 55553
});
client2.exec(['core.version']).then((res) => console.log(`token version ${res.version}`)).catch((err) => {
    console.log(`core.v 2 error: ${err}`)
});