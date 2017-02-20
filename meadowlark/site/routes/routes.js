let main = require('../controllers/main.js');
let newsletter = require('../controllers/newsletter.js');
let attraction = require('../controllers/attraction.js');
let vacation = require('../handlers/vacation.js');
module.exports = (app) => {
    //路由最好由controller控制器归类
    /*main.registerRoutes(app);
    app.get('/vacations', vacation.find);
    app.get('/vacations/del', vacation.del);
    app.get('/vacations/update', vacation.update);
    app.get('/set-currency/:currency', vacation.setcurrency);
    newsletter.registerRoutes(app);
    attraction.registerRoutes(app);*/
}