const mysql = require('mysql')
const DBCONFIG = require('../config/dbconfig')

const comm = mysql.createConnection({
    host:DBCONFIG.HOST,
    user:DBCONFIG.USER,
    password:DBCONFIG.PASSWORD,
    database:DBCONFIG.DATABASE
})

comm.connect()

module.exports = comm