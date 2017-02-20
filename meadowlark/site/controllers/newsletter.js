/**
 * Created by sunzehao on 2016/12/6.
 * 新闻通知处理器
 */
let credentials   = require("../lib/credentials.js");
let emailService  = require('../lib/email.js')(credentials);

module.exports = {
    //把路由整理在一起更清晰
    registerRoutes: (app) => {
        const _self = this;
        app.get('/newsletter', _self.newsLetter);
        app.post('/cart/checkout', _self.checkout);
        app.post('/process', _self.process);
        app.post('/process-contact', _self.processContact);
    },
    newsLetter: (req, res) =>{
        res.clearCookie("userinfo");
        res.render('newsletter',{
            csrf: 'CSRF token goes here',
            userinfo:req.cookies.userinfo,
            _userinfo:req.signedCookies.signed_userinfo
        });
    },
    //如多个站点about/123/聪聪 /cart/:site
    checkout: (req, res) =>{
        var cart = {};
        //if(!cart) next(new Error('Cart does not exist.'));
        var name = req.body.name || '',
            email = req.body.email || '';
        // 输入验证
        /*if(!email.match(VALID_EMAIL_REGEX))
         return res.next(new Error('Invalid email address.'));*/
        // 分配一个随机的购物车ID；一般我们会用一个数据库ID
        cart.number = Math.random().toString().replace(/^0\.0*/, '');
        cart.billing = {
            name: name,
            email: email
        };
        res.render('email/cart-thank-you',
            { layout: null, cart: cart }, function(err,html){
                if(err) console.log('error in email template');
                //发送邮件
                console.log(cart.billing.email)
                emailService.send(cart.billing.email, '感谢预定旅程',html);
            }
        );
        res.render('cart-thank-you', { cart: cart });
    },
    process: (req, res) =>{
        if(req.xhr || req.accepts('json,html')==='json'){
            //校验输入内容
            //req.body获取ajax form表单值
            res.cookie("userinfo",{//未签名
                name:req.body.name,
                email:req.body.email
            });
            res.cookie("signed_userinfo",{//签名
                name:req.body.name,
                email:req.body.email
            },{
                signed: true,
                //domain:"",
                path:"/",
                httpOnly:true,
                secure:false,
                maxAge:100000 //毫秒
            });
            // 如果发生错误，应该发送 { error: 'error description' }
            res.send({success:true});
        }else if(!req.xhr){
            //非ajax请求  把newsletter页面的ajax请求注释
            //先校验输入内容

            //session会话最常见的用法是提供用户验证信息  senssion基于cookie
            req.session.flash = {
                type: 'success',
                intro: 'Thank you!',
                message: 'You have now been signed up for the newsletter.'
            };
            res.redirect(303,'/newsletter');

        }else {
            // 如果发生错误，应该重定向到错误页面
            res.redirect(303, '/thank-you');
        }
    },
    //表单处理 必须引入中间件body-parser
    processContact: (req, res) =>{
        console.log(req.body.name + ',' + req.body.email);
        try{
            // 保存到数据库……
            return req.xhr ? res.render({success: true}) : res.redirect(303, '/thank-you');
        }catch(ex){
            return req.xhr ? res.json({error: 'Database error.'}) : res.redirect(303, '/error');
        }
    }
}