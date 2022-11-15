function t(e){
            return "<td>"+e+"</td>";
        }
        function jumpto(l){
            l=getDecode64(l);
            console.log(l);
            top.location= l;
        }
        function parseLine(line){
            k=line.split("|");
            var r='';
            r+=t(k[0])+t(k[1]);
            r+=t(k[2].replace(new RegExp("&lt;br&gt;", "g"), "<br>"));
            switch(k[3]){
                case "NULL":
                    r+=t("<label>目前此任务无关联文件</label>");
                    break;
                case "/downloadAction?name=Li91cGxvYWQvNS9zdWNjZXNzLnR4dA==":
                    r+=t("<label>任务完成，无惩罚</label>");
                    break;
                default:
                    r+=t('<a href="'+k[3]+'">点击下载</a>');
                    break;
            }
            r+=t(k[4]);
            link='jumpto("'+getEncode64( "/planModify?id="+k[5])+'")';
            r+=t('<button onclick='+link+'>修改计划</a>');
            document.getElementById("display").innerHTML+=r;
        }
        function loadPlans(){
            lines=document.getElementById("content").innerHTML.split("\n");
            for(var i=0;i<lines.length;i++){
                parseLine(lines[i]);
            }
        }
