var http = require('http');                    //引入http
var querystring = require('querystring');
var util = require('util');
var url = require('url');                      //引入url
var fs = require('fs');                        //引入文件管理
var mysql = require('mysql');     //引入mysql模块

var mysql_user = {                 //编写数据库链接数据
    host: 'localhost',         //地址
    user: 'root',              //用户名
    password: 'root',              //密码
    database: 'picture_web'         //要链接的数据库名字
};

var connection = mysql.createConnection(mysql_user);    //建立数据库链接
connection.connect(function(err) {                     //链接数据库
    if (err) {      //链接错误执行
        console.log('[错误]' + err);
        connection.end();
        return;
    };
    console.log('链接成功');    //否则链接成功
});

var Event = require('events').EventEmitter;    //引入事件模块
var query = new Event();                       //创建事件对象

//绑定login事件  传入 username password  链接数据库对象
query.on('login', function(email, password, connection) {
//编写sql查询语句;
    var find = "SELECT * FROM users WHERE email = '" + email + "'";
//执行sql语句
    connection.query(find, function(err, result) {
        if (err) {   //链接失败 直接return;
            console.log('[错误]' + err);
            return;
        };

        if (result.length) {   //如果查到了数据
            console.log('------------start----------------');
            var string = JSON.stringify(result);
            var json = JSON.parse(string)[0];
            console.log(string)
            if (json.password == password) {
                console.log('密码校验正确');
                window.location = '../html/firstPage.html';
            } else {
                console.log('密码校验错误');
            }
            console.log('--------------end-----------------');
        } else {
            console.log('账号不存在')
        }
    })
})

//定义注册事件
query.on('register', function(email, password, connection) {
//编写查询语句
    var find = "SELECT * FROM users WHERE email = '" + email + "'";
//编写添加语句
    var insert = 'INSERT INTO users (email, password) VALUES (?,?)';
//执行sql语句
    connection.query(find, function (err, result) {
        if (err) {   //链接失败 直接return;
            console.log('[错误]' + err);
            return;
        }
        ;

        if (result.length) {   //如果数据库返回数据 说明账号已存在
            console.log('账号已存在');
            return;
        } else {               //否则不存在   可以进行注册
            var inserInfo = [email, password];  //定义插入数据
            //执行插入数据语句
            connection.query(insert, inserInfo, function (err, result) {
                if (err) {   //链接失败 直接return;
                    console.log('[注册错误]' + err);
                    return;
                }
                ;
                console.log('------------start----------------');
                console.log('注册成功');
                console.log(result);
                console.log('--------------end-----------------');
            });
        }
        ;
    });
});


http.createServer(function(req, res) {
    res.setHeader("Access-Control-Allow-Origin","*");
    if (req.url == '/favicon.ico') {
        return;     //加载图标也会被当做一次http请求
    };
    var pathname = url.parse(req.url).pathname;     //解析地址栏地址
    var body = '';

    req.addListener('data', function(chunk) {    //接受post参数并赋值给body
        body += chunk;
    });
    req.addListener('end', function () {
        body = querystring.parse(body);
    });

    //使用fs文件管理读取相对应文件
    fs.readFile(pathname.substring(1) + '.html', function(err, data) {
        if (err) {   //如果错误存在说明文件不存在
            res.writeHead(404, {
                'Content-Type': 'text/html; charset=utf-8'
            });
            res.write('404页面不存在');
        } else {   //否则文件读取成功
            res.writeHead(200, {
                'Content-Type': 'text/html; charset=urf-8'
            });

            console.log(body);
            if (body) {    //如果body存在 说明进行了post请求
                console.log(pathname);
                switch (pathname) {   //判断登录还是注册
                    case '/login':   //执行登录事件   并传入对应参数
                        query.emit('login', body.email, body.password, connection);
                        break;
                    case '/register':  //执行注册事件   并传入对应参数
                        query.emit('register', body.email, body.password, connection);
                        break;
                }
            };

            res.write(data);   //写入文件
        };
        res.end();
    })
}).listen(3000);


