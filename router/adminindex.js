const express = require('express')
const adminindex = express.Router()

const mysql = require('../utils/db')

const checklogin = require('../utils/checklogin')

//首页数据化展示
adminindex.get('/index',checklogin,(req,res)=>{
    let data = []

    let sql1 = `select count(*) as adminuser_num from admin_users`

    mysql.query(sql1,(error,results,feilds)=>{
    //    console.log(results[0].adminuser_num)
        data.push(results[0].adminuser_num)
        let sql2 = `select count(*) as user_num from users`
        mysql.query(sql2,(error,results,feilds)=>{
            data.push(results[0].user_num)
            let sql3 = `select count(*) as shop_num from shoplists`
            mysql.query(sql3,(error,results,feilds)=>{
                data.push(results[0].shop_num)
                let sql4 = `select count(*) as info_num from orders`
                mysql.query(sql4,(error,results,feilds)=>{
                    data.push(results[0].info_num)
                    // console.log(data)
                    res.render('adminindex/adminindex',{tittle:'后台首页',data:data,session:req.session.uname})
                })
            })
        })
    })
})

module.exports = adminindex