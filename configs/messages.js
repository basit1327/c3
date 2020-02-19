httpMessage = function(res, httpStatusCode, message , statusWithMessage){
    res.status(httpStatusCode);
    res.send({ "status" : httpStatusCode  , "message":message});
};


module.exports = Object.freeze({
    USER_NOT_AUTHORIZED: "You are not Authorized!",
    SESSION_EXPIRE: "You login session has expires",
    RE_LOGIN: "Please Login Again",
    MISSING : (field)=>{  + " is missing"},
    CANNOT_AUTHENTICATE: "Cannot Authenticate the User at the Moment",
    httpMessage: httpMessage,
});
