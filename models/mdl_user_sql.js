const tbl = 'users',
      User = {

        findByIdAndRemove: function(id){
            var sql  = `DELETE FROM ${tbl} WHERE user_id = ?`,
                data = [id];

            return runQuery(sql, data);
        },

        create: function(data){
            var sql  = `INSERT INTO ${tbl} (name, email, passwd) VALUES (?, ?, ?)`,
                data = [data.name, data.email, data.passwd];

            return runQuery(sql, data);
        },

        findByIdAndUpdate: function(id, data){
            if( data.passwd ){
                var sql  = `UPDATE ${tbl} SET name = ?, email = ?, passwd = ? WHERE user_id = ?`,
                    data = [data.name, data.email, data.passwd, id];
            } else {
                var sql  = `UPDATE ${tbl} SET name = ?, email = ? WHERE user_id = ?`,
                    data = [data.name, data.email, id];
            }

            return runQuery(sql, data);
        },

        getByEmailButNotSameId: function(email, id){
          var sql  = `SELECT * FROM ${tbl} WHERE email = ? AND user_id != ?`,
              data = [email, id];

          return new Promise( (resolve, reject) => {
                      db.query(sql, data, (err, result) => {
                          if( err ) reject(err); else resolve(result.pop());
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

        getById: function(id){
          var sql  = `SELECT * FROM ${tbl} WHERE user_id = ?`,
              data = [id];

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

            return runQuery(sql, data);
        }
    };

 module.exports = User;


 function runQuery( sql, data ){
     return new Promise( (resolve, reject) => {
                 db.query(sql, data, (err, result) => {
                     if( err ) reject(err); else resolve(result);
                 });
            });
 }
