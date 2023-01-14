let http = require("http");
let url = require("url");
let querystring = require("querystring");
let fs = require("fs");
let Md5 = require("./md5");

http.createServer(function (req, res) {
    res.setHeader("Access-Control-Allow-Origin","*");

    var pathName = url.parse(req.url).pathname;     //解析地址栏地址
    var body = '';

    req.addListener('data', function(chunk) {    //接受post参数并赋值给body
        body += chunk;
    });
    req.addListener('end', function () {
        body = querystring.parse(body);
        console.log(body);

        if (body) {
            fs.readFile('../userInfo.txt', 'utf-8', function (err, data) {
                if (err) {
                    console.log("文件读取失败");
                    return;
                }
                console.log("读取文件成功");

                let arr = [];
                if (data) {
                    console.log("文件中有数据");
                    arr = JSON.parse(data);
                }

                if (pathName === "/login") {
                    let obj = find(arr, body);
                    if (obj) {
                        if (obj.password === Md5.md5(body.password)) {
                            res.end(obj.username);
                            return true;
                        } else {
                            res.end("密码错误!");
                            return false;
                        }
                    } else {
                        res.end("该用户不存在!");
                        return;
                    }
                } else if (pathName === '/register') {
                    let obj = find(arr, body);
                    if (obj) {
                        res.end("该用户已存在!");
                        return false;
                    } else {
                        obj = {};
                        obj.username = body.username;
                        obj.password = Md5.md5(body.password);
                        obj.email = body.email;
                        arr.push(obj);
                        fs.writeFileSync("../userInfo.txt", JSON.stringify(arr), "utf-8");
                        res.end("注册成功!");
                    }
                }
            })
        }
    });


}).listen(3000, function (err) {
    if (!err) {
        console.log('服务器开启成功，port:3000');
    }
});

function find(arr, user) {
    for (let i = 0; i < arr.length; i++) {
        let obj = arr[i];
        if (obj.email === user.email) {
            return obj;
        }
    }

    return null;
}