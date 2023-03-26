const express = require('express')
const homeuser = express.Router()
const mysql = require('../utils/db')

const bodyParser = require('body-parser')
homeuser.use(bodyParser.urlencoded({extended:false}))
homeuser.use(bodyParser.json())

const session = require('express-session')
homeuser.use(session({
	secret: 'keyboard cat',
	saveUninitialized: false, 
	resave: true ,
	cookie:{maxAge: 666666666}
}))

const checklogin = require('../utils/checklogin')

// 加载会员列表界面
homeuser.get('/homeuserlist', checklogin,(req,res)=>{
    let sql = `select * from users order by id desc`
    mysql.query(sql,(error,results,field)=>{
        res.render('homeuser/homeuserlist',{tittle:'会员列表页',data:results,session:req.session.uname})
    })
})

// 会员详细信息界面
homeuser.get('/homeuserinfo', checklogin,(req,res)=>{
    // console.log(req.query)
    let {username} = req.query
    let sql = `select * from user_info where userinfo_name = '${username}'`
    mysql.query(sql,(error,results,field)=>{
        // console.log(results)
        res.render('homeuser/homeuserinfo',{tittle:'会员详情',data:results[0],session:req.session.uname})
    })
})

homeuser.get('/homeuserwhere', checklogin,(req,res)=>{
    // console.log(req.query)
    let {uname} = req.query
    let sql = `select * from address where username = '${uname}'`
    mysql.query(sql,(error,results,field)=>{
        // console.log(results)
        res.render('homeuser/homeuserwhere',{tittle:'收货地址',data:results,session:req.session.uname})
    })
})

module.exports = homeuser