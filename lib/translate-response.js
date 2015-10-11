
function translateResponse(responseObj){
 var responseLen = Object.keys(responseObj).length
 // if the response is either result: 'success', result: 'failure'
 if (responseObj.result && responseObj.token) {
      responseObj.result = responseObj.result.toString('utf8');
      responseObj.token = responseObj.token.toString('utf8');
      return responseObj
  } else if (responseObj.result){
    responseObj.result = responseObj.result.toString('utf8');
    return responseObj
  }
 // if only 1 key & is an array, such as db.workspaces, db.hosts, db.services
 // where the response is an object with a single key containing an array of objects eg workspaces: [{},{}] 
 if (responseLen === 1){
   var name = Object.keys(responseObj)[0]
   //{responseObj.workspaces.array}
   for(var i=0;i<responseObj[name].length; i++){
      // responseObj.workspaces.array[0]
      for(k in responseObj[name][i]){
       if(responseObj[name][i][k] instanceof Buffer){
        responseObj[name][i][k] = responseObj[name][i][k].toString('utf8');
       } else if (responseObj[name][i][k] instanceof Object) {
          for(key in responseObj[name][i][k]){
             if(responseObj[name][i][k][key] instanceof Buffer){
               responseObj[name][i][k][key] = responseObj[name][i][k][key].toString('utf8');
          };
        };
       };
      };
    };
    return responseObj[name];
 // else module.info, and module.options 
 } else {
    // module.info
    for(key in responseObj){
      //module.info.name & module.info.description
      if(responseObj[key] instanceof Buffer){
        responseObj[key] = responseObj[key].toString('utf8');
       // module.references OR module.authors
    } else if (Array.isArray(responseObj[key])){
       for (var i = 0; i < responseObj[key].length; i++) {
        // module.references
        if(Array.isArray(responseObj[key][i])){
          for (var ii = 0; ii < responseObj[key][i].length; ii++) { 
              responseObj[key][i][ii] = responseObj[key][i][ii].toString('utf8');
          }
        // module.authors
        } else {
          responseObj[key][i] = responseObj[key][i].toString('utf8');
        };
      };
    // module.options
    } else {
      for(k in responseObj[key]){
        //module.options.workspace.desc
        if (responseObj[key][k] instanceof Buffer){
          responseObj[key][k] = responseObj[key][k].toString('utf8');
        }
      }
    }
 };
 return responseObj;
};

};

module.exports = translateResponse