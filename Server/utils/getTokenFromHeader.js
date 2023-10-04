getTokenFromHeader=req=>{

   const headerObj= req.headers;
    const token = headerObj['authorization'].split(" ")[1];
    
    if(token!==undefined){
        return token;
    }
    else{
        return {
            status:'failes',
            message:'There is no token attached to header'
        }
    }
}

module.exports =getTokenFromHeader;