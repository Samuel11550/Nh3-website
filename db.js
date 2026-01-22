const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'database-5019422215.webspace-host.com', 
    user: 'dbu2275139',                            
    password: 'sMARAGDD1!!!',              
    database: 'dbs15193604',                       
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = db;