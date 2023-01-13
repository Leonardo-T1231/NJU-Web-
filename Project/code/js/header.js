var header = document.getElementById("header");
console.log(header);
header.innerHTML =
'<div class="box-top">\n' +
'        <ul class="top-ui">\n' +
'            <li class="home">\n' +
'                <a href="firstPage.html"><strong>首页</strong></a>\n' +
'            </li>\n' +
'\n' +
'            <li class="userInfo">\n' +
'                <strong id="userName"></strong>\n' +
'                <button id="quit" onclick="quit()"><strong>退出登录</strong></button>\n' +
'            </li>\n' +
'\n' +
'            <li class="login">\n' +
'                <a href="login.html"><strong>登录/注册</strong></a>\n' +
'            </li>\n' +
'\n' +
'            <li class="modeChange">\n' +
'                <strong>夜间模式</strong>\n' +
'                <label class="switch">\n' +
'                    <input type="checkbox" onclick="changeMode()">\n' +
'                    <span class="slider"></span>\n' +
'                </label>\n' +
'            </li>\n' +
'        </ul>\n' +
'    </div>'

function changeMode() {
    var body = document.body;
    var header = document.getElementById("header")
    body.classList.toggle("dark");
    header.classList.toggle("dark");
}

function isLogged() {
    let userName = getCookie('userName');
    return userName !== '';
}

window.onload = function () {
    document.getElementById('userName').innerText = getCookie('userName');
}

function quit() {
    document.cookie = 'userName=';
    window.location = '../html/firstPage.html';
    window.reload();
}
