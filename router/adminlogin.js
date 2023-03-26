const express = require('express')
const adminlogin = express.Router()

const bodyParser = require('body-parser')
adminlogin.use(bodyParser.urlencoded({extended:false}))
adminlogin.use(bodyParser.json())

const getSha1 = require('../utils/getsha1')

const mysql = require('../utils/db')

const session = require('express-session')
adminlogin.use(session({
	secret: 'keyboard cat',
	saveUninitialized: false, 
	resave: true ,
	cookie:{maxAge: 666666666}
}))

// 显示登录界面
adminlogin.get('/login',(req,res)=>{
    res.render('adminlogin/adminlogin',{tittle:'登录界面'})
})

//判断是否是管理员后登录
adminlogin.post('/dologin',(req,res)=>{
    // console.log(req.body)
    let {uname,pwd} = req.body
    pwd = getSha1(pwd)
    let sql = `select * from admin_users where uname='${uname}'`
    mysql.query(sql,(error,results,files)=>{
        // console.log(results)
        if(results.length <= 0){
            res.send(`<script>alert('用户名不存在');window.location.href="/admin/login"</script>`)
        }else{
            if(pwd !== results[0].pwd){
                res.send(`<script>alert('密码错误');window.location.href="/admin/login"</script>`)
            }else {
                req.session.uname = uname
                res.send(`<script>alert('登录成功');window.location.href="/admin/index"</script>`)
            }
        }
    })
})

// 点击退出登录
adminlogin.get('/loginout',(req,res)=>{
    req.session.uname = ''
    res.send(`<script>window.location.href="/admin/login"</script>`)
})


module.exports = adminlogin