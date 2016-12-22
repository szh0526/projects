/*
集群化服务器
应用集群扩展 为系统上的每个内核（CPU）创建一个独立的服务器
*/
var cluster = require('cluster');
var cups    = require('os').cpus();

function startWorker(){
    //为系统中的每个CPU 启动了一个工作线程
    var worker = cluster.fork();
    console.log('CLUSTER: 工作线程 %d 已启动', worker.id);
}

if(cluster.isMaster){
    //cluster.isMaster 主线程模式
    //有多少个cpu启动多少个服务
    cups.forEach(function(){
        startWorker();
    });

    // 监听disconnect 记录所有断开的工作线程。如果工作线程断开了，它应该退出
    // 因此我们可以等待exit 事件然后繁衍一个新工作线程来代替它
    cluster.on('disconnect', function(worker){
        console.log('CLUSTER: 工作线程 %d 已关闭.',
            worker.id);
    });
    // 监听exit 当有工作线程死掉（退出）时，创建一个工作线程代替它
    cluster.on('exit', function(worker, code, signal){
        console.log('CLUSTER: 工作线程 %d 已退出 编码 %d (%s)',
            worker.id, code, signal);
        startWorker();
    });
}else{
    //cluster.isWorker 工作线程模式
    //在这个工作线程上启动我们的应用服务器
    //module.exports = startServer;
    require("./meadowlark.js")();
}