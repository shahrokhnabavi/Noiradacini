module.exports = {
    pathUserSession: (req, res, next) => {
        res.locals.user = req.session.user;
        // res.locals.user = {name: 'DEBUG MODE'};

        if (!req.userAuth) {
            req.userAuth = _userAuth;
        }

        if (!req.msgFlash) {
            req.setFlash = _setMsgFlash;
            req.getFlash = _getMsgFlash;
        }
        next();
    }
}

// User Authentication
function _userAuth(redirect, loggedin) {
    // return false; //DEBUG MODE

    if (this.session === undefined) throw Error('req.userAuth() requires sessions');

    if( !loggedin && !this.session.user ){
        if( Number.isInteger(redirect) && redirect > 400)
            res.status(redirect).send('You should login');

        if( redirect )
            this.res.redirect(redirect);
    }

    if( loggedin && this.session.user ){
        if( redirect )
            return this.res.redirect(redirect);
    }
    return loggedin ? this.session.user : !this.session.user;
}


// Set Flash Messages
function _setMsgFlash(type, msg) {
    if (this.session === undefined) throw Error('req.msgFlash() requires sessions');

    var msgObj = this.session.msg ? this.session.msg : {};

    if( msgObj.hasOwnProperty(type) )
        msgObj[type].push(msg);
    else {
        msgObj[type] = (typeof msg === 'object') ? msg : [msg];
    }
    this.session.msg = msgObj;
}

// Get Flash Messages
function _getMsgFlash(type) {
    if (this.session === undefined) throw Error('setMsgFlash() requires sessions');

    if( !this.session.msg ) return null;
    if( !this.session.msg[type] ) return null;

    var msgReturn = this.session.msg[type];
    delete this.session.msg[type];
    return msgReturn;
}
