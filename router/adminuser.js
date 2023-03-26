const express = require('express')
const adminuser = express.Router()
const mysql = require('../utils/db')

const bodyParser = require('body-parser')
adminuser.use(bodyParser.urlencoded({extended:false}))
adminuser.use(bodyParser.json())

// 引入密码加密方法
const getSha1 = require('../utils/getsha1')
// console.log(getSha1)

const session = require('express-session')
adminuser.use(session({
	secret: 'keyboard cat',
	saveUninitialized: false, 
	resave: true ,
	cookie:{maxAge: 666666666}
}))

const checklogin = require('../utils/checklogin')

// 管理员添加页面
adminuser.get('/useradd',checklogin,(req,res)=>{
   
    res.render('adminuser/adminuseradd',{tittle:'管理员添加页',session:req.session.uname})
})
// 管理员添加提交数据处理
adminuser.post('/userdoadd',checklogin,(req,res)=>{
    // console.log(req.body)
    let {uname,pwd} = req.body
    pwd = getSha1(pwd)
    // console.log(pwd)
    let sql = `insert into admin_users (uname,pwd) values('${uname}','${pwd}')`
    mysql.query(sql,(error,results,field)=>{
        // console.log(results)
        let {affectedRows} = results
        if(affectedRows > 0){
            res.send(`<script>window.location.href="/admin/userlist"</script>`)
        }
        else{
            res.send(`<script>window.location.href="/admin/useradd"</script>`)
        }
    })
})

// 管理员展示页面
adminuser.get('/userlist',checklogin,(req,res)=>{

    let sql = `select * from admin_users order by id desc`
    mysql.query(sql,(error,results,field)=>{
        // console.log(results)
        // let [data] = results
        // console.log(data)
        res.render('adminuser/adminuserlist',{tittle:'管理员列表页',data:results,session:req.session.uname})
    })
})

// 删除操作
adminuser.get('/userdel',checklogin,(req,res)=>{
    // console.log(req.query)
    let {id} = req.query
    let sql = `delete from admin_users where id=${id}`
    mysql.query(sql,(error,results,fiels)=>{
        // console.log(results)
        let {affectedRows} = results
        if(affectedRows > 0){
            res.send(`<script>window.location.href="/admin/userlist"</script>`)
        }
        else{
            res.send(`<script>alert('删除失败');window.location.href="/admin/userlist"</script>`)       
        }
    })
})

//显示修改界面
adminuser.get('/userupdata',checklogin,(req,res)=>{
    let {id} = req.query
    let sql = `select * from admin_users where id = ${id}`
    mysql.query(sql,(error,results,files)=>{
        let [datas] = results
        // console.log(datas)
        res.render('adminuser/adminuserupdata',{tittle:'管理员修改',datas:datas,session:req.session.uname})
    })
})

//修改操作
adminuser.post('/userdoupdata',checklogin,(req,res)=>{
    let {uname,pwd,id} = req.body
    // console.log(uname,pwd,id)
    pwd = getSha1(pwd)
    let sql = `update admin_users set uname='${uname}',pwd='${pwd}' where id = ${id}`
    mysql.query(sql,(error,results,fiels)=>{
        // console.log(results)
        let {affectedRows} = results
        if(affectedRows > 0){
            res.send(`<script>window.location.href="/admin/userlist"</script>`)
        }
        else{
            res.send(`<script>alert('修改失败');window.location.href="/admin/userlist"</script>`)       
        }
    })
})





module.exports = adminuser