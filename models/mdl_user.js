const tbl = 'users',
      User = {
        checkLogin: function(email, passwd){
            var sql  = `SELECT * FROM ${tbl} WHERE email = ? OR password = ?`,
                data = [email, passwd];

            return new Promise( (resolve, reject) => {
                        db.query(sql, data, (err, result) => {
                            if( err ) reject(err); else resolve(result);
                        });
                   });
        },

        getByEmail: function(email){
            var sql  = `SELECT * FROM ${tbl} WHERE email = ?`,
                data = [email];

            return new Promise( (resolve, reject) => {
                        db.query(sql, data, (err, result) => {
                            if( err ) reject(err); else resolve(result.pop());
                        });
                   });
        }
    };

 module.exports = User;
