require("babel/polyfill");
import request from 'request';
import msgpack from 'msgpack5';


import translateResponse from './lib';

const mp = msgpack();
const encode = mp.encode
const decode = mp.decode

/*
let ssl = true
let host = '172.17.0.2'
let port = 55553

let cmd = ['auth.login', 'msfUser', 'agoodPass']

var data = encode(cmd);
var clength = Buffer.byteLength(data.toString('ascii'));
var proto = (ssl == true) ? 'https://' : 'http://'

var urlStr = `${proto}${host}:${port}/api/1.0/`;
var options = {
      url:urlStr,
      headers:{
        'content-type':'binary/message-pack',
        'content-length': clength
      },
      timeout:1500,
      encoding:null,
      strictSSL:false,
      body:data
    }


function decodeBody(res){
	return decode(res.body)
}

function checkLogin(decodedBody){
	if (decodedBody.token){
		this.token = decodedBody.token;
		return decodedBody.token
	} else {
		return decodedBody
	}
}

var t = new Promise(function(resolve, reject){
	request.post(options, function(err,res){
		if (err) reject(err);

		if (res){
			resolve(res)
		}

	})
});

t.then(console.log)
*/

class MsfRpcClient {
	constructor(options){
		this.user = options.user || 'msfUser';
		this.password = options.password || 'pass';
		this.ssl = options.ssl || true;
		this.host = options.host || 'localhost';
		this.port = options.port || 55553
		//if credentials are wrong, and login fails will catch
		this.login().catch(console.log) // retrieve access token	
	}

	rcpApiCall(cmd) {
		// cooerce cmd into an array if it is not
		var cmdArray = (cmd instanceof Array) ? cmd : [cmd]
		// msgpack encode cmd array
		var data = encode(cmdArray); 
		// calculate content length
		var clength = Buffer.byteLength(data.toString('ascii'));
		// create proto string
		var proto = (this.ssl == true) ? 'https://' : 'http://';
		// create url string - yay es6 string templating
		var urlStr = `${proto}${this.host}:${this.port}/api/1.0/`;

		var options = {
			url:urlStr,
			timeout:2000,
			rejectUnauthorized: false, // enable self signed certificates
			headers:{'content-type':'binary/message-pack','content-length': clength},
			compress:false,
			body:data,
			encoding:null
		}
		// new promise to represent http request
		var p = new Promise((resolve,reject) => {
			request.post(options,(err, res) =>{
				if (err){
					if(err.code === 'ETIMEDOUT'){
						reject('RPC Connection timed out');
					} else {
						reject(err)
					}
					
				} else {
					//decode msgpak encoded body
					var decodedBody = decode(res.body);
					//translate respose 'string' Buffers to utf8 strings
					var translatedStrings = translateResponse(decodedBody);
					// if the body contains error, an RPC error, reject promise
					if (translatedStrings.error){
						reject(translatedStrings.error_message);
					// OK RPC API responsed without an error - resolve promise
					} else {
						resolve(translatedStrings);
					}
				}	
			});
		});

		return p

	}

	login(){
		const cmd = ['auth.login', this.user, this.password];

		var p = new Promise((resolve,reject)=>{
			if (this.token){
				console.log('logged in')
				resolve(this.token)
			} else{
				this.rcpApiCall(cmd).then((res)=>{
					this.token = res.token
					resolve(res.token)
				}, (err)=>{reject(err)})	
			}
		});

		return p
	}

	exec(args){
		function addToken(token){
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

		return this.login().then(addToken).then(this.rcpApiCall.bind(this))
	}
}


var client = new MsfRpcClient({host:'172.17.0.2', password:'goodPass'});

//client.exec(['core.version']).then(console.log)



//console.log(JSON.stringify(client))

setTimeout(()=>client.exec(['core.version']).then(console.log).catch(console.log),2000)
