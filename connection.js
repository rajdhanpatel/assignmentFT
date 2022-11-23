const mysql = require('mysql');
const con = mysql.createConnection({
    hostname:process.env.hostname,
    user:process.env.user,
    password:'',
    database:process.env.database
    
});
con.connect((err)=>{
    if(err) throw err;
    else console.log('connection done');
});

module.exports.con = con;