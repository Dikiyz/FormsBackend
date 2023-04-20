import Router from "express";

import FormController from "../controllers/FormController.js";
import CheckIsAdminMiddleware from '../middlewares/CheckIsAdminMiddleware.js';

const router = new Router();
router.set('view engine', 'pug');
router.set('views', 'src/views');

router.get('/add', CheckIsAdminMiddleware, FormController.addPage);
router.post('/add', CheckIsAdminMiddleware, FormController.add);
router.delete('/:id', CheckIsAdminMiddleware, FormController.remove);
router.get('/:id', FormController.getOne);
router.get('/', FormController.getList);

export default router;