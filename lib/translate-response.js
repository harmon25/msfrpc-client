//could probably do this with some kinda recursion, but whatever..cleaner than before...
function translateResponse(obj){
  for(var k in obj){
    if(obj[k] instanceof Array){
      for(var i=0;i<obj[k].length;i++){
        // just an array of strings
        if(obj[k][i] instanceof Buffer){
          obj[k][i] = obj[k][i].toString()
        } else {
          // and array of objects..
           for(var k1 in obj[k][i]){
            if(obj[k][i][k1] instanceof Buffer){
              obj[k][i][k1] = obj[k][i][k1].toString()
            }
           }
        }
      }
    } else if(obj[k] instanceof Buffer) {
      obj[k] = obj[k].toString()
    } else {
      for(var rk in obj[k]){
        if(obj[k][rk] instanceof Buffer){
          obj[k][rk] = obj[k][rk].toString()
        } else if(obj[k][rk] instanceof Array){
          for(var i=0;i<obj[k][rk].length;i++){
             if(obj[k][rk][i] instanceof Buffer){
               obj[k][rk][i] = obj[k][rk][i].toString()
             } else {
              obj[k][rk][i] = obj[k][rk][i];
             }
          }
        } 
      }
    }
  }
  return obj
}

module.exports = translateResponse