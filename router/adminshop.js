const express = require('express')
const adminshop = express.Router()

const mysql = require('../utils/db')

const bodyParser = require('body-parser')
adminshop.use(bodyParser.urlencoded({extended:false}))
adminshop.use(bodyParser.json())

// 引入formidable
const formidable = require('formidable')

// 引入阿里oss云储存
const co = require('co')

// 引入OSS模块
const OSS = require('ali-oss')

const fs = require('fs')

//设置OSS
const client = new OSS({
    region:'xxx',
    accessKeyId:'xxx',
    accessKeySecret:'xxx',
    bucket:'xxx'
})

const ali_oss = {
    bucket:'xxx',
    endPoint:"xxx"
}

const session = require('express-session')
adminshop.use(session({
	secret: 'keyboard cat',
	saveUninitialized: false, 
	resave: true ,
	cookie:{maxAge: 666666666}
}))

const checklogin = require('../utils/checklogin')

// 商家列表展示
adminshop.get('/shoplist',checklogin,(req,res)=>{
    let page = (req.query.page == undefined) ? 0 : req.query.page;
    //当前页
    let pages = parseInt(page) + 1;
    //获取起始数据 跳过指定页数前面的页数条数
    let startPage = page * 2;

    // 从数据库获取数据，然后渲染到show页面
    let count = 'select count(*) as count from shoplists';
    let sql = `select * from shoplists limit ${startPage},2`;

    mysql.query(count, function (error, results, fields) {
        if (error) throw error;
        // console.log(results);
        let countNum = results[0].count;
        mysql.query(sql, function (error, results, fields) {
            console.log(results)
            res.render('./adminshop/adminshoplist', {
                tittle:'商品列表界面',
                datas: results,
                count: countNum,
                page: page,
                pages: pages,
                session:req.session.uname
            });
        });

    })
})

//商家添加页面展示
adminshop.get('/shopadd',checklogin,(req,res)=>{
    res.render('adminshop/adminshopadd',{tittle:'商品添加页',session:req.session.uname})
})
// 商家添加操作
adminshop.post('/shopdoadd',checklogin,(req,res)=>{
    const form = formidable({
        keepExtensions:true,
        uploadDir:'./picloding',
        multiples:true
    })

    form.parse(req,(err,fields,files)=>{
        let {uname,content,fee} = fields
        let {newFilename,filepath} = files.logo
        // console.log(newFilename,filepath)

        // oss使用
        co(function* (){
            client.useBucket(ali_oss.bucket)

            var result = yield client.put(newFilename,filepath);

            fs.unlinkSync(filepath)

            res.end(JSON.stringify({status:'100',msq:'上传成功'}))
        }).catch((err)=>{
            res.end(JSON.stringify({
                status:'101',
                msg:'上传失败',
                error:JSON.stringify(err)
            }))
        })
        // console.log(uname,newFilename,content,fee)
        // console.log(files)
        // console.log(fields)
        let sql = `insert into shoplists (shopname,logo,content,fee) values('${uname}','${newFilename}','${content}','${fee}')`
        mysql.query(sql,(error,results,field)=>{
            let {affectedRows} = results
            if(affectedRows > 0){
                res.send(`<script>window.location.href="/admin/shoplist"</script>`)
            }
            else{
                res.send(`<script>window.location.href="/admin/shoplist"</script>`)
            }
        })
        
    })
   
})

// 商家删除操作
adminshop.get('/shopdel',checklogin,(req,res)=>{
    let {id} = req.query
    let sql = `delete from shoplists where id=${id}`
    mysql.query(sql,(error,results,fiels)=>{
        let {affectedRows} = results
        if(affectedRows > 0){
            res.send(`<script>window.location.href="/admin/shoplist"</script>`)
        }
        else{
            res.send(`<script>alert('删除失败');window.location.href="/admin/shoplist"</script>`)       
        }
    })
})

//商家更新界面
adminshop.get('/shopupdata',checklogin,(req,res)=>{
    let {id} = req.query
    let sql = `select * from shoplists where id = ${id}`
    mysql.query(sql,(error,results,files)=>{
        let [datas] = results
        // console.log(datas)
        res.render('adminshop/adminshopupdata',{tittle:'商家修改',datas:datas,session:req.session.uname})
    })
})

//商家更新操作
adminshop.post('/shopdoupdata',checklogin,(req,res)=>{
    const form = formidable({
        keepExtensions:true,
        uploadDir:'./picloding',
        multiples:true
    })

    form.parse(req,(err,fields,files)=>{
        let {uname,content,fee,id} = fields
        // console.log(files.logo)
        let {newFilename,filepath,size} = files.logo
        // console.log(newFilename,filepath,size)

        if(size) {
             // oss使用
            co(function* (){
                client.useBucket(ali_oss.bucket)

                var result = yield client.put(newFilename,filepath);

                fs.unlinkSync(filepath)

                res.end(JSON.stringify({status:'100',msq:'上传成功'}))
            }).catch((err)=>{
                res.end(JSON.stringify({
                    status:'101',
                    msg:'上传失败',
                    error:JSON.stringify(err)
                }))
            })
            // console.log(uname,newFilename,content,fee)
            // console.log(files)
            // console.log(fields)
            let sql = `update shoplists set shopname='${uname}',logo='${newFilename}',content='${content}',fee='${fee}' where id=${id}`
            mysql.query(sql,(error,results,field)=>{
                let {affectedRows} = results
                if(affectedRows > 0){
                    res.send(`<script>window.location.href="/admin/shoplist"</script>`)
                }
                else{
                    res.send(`<script>window.location.href="/admin/shoplist"</script>`)
                }
            })
        }else {
            let sql = `update shoplists set shopname='${uname}',content='${content}',fee='${fee}' where id=${id}`
            mysql.query(sql,(error,results,field)=>{
                let {affectedRows} = results
                if(affectedRows > 0){
                    res.send(`<script>window.location.href="/admin/shoplist"</script>`)
                }
                else{
                    res.send(`<script>window.location.href="/admin/shoplist"</script>`)
                }
            })
        }
       
        
    })
   
})






module.exports = adminshop