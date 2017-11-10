const tbl = 'users',
      User = {

        remove: function(id){
            var sql  = `DELETE FROM ${tbl} WHERE user_id = ?`,
                data = [id];

            return new Promise( (resolve, reject) => {
                        db.query(sql, data, (err, result) => {
                            if( err ) reject(err); else resolve(result);
                        });
                   });
        },

        create: function(data){
            var sql  = `INSERT INTO ${tbl} (name, email, passwd) VALUES (?, ?, ?)`,
                data = [data.name, data.email, data.passwd];

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
        },

        getAll: function(limit, offset){
            if( !Number.isInteger(limit) )
                limit = 10;

            if( !Number.isInteger(offset) )
                offset = 0;

            var sql  = `SELECT * FROM ${tbl} LIMIT ?, ?`,
                data = [offset, limit];

            return new Promise( (resolve, reject) => {
                        db.query(sql, data, (err, result) => {
                            if( err ) reject(err); else resolve(result);
                        });
                   });
        }
    };

 module.exports = User;
