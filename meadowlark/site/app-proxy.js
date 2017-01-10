var express=require("express");
var http=require("http");
var app=express();

app.set('port', process.env.PORT || 8089);
app.use(express.static(__dirname));

http.createServer(app).listen(app.get('port'), function(){
    console.log( 'Express started in ' + app.get('env') +
    ' mode on http://localhost:' + app.get('port') +   ';' );
});