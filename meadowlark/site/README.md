![](http://i.imgur.com/wB4Sp9L.png)
#node express#
#介绍
- 1
- 2
- 3

#安装
- express: `npm install express --save`
- mongoose: `npm install mongoose --save`
- babel: `npm install babel --save`
- es6: `npm install babel-preset-es2015 --save`
- 或npm init

#启动
	npm start

#技术栈
node + express + pm2 + mongoose + babel + es6 + Nginx

前后端分离.node做api中间层
最简单的情况就是node做个api代理，然后顺便可以简单的套个首屏页面。当然加这一层会给前端几乎无限的可能性。
前后端分离，express做数据api层和首屏渲染模板，用devserver起静态服务，模板中调用相应js
MVC 三层  实现api接口  数据库采用 mongodb数据引擎mongoose