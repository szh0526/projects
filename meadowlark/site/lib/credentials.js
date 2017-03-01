let credentials = {
    cookieSecret: '!@#123qwe',
    email_163:{
        user:"szh6602518a@163.com",
        password:"340636803a"
    },
    /*MongoDB权威指南
     账户: meadowlark_mangodb
     用户名: sunzehao
     密码:6602518a
     数据库 meadowlark_db 用户名 sunzh 密码123
     数据库 admin 用户名 root 密码123
    */
    mongo:{
        "production":{
            connectionString:"mongodb://sunzh:123@localhost:27017/meadowlark_db/?safe=true;wtimeoutMS=2000"
        },
        "development":{
            connectionString:"mongodb://sunzh:123@localhost:27017/meadowlark_db/?safe=true;wtimeoutMS=2000"
        },
        //数据库连接
        dbConnection:null
    }
};

export default credentials;