import Router from "express";

import FormController from "../controllers/FormController.js";
import CheckIsAdminMiddleware from '../middlewares/CheckIsAdminMiddleware.js';
import AuthentificateMiddleware from "../middlewares/AuthentificateMiddleware.js";

const router = new Router();
router.set('view engine', 'pug');
router.set('views', 'src/views');

router.get('/:id', AuthentificateMiddleware, FormController.getOne);
router.get('/', FormController.getList);
router.post('/:id', CheckIsAdminMiddleware, FormController.add);
router.delete('/:id', CheckIsAdminMiddleware, FormController.remove);
router.post('/done', FormController.done);

export default router;