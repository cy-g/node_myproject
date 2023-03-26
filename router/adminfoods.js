const express = require('express')
const adminfoods = express.Router()

const mysql = require('../utils/db')

const bodyParser = require('body-parser')
adminfoods.use(bodyParser.urlencoded({extended:false}))
adminfoods.use(bodyParser.json())

const session = require('express-session')
adminfoods.use(session({
	secret: 'keyboard cat',
	saveUninitialized: false, 
	resave: true ,
	cookie:{maxAge: 666666666}
}))

const formidable = require('formidable')

const co = require('co')

// 引入OSS模块
const OSS = require('ali-oss')

const fs = require('fs')

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

const checklogin = require('../utils/checklogin')

//商家食品展示列表
adminfoods.get('/foodslist',checklogin,(req,res)=>{
	let sql = `select goods.id,goods.foodname,goods.descr,goods.price,goods.foodpic,shoplists.shopname from goods,shoplists where goods.shoplist_id = shoplists.id`
    mysql.query(sql,(error,results,field)=>{
        // console.log(results)
        res.render('adminfoods/adminfoodslist',{tittle:'商家食品列表',data:results,session:req.session.uname})
    })
})

// 商家食品删除
adminfoods.get('/foodsdel',checklogin,(req,res)=>{
	let {id} = req.query
	let sql = `delete from goods where id=${id}`
    mysql.query(sql,(error,results,fiels)=>{
        let {affectedRows} = results
        if(affectedRows > 0){
            res.send(`<script>window.location.href="/admin/foodslist"</script>`)
        }
        else{
            res.send(`<script>alert('删除失败');window.location.href="/admin/foodslist"</script>`)       
        }
    })
})

//商家食品添加页面
adminfoods.get('/foodsadd',checklogin,(req,res)=>{
	let sql = `select shopname,id from shoplists`
	mysql.query(sql,(error,results,fileds)=>{
		res.render('adminfoods/adminfoodsadd',{tittle:'食品添加页',data:results,session:req.session.uname})
	})
})

//商家食品添加操作
adminfoods.post('/foodsdoadd',checklogin,(req,res)=>{
    const form = formidable({
        keepExtensions:true,
        uploadDir:'./picloding',
        multiples:true
    })

    form.parse(req,(err,fields,files)=>{

		// console.log(files)
        let {foodname,descr,price,shoplist_id} = fields
        let {newFilename,filepath} = files.foodpic
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
        let sql = `insert into goods (foodname,descr,price,shoplist_id,foodpic) values('${foodname}','${descr}','${price}',${shoplist_id},'${newFilename}')`
        mysql.query(sql,(error,results,field)=>{
            let {affectedRows} = results
            if(affectedRows > 0){
                res.send(`<script>window.location.href="/admin/foodslist"</script>`)
            }
            else{
                res.send(`<script>window.location.href="/admin/foodslist"</script>`)
            }
        })
        
    })
   
})

// 商家食品修改页面
adminfoods.get('/foodsupdata',checklogin,(req,res)=>{
    let {id} = req.query
    let sql = `select * from goods where id = ${id}`
    let sql2 = `select shopname,id from shoplists`
    mysql.query(sql,(error,results,files)=>{
        let [datas] = results
        // console.log(datas)
        mysql.query(sql2,(err,data,feils)=>{

            let shop = data
            res.render('adminfoods/adminfoodsupdata',{tittle:'食品修改',datas:datas,shop:shop,session:req.session.uname})
        })
        
    })
})

//商家食品修改操作
adminfoods.post('/foodsdoupdata',checklogin,(req,res)=>{
    const form = formidable({
        keepExtensions:true,
        uploadDir:'./picloding',
        multiples:true
    })

    form.parse(req,(err,fields,files)=>{
        let {foodname,descr,price,id,shoplist_id} = fields

        // console.log(fields)
        let {newFilename,filepath,size} = files.foodpic
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
            let sql = `update goods set foodname='${foodname}',descr='${descr}',price=${price},shoplist_id=${shoplist_id},foodpic='${newFilename}' where id=${id}`
            mysql.query(sql,(error,results,field)=>{

                // console.log(results)
                let {affectedRows} = results
                if(affectedRows > 0){
                    res.send(`<script>window.location.href="/admin/foodslist"</script>`)
                }
                else{
                    res.send(`<script>window.location.href="/admin/foodslist"</script>`)
                }
            })
        }else {
            let sql = `update goods set foodname='${foodname}',descr='${descr}',price=${price},shoplist_id=${shoplist_id} where id=${id}`
            mysql.query(sql,(error,results,field)=>{
                let {affectedRows} = results
                if(affectedRows > 0){
                    res.send(`<script>window.location.href="/admin/foodslist"</script>`)
                }
                else{
                    res.send(`<script>window.location.href="/admin/foodslist"</script>`)
                }
            })
        }
       
        
    })
})


module.exports = adminfoods