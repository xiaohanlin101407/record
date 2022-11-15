function getEncode64(str) { return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function toSolidBytes(match, p1) { return String.fromCharCode('0x' + p1); })); }
function getDecode64(str) { return decodeURIComponent(atob(str).split('').map(function (c) { return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2); }).join('')); }
function filename_() { return document.getElementsByName("upload_file")[0].value.split("\\").pop() }
function change() { document.getElementsByName("filename")[0].value = filename_(); }
function selected() { document.getElementsByName("hover")[0].innerHTML = filename_(); }
function val_name(name) { return document.getElementsByName(name)[0].value; }
function checkedRadio(name) {
    var radio = document.getElementsByName(name);
    for (i = 0; i < radio.length; i++) {
        if (radio[i].checked) { return i; }
    }
}
function escape2Html(str) {
    var arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' };
    return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) { return arrEntities[t]; });
}
function submitLogin() {
    $.ajax({
        type: "GET",
        url: "/loginAction/",
        data: {
            'username': val_name('username'),
            "password": val_name("password"),
            "accountType": checkedRadio("accountType")
        },
        success: function (status, data) {
            console.log(status);
            if (status[0] == "<") {
                window.location.href = ("/");
            } else {
                alert(status.data);
            }
        },
        error: function () {
            alert("异常！");
        }
    });
}
function submitPlan() {
    $.ajax({
        type: "GET",
        url: "/planAction/",
        data: {
            "csrfmiddlewaretoken": document.getElementsByName("csrfmiddlewaretoken")[0].value,
            "content": getEncode64(document.getElementsByName("content")[0].value.replace(new RegExp("\n", "g"), "<br>")),
            "date": document.getElementsByName("date")[0].value,
        }
    })
}
function submitMarkdown(title, content) {
    $.ajax({
        type: "POST",
        url: "/uploadMarkdownAction/",
        data: {
            "csrfmiddlewaretoken": document.getElementsByName("csrfmiddlewaretoken")[0].value,
            "title": title,
            "content": getEncode64(content)
        },
        success: function () {
            alert("已上传！");
        }
    })
}
function submitRegister() {
    $.ajax({
        type: "GET",
        url: "/registerAction/",
        data: $('#Register').serialize(),
        success: function (status, data) {
            console.log(status);
            if (status[0] == "<" || status.data == "Created") {
                window.location.href = ("/");
            } else {
                alert(status.data);
            }
        },
        error: function () {
            alert("异常！");
        }
    });
}
function getPunishment(id) {
    if (document.getElementById("Punishment").innerHTML != "NULL") {
        alert("不能修改已存在的惩罚"); return;
    }
    var type = 1;
    $.ajax({
        type: "GET",
        url: "/Dares?type=" + type,
        success: function (data) {
            ans = getDecode64(data.data);
            $.ajax({
                type: "GET",
                url: "/planUpdate/?id=" + id + "&punishment=" + ans,
                success: function (status) {
                    console.log(status);
                    if (status.code == 401) {
                        alert("不能修改非自己的计划！")
                    } else {  
                        document.getElementById("Punishment").innerHTML = ans;
                    }
                }
            });
        },
        error: function () {
            alert("异常！");
        }
    })
}
function t(e){
    return "<td>"+e+"</td>";
}
function jumpto(l){
    l=getDecode64(l);
    console.log(l);
    top.location= l;
}
function getLine(StringArray){
    var res="";
    for(var i=0;i<StringArray.length;i++){
        res+=t(StringArray[i]);
    }
    return "<tr>"+res+"</tr>";
}
function parse(){
    lines=document.getElementById("content").innerHTML.split("\n");
    var ans="";
    for(var i=0;i<lines.length;i++){
        array=lines[i].split("|");
        array[2]='<a href="/blogView?id='+array[2]+'">点击看这篇博客</a>'
        ans+=getLine(array);
    }
    document.getElementById("display").innerHTML=ans;
}
function loadPlans(){
    lines=document.getElementById("content").innerHTML.split("\n");
    for(var i=0;i<lines.length;i++){
        k=lines[i].split("|");
        r+=t(k[0])+t(k[1]);
        k[2]=k[2].replace(new RegExp("&lt;br&gt;", "g"), "<br>");
        switch(k[3]){
            case "NULL":
                k[3]="<label>目前此任务无关联文件</label>";
                break;
            case "/downloadAction?name=Li91cGxvYWQvNS9zdWNjZXNzLnR4dA==":
                k[3]="<label>任务完成，无惩罚</label>";
                break;
            default:
                k[3]='<a href="'+k[3]+'">点击下载</a>';
                break;
        }
        link='jumpto("'+getEncode64( "/planModify?id="+k[5])+'")';
        k[5]='<button onclick="'+link+'" class="modifyBtn">修改计划</button>';
        document.getElementById("display").innerHTML+=getLine(k);
    }
}
function getContent(id) {
    content = document.getElementsByName("Content")[0].value.replace(new RegExp("\n", "g"), "<br>");
    console.log(content);
    $.ajax({
        type: "GET",
        url: "/planUpdate/?id=" + id + "&content=" + getEncode64(content)
    });
    console.log(content);
    document.getElementById("ViewContent").innerHTML = content;
}

function getFile(id) {
    filename = "/downloadAction?name=Li91cGxvYWQvNS9zdWNjZXNzLnR4dA==";
    $.ajax({
        type: "GET",
        url: "/planUpdate/?id=" + id + "&LinkedFile=" + btoa(filename),
        success: function (status) {
            if (status.code == 200) {
                document.getElementById("LinkedFile").innerHTML='<a href="'+filename+'">点击下载</a>';
            } alert("上传成功！")
        }
    })
}
function addHeader(user) {
    document.write('<header style="top:10%;"><a href="http://39.108.234.61/blogView/?id=9" class="header">&#12288;更新日志</a><a href="/login/" class="header">&#12288;登录</a><a href="/logout/" class="header">&#12288;登出</a><a href="/register/" class="header">&#12288;注册</a><a class="header" href="/IndexUser/">&#12288;目前用户:' + user + '</a><a href="/" class="header">&#12288;回到首页</a><a href="/blogView/?id=9" style="color:blue;">网站公告：blog支持</a></header>');
}
function deletePlan(id) {
    $.ajax({
        type: "GET",
        url: "/planDelete/?id=" + id,
        success: function (status) {
            if (status.code == 200) {
                alert("删除成功！");
                window.location.href = ("/planView/");
            } else {
                if (status.code == 401) {
                    alert("无删除权限");
                }
            }

        }
    }

    )
}
function UserModify(username) {
    $.ajax({
        type: "GET",
        url: "/UserModify/?Username=" + username,
        success: function (status) {
            if (status.code == 200) {
                alert("更改成功！");
                top.location = ("/login/");
            } else {
                if (status.code == 401) {
                    alert("无更改权限");
                }
            }

        }}
    );
}
