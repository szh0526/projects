/**
 * Created by sunzehao on 2016/11/12.
 */
let nodemailer = require("nodemailer");

export default (credentials) => {
    //邮件服务传输实例对象
    let mailTransport = nodemailer.createTransport("SMTP", {
        /*service: 'Gmail',*/
        host: 'smtp.163.com',//163邮箱
        secureConnection : false,
        port: 465, //SSL是465 TLS是587
        auth: {
            user: credentials.email_163.user,
            pass: credentials.email_163.password
        }
    });
    let from = 'sunzehao <szh6602518a@163.com>';
    let errorRecipient = 'szh6602518a@163.com';
    return {
        //to收件人,subj标题,body email模板内容
        send: function(to, subj, body){
            mailTransport.sendMail({
                from: from,
                to: to,
                subject: subj,
                text: 'Hello to myself!',
                html: body,
                //附件
                /*attachments : [{
                    filename: 'text3.txt', // 文件名
                    path: 'Your File path' // 文件路径
                }]*/
            }, function(err){
                if(err){
                    console.error('Unable to send email: ' + err);
                }else{

                }
            });
        },
        //网站在出错时将错误信息通知给指定email
        emailError: function(message, filename, exception){
            var body = '<h1>网站错误日志</h1> message:<br><pre>' + message + '</pre><br>';
            if(exception) body += 'exception:<br><pre>' + exception+ '</pre><br>';
            if(filename) body += 'filename:<br><pre>' + filename+ '</pre><br>';
            mailTransport.sendMail({
                from: from,
                to: errorRecipient,
                subject: 'Meadowlark Travel Site Error',
                html: body,
                generateTextFromHtml: true
            }, function(err){
                if(err) console.error('Unable to send email: ' + err);
            });
        }
    }
}