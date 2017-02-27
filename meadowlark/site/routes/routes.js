let main = require('../controllers/main.js')
    ,newsletter = require('../controllers/newsletter.js')
    ,attraction = require('../controllers/attraction.js');
    /*,vacation = require('../controllers/vacation.js');*/

module.exports = (app) => {
    main.registerRoutes(app);
    newsletter.registerRoutes(app);
   /* attraction.registerRoutes(app);*/

    /* vacation.registerRoutes(app);*/
}