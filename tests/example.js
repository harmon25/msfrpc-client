var MsfRpcClient = require('../node/msfrpc-client-es6')
/*

var client = new MsfRpcClient({
    host: '172.17.0.2',
    password: 'agoodPass',
    port: 55553
});
client.exec(['auth.token_generate']).then((res) => console.log(`good version ${JSON.stringify(res)}`)).catch((err) => {
    console.log(err)
});



var client2 = new MsfRpcClient({
    host: '172.17.0.2',
    token: 'TEMP4604102486453929652145846156',
    port: 55553
});
client2.exec(['core.version']).then((res) => console.log(`token version ${res.version}`)).catch((err) => {
    console.log(err)
});

client3.exec(['core.version']).then((res) => console.log(`no pass  ${res.version}`)).catch((err) => {
    console.log(err)
});
*/

var client3 = new MsfRpcClient({
      host: '172.17.0.2',
      port: 55553,
      password:'agoodPass'
  });


setTimeout(function(){console.log(client3.token)}, 500)




