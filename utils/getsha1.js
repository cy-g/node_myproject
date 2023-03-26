const crypto = require('crypto')

module.exports = function getSha1(pwd){
    let sha1 = crypto.createHash('sha1')
    sha1.update(pwd)
    var res = sha1.digest('hex')
    return res
}