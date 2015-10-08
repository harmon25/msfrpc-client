require("babel/polyfill");
import request from 'request';
import msgpack from 'msgpack5';

import translateResponse from './lib';

const mp = msgpack();
const encode = mp.encode;
const decode = mp.decode;

class MsfRpcClient {
    constructor(options) {
        this.user = options.user || 'msfUser';
        this.password = options.password
        this.ssl = options.ssl || true;
        this.host = options.host || 'localhost';
        this.port = options.port || 55553
        try {
            //if credentials are wrong login failure will catch
            if (!options.token && !options.password) {
                throw "Must have a token or a password";
            } else

            if (!options.token) {
                if (!options.password) {
                    throw 'If not using a token, must login with username and password';
                } else {
                    this._login().then((token) => {this.token = token; return;},(err)=>{throw err; return;})}
            } else {
                this.token = options.token;
            }
        } catch (err) {
            console.log(err);
        }

    }

    _rcpApiCall(cmd) {        
  			// cooerce cmd into an array if it is not
  	 		var cmdArray = (cmd instanceof Array) ? cmd : [cmd];
        // new promise to represent http request
    		return new Promise((resolve, reject) => {
					// msgpack encode cmd array
					try {
						try{var data = encode(cmdArray);} catch(err){throw "msgpack encoding error"}
						var clength = Buffer.byteLength(data.toString('ascii'));
		      	// create proto string
		  			var proto = (this.ssl == true) ? 'https://' : 'http://';
		  			// create url string - yay es6 string templating
		  			var urlStr = `${proto}${this.host}:${this.port}/api/1.0/`;

		  			var options = {
		          url: urlStr,
		          timeout: 2250,
		          rejectUnauthorized: false, // enable self signed certificates
		          headers: {
		              'content-type': 'binary/message-pack',
		              'content-length': clength
		          },
		          compress: false,
		          body: data,
		          encoding: null
		        };

						request.post(options, (err, res) => {
	            if (err) {
	                reject(`request Error: ${err.code}`);
	            } 
	            	else 
	            {
	                //decode msgpak encoded body
	                let decodedBody = decode(res.body);
	                //translate respose 'string' Buffers to utf8 strings
	                var translatedStrings = translateResponse(decodedBody);
	                // if the body contains error, an RPC error, reject promise
	                if (translatedStrings.error) {
	                    reject(`RPC Error: ${translatedStrings.error_message}`);
	                    // OK RPC API responsed without an error - resolve promise
	                } else {
	                    resolve(translatedStrings);
	                }
	            }
	        	});

					} catch(err){
						reject(err);
					}
    	  });	 
     }

    _login() {
        const cmd = ['auth.login', this.user, this.password];

        return new Promise((resolve, reject)=>{
            if (this.token) {
                console.log('logged in')
                resolve(this.token)
            } else {
                this._rcpApiCall(cmd).then(function(res) {
                    resolve(res.token)
                }, function(err) {
                    reject(err)
                })
            }
        });
    }

    getToken() {
        const cmd = ['auth.token_generate'];
        return this.exec(cmd)
    }

    exec(args, token) {
        function addToken(token) {
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

        if (token) {
            let cmd = addToken(token)
            return this._rcpApiCall(cmd);

        } else {
            return this._login().then(addToken).then(this._rcpApiCall.bind(this))
        }


    }
}




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