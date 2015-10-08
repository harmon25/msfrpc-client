require("babel/polyfill");
import request from 'request';
import msgpack from 'msgpack5';
import chalk from 'chalk';

import translateResponse from './lib';

const mp = msgpack();
const encode = mp.encode;
const decode = mp.decode;
const errString = (err) => {return chalk.red(err)}

class MsfRpcClient {
  constructor(options) {
    this.user = options.user || 'msfUser';
    this.password = options.password
    this.ssl = options.ssl || true;
    this.host = options.host || 'localhost';
    this.port = options.port || 55553
    try
    {
      //if credentials are wrong login failure will catch
      if (!options.token && !options.password)
      {
        throw new Error(errString('Must have a token or a password'));
      }
      else if (!options.token)
      {
        if (!options.password)
        {
          throw new Error(errString('If not authenticating with a token, must initialize with username and password'));
        } 
        else
        {
          this._login().then((token) => {this.token = token; return;},(err)=>{throw new Error(errString(err))})
        };
      } 
      else
      {
        this.token = options.token;
        return;
      };
    } 
    catch (err)
    {
      console.log(err);
      return;
    }
  }///end of constructor

  _rcpApiCall(cmd) {        
    // cooerce cmd into an array if it is not
    var cmdArray = (cmd instanceof Array) ? cmd : [cmd];
    // new promise for http request
    return new Promise(
      (resolve, reject) =>
        {
      try 
      {
        try
        { // msgpack encode cmd array
          var data = encode(cmdArray);
        }
        catch(err)
        {
          throw new Error(errString('msgpack encoding error\nDid you enter a password?'));
        }
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

        request.post(options,
        (err, res) =>
          {
            if (err)
            {
              reject(errString(`request error: ${err.code}`) );
            } 
            else 
            {
              // decode msgpak encoded body
              let decodedBody = decode(res.body);
              // translate respose 'string' Buffers to utf8 strings
              var translatedStrings = translateResponse(decodedBody);
              // if the body contains an RPC error, reject promise
              if (translatedStrings.error)
              {
                reject(errString(`RPC API error: ${translatedStrings.error_message}`));
              } 
              // OK RPC API responsed without an error - resolve promise
              else
              {
                resolve(translatedStrings);
              }
            }
          }
        );
      }
      catch(err)
      {
        reject(err);
      };
    }); //end promise
  }// end _rpcApiCall

  _login() {
    const cmd = ['auth.login', this.user, this.password];
    return new Promise(
    (resolve, reject) =>
      {
        if (this.token)
        {
          resolve(this.token);
        } 
        else 
        {
          this._rcpApiCall(cmd).then(
            function(res)
              {
                resolve(res.token);
              }, 
            function(err) 
            {
              reject(err);
            }
          )
        };
      }
    );
  } // end _login

  getToken() {
    const cmd = ['auth.token_generate'];
    return this.exec(cmd);
  }

  exec(args, token) {
    //add token as second item in array
    function addToken(token) {
      var arr = [];
      arr.push(args.shift());
      arr.push(token);
      if (args.length)
      {
        args.forEach(function(arg) {
          arr.push(arg);
        });
      };
      return arr;
    }
   
    if (token) 
    {
      let cmd = addToken(token)
      return this._rcpApiCall(cmd);

    }
    else
    {
      return this._login().then(addToken).then(this._rcpApiCall.bind(this))
    };

    }// end exec
}; // end class

export default MsfRpcClient




