function setCookie(name, value) {
    document.cookie = name + "=" + value ;
}

function getCookie(name) {

    var cookies = document.cookie;
    var list = cookies.split("; "); // 解析出名/值对列表

    for(var i = 0; i < list.length; i++) {
        var arr = list[i].split("="); // 解析出名和值
        if(arr[0] == name)
            return decodeURIComponent(arr[1]); // 对cookie值解码
    }

    return "";
}