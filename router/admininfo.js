const express = require('express')
const admininfo = express.Router()

const mysql = require('../utils/db')

const session = require('express-session')
admininfo.use(session({
	secret: 'keyboard cat',
	saveUninitialized: false, 
	resave: true ,
	cookie:{maxAge: 666666666}
}))

const bodyParser = require('body-parser')
admininfo.use(bodyParser.urlencoded({extended:false}))
admininfo.use(bodyParser.json())

const checklogin = require('../utils/checklogin')

//订单页面展示
admininfo.get('/infolist',checklogin,(req,res)=>{
    let sql = `select orders.id,orders.order_num,orders.food_totalprice,orders.username,address.phone,address.address from orders,address where orders.address_id = address.id`
    mysql.query(sql,(error,results,field)=>{
        res.render('admininfo/admininfolist',{tittle:'商品列表界面',data:results,session:req.session.uname})
    })
})

//订单详细信息展示
admininfo.get('/infodet',checklogin,(req,res)=>{
    let {id} = req.query
    let sql = `select * from orders_goods where orders_id = ${id}`
    mysql.query(sql,(error,results,field)=>{
        res.render('admininfo/admininfodet',{tittle:'商品详情',data:results,session:req.session.uname})
    })
})

module.exports = admininfo