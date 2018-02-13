const mysql = require('mysql');

function executeQuery(query, values, callback) {
    const con = mysql.createConnection(
        // connection details
        {
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'supermarket'
        }
    );

    // 3.cconnect
    con.connect(function (err) {
        if (err) {
            console.log('Error connecting to DB:' + err);
            return;
        }
        console.log('Connected');
    });

    // 4. crud : insert
    // use backtick `` for free text
    con.query(query, values, function (err, rows) {
        if (err) {
            callback(err);
        } else {
            callback(null, rows)
            /*rows.forEach(function (row) {
                arr.push(row);
            });*/
        }
    });
    con.end();
}

module.exports.executeQuery = executeQuery;