const tbl = 'settings',
      Setting = {
        findByIdAndUpdate: function(id, data){
          var sql  = `UPDATE ${tbl} SET setting_value = ? WHERE setting_id = ?`,
              data = [data.setting_value, id];

          return runQuery(sql, data);
        },

        create: function(data){
            var sql  = `INSERT INTO ${tbl} (setting_key, setting_value) VALUES (?, ?)`,
                data = [data.setting_key, data.setting_value];

            return runQuery(sql, data);
        },

        getByField: function(field, value){
          var sql  = `SELECT * FROM ${tbl} WHERE ${field} = ?`,
              data = [value];

          return new Promise( (resolve, reject) => {
                      db.query(sql, data, (err, result) => {
                          if( err ) reject(err); else resolve(result.pop());
                      });
                 });
        },

        getAll: function(){
            var sql  = `SELECT * FROM ${tbl}`;

            return new Promise( (resolve, reject) => {
                        db.query(sql, (err, result) => {
                            if( err ) reject(err); else resolve(result);
                        });
                   });
        }
    };

 module.exports = Setting;


function runQuery( sql, data ){
  return new Promise( (resolve, reject) => {
              db.query(sql, data, (err, result) => {
                  if( err ) reject(err); else resolve(result);
              });
         });
}
