const mysql = require('mysql');

const pool  = mysql.createPool({
    connectionLimit: 10,
    host: "ixnzh1cxch6rtdrx.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "lrcef9yr2sbconn8",
    password: "auaj873gdtrtbcbd",
    database: "n6jqz3zqnap6nxs1"
});

module.exports = pool;
