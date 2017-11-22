module.exports = {
    pathUserSession: (req, res, next) => {
        res.locals.user = req.app.configs.debug ? {name: 'DEBUG MODE'} : req.session.user;

        if (!req.userAuth) {
            req.userAuth = req.app.configs.debug ? () => false : _userAuth;
        }

        if (!req.msgFlash) {
            req.setFlash = _setMsgFlash;
            req.getFlash = _getMsgFlash;
        }

        if (!res.dateFormat) {
            res.locals.dateFormat = _dateFormat;
        }
        next();
    },
    configs: {
        debug: false,
        admPerPage: 10
    }
}

// Date Format
function _dateFormat(strDate, type = 0, sepDate = '-', sepTime = ':') {
    var fillZero = num => { return (num<10) ? '0'+num : num; },
        mL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        mS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

    if( strDate === 'now' ){
        var date = new Date();
    } else {
        var date = new Date(strDate);
    }

    var day   = fillZero(date.getDate()),
        year  = date.getFullYear(),
        month = date.getMonth(),
        hour = fillZero(date.getHours()),
        minutes = fillZero(date.getMinutes()),
        second = fillZero(date.getSeconds());

        switch(type){
            case 0:
                return year + sepDate + fillZero(month+1) + sepDate + day + ' ' +
                       hour + sepTime + minutes + sepTime + second;
            case 1:
                return day + ' ' + mL[month] + ', ' + year;
            case 2:
                return hour + sepTime + minutes + sepTime + second;
            case 3:
                return year + sepDate + fillZero(month+1) + sepDate + day + ' ' + hour + sepTime + minutes;
            case 4:
                return mL[month]  + ' ' + day+ ', ' + year;
            default:
                return 'not valid';
        }
}

// User Authentication
function _userAuth(redirect, loggedin) {
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
