require("babel/polyfill");
import request from 'request';
import msgpack from 'msgpack5';
import chalk from 'chalk';

import translateResponse from './translate-response';

const mp = msgpack();
const encode = mp.encode;
const decode = mp.decode;


class MsfRpcClient {

  constructor(options) {
      this.user = options.user || 'msfUser';
      this.password = options.password || null
      this.ssl = options.ssl || true;
      this.host = options.host || '172.17.0.2';
      this.port = options.port || 55553
      this.token = options.token || null

      if (!options.password && !options.token) {
          throw new Error(chalk.red('Must initalize with token or password'));
      }

  }
///// private methods
  _rpc(cmd) {
      var data = encode(cmd);
      var clength = Buffer.byteLength(data.toString('ascii'));
      // create proto string
      var proto = (this.ssl == true) ? 'https://' : 'http://';

      var urlStr = `${proto}${this.host}:${this.port}/api/1.0/`;

      var options = {
          url: urlStr,
          timeout: 2500,
          rejectUnauthorized: false, // enable self signed certificates
          headers: {
              'content-type': 'binary/message-pack',
              'content-length': clength
          },
          compress: false,
          body: data,
          encoding: null
      };

      return new Promise((resolve, reject) => {
          request.post(options, (err, res) => {
              if (err) {
                  let errMsg = chalk.red(`Are you sure msf API is running on ${err.address}:${err.port} ?!?`)
                  reject(errMsg);
              } else {
                  let decodedBody = decode(res.body);
                  var translatedStrings = translateResponse(decodedBody);
                  if (translatedStrings.error) {
                      let errMsg = chalk.red(`msf API Error: ${translatedStrings.error_message}`)
                      reject(errMsg)
                  } else {
                      resolve(translatedStrings) // OK RPC API responsed without an error - resolve promise
                  }
              }
          })
      });
  }

  _login() {
      const cmd = ['auth.login', this.user, this.password];
      var setToken = (resp) => {
          this.token = resp.token;
          return resp.token;
      }
      return this._rpc(cmd).then(setToken)
  }

/// public methods
  genToken(){
    const cmd = ['auth.token_generate'];
    return this.exec(cmd).then((res)=>{return res.token})
  }
// cmd string or array
  exec(cmd) {
    var cmdArray = (cmd instanceof Array) ? cmd : [cmd];

    var addToken = (token)=>{
      let arr = [];
      arr.push(cmdArray.shift());
      arr.push(token)
      if (cmdArray.length) {
          cmdArray.forEach(function(arg) {
              arr.push(arg);
          });
      };
      return arr;
    }

      if (this.token) {
        cmdArray = addToken(this.token)
        return this._rpc(cmdArray)
      } else {
          return this._login().then(addToken).then(this._rpc.bind(this))
      }

  }

}

module.exports = MsfRpcClient