const express = require('express')
const app = express()

// 引入管理员路由
const adminuser = require('./router/adminuser')
const adminlogin = require('./router/adminlogin')

// 引入会员路由
const homeuser = require('./router/homeuser')

//引入商家路由
const adminshop = require('./router/adminshop')

//引入商家食品路由
const adminfoods = require('./router/adminfoods')

//引入订单路由
const admininfo = require('./router/admininfo')

// 引入首页路由
const adminindex = require('./router/adminindex')

//引入后台api模块
const api = require('./router/api')

app.use(express.static('node_modules'))
app.use(express.static('public'))
app.use(express.static('picloding'))

app.set('view engine','pug')
app.set('views','./views')

// 使用管理员路由
app.use('/admin',adminuser)
app.use('/admin',adminlogin)

// 使用会员路由
app.use('/admin',homeuser)

//使用商家路由
app.use('/admin',adminshop)

//使用商家食品路由
app.use('/admin',adminfoods)

//使用订单路由
app.use('/admin',admininfo)

//使用首页路由
app.use('/admin',adminindex)

//使用后台api模块
app.use('/admin',api)

app.listen(8000,()=>{
    console.log('running~~~')
})