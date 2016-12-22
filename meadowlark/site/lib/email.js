/**
 * Created by sunzehao on 2016/11/12.
 */
var nodemailer = require('nodemailer');
module.exports = function(credentials){
    //邮件服务传输实例对象
    var mailTransport = nodemailer.createTransport('SMTP', {
        /*service: 'Gmail',*/
        host: 'smtp.163.com',//163邮箱
        secureConnection: true,
        port: 465, //SSL
        auth: {
            user: credentials.email_163.user,
            pass: credentials.email_163.password
        }
    });
    var from = 'sunzehao <szh6602518a@163.com>';
    var errorRecipient = 'szh6602518a@163.com';
    return {
        //to收件人,subj标题,body email模板内容
        send: function(to, subj, body){
            mailTransport.sendMail({
                from: from,
                to: to,
                subject: subj,
                html: body,
                generateTextFromHtml: true
            }, function(err){
                if(err){
                    this.emailError("邮件发送失败", "测试路径", err.stack);
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