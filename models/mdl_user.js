var User = {
    checkLogin: function(data, callback){
        if( typeof callback === 'undefined') return 'Error: callback functio is empty';

        var sql = 'SELECT * FROM users WHERE email = ? OR password = ?';
        return db.query(sql, [data.email, data.password], callback);
    }
};
 module.exports = User;
