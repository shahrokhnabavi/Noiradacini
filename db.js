var mysql = require('mysql');
var connection = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'',
    database:'road'
});
module.exports = connection;

//
//
// con.connect(function(err) {
//     return;
//     if (err) throw err;
//
//     console.log("MySQL database connected!");
//
//     // Delete Table
//     var sql = "DROP TABLE IF EXISTS customers";
//     con.query(sql, function (err, result) {
//         if (err) throw err;
//         console.log("Table 'customers' deleted");
//     });
//
//     // Create Table
//     var sql = "CREATE TABLE IF NOT EXISTS customers (name VARCHAR(255), address VARCHAR(255))";
//     con.query(sql, function (err, result) {
//         if (err) throw err;
//         console.log("Table 'customers' created");
//     });
//
//     // Insert
//     var sql = "INSERT INTO customers (name, address) VALUES ?";
//     var values = [
//         ['John', 'Highway 71'],
//         ['Peter', 'Lowstreet 4'],
//         ['Amy', 'Apple st 652'],
//         ['Hannah', 'Mountain 21'],
//         ['Michael', 'Valley 345'],
//         ['Sandy', 'Ocean blvd 2'],
//         ['Betty', 'Green Grass 1'],
//         ['Richard', 'Sky st 331'],
//         ['Susan', 'One way 98'],
//         ['Vicky', 'Yellow Garden 2'],
//         ['Ben', 'Park Lane 38'],
//         ['William', 'Central st 954'],
//         ['Chuck', 'Main Road 989'],
//         ['Viola', 'Sideway 1633']
//     ];
//     con.query(sql, [values], function (err, result) {
//         if (err) throw err;
//
//         // {
//         //   fieldCount: 0,
//         //   affectedRows: 14,
//         //   insertId: 0,
//         //   serverStatus: 2,
//         //   warningCount: 0,
//         //   message: '\'Records:14  Duplicated: 0  Warnings: 0',
//         //   protocol41: true,
//         //   changedRows: 0
//         // }
//         console.log("Number of records inserted in to 'customers': " + result.affectedRows);
//     });
//
//
//     // Show
//     con.query("SELECT * FROM customers", function (err, result, fields) {
//         if (err) throw err;
//         console.log(result);
//     });
//
//     // SQL Injection - Way number one
//     var adr = 'Mountain 21';
//     var sql = 'SELECT * FROM customers WHERE address = ' + mysql.escape(adr);
//     con.query(sql, function (err, result) {
//         if (err) throw err;
//         console.log(result);
//     });
//
//     // SQL Injection - way number 2
//     var name = 'Amy';
//     var adr = 'Mountain 21';
//     var sql = 'SELECT * FROM customers WHERE name = ? OR address = ?';
//     con.query(sql, [name, adr], function (err, result) {
//         if (err) throw err;
//         console.log(result);
//     });
// });
