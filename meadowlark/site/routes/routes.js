import mainController from '../controllers/main.js';
import newsletterController from '../controllers/newsletter.js';
import attractionController from '../controllers/attraction.js';
import vacationController from '../controllers/vacation.js';

let initRoutes = (app) => {
    mainController.registerRoutes(app);
    newsletterController.registerRoutes(app);
    attractionController.registerRoutes(app);
    vacationController.registerRoutes(app);
}

export default initRoutes;