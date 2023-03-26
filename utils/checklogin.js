function checklogin(req,res,next){
    res.setHeader('Content-Type','text/html;charset=utf-8')
    if(!req.session.uname){
        res.end(`<script>alert('请登录');window.location.href="/admin/login"</script>`)
    }
    else{
        next()
    }
}
module.exports = checklogin