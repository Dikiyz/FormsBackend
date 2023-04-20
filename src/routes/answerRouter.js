import Router from "express";

import CheckIsAdminMiddleware from '../middlewares/CheckIsAdminMiddleware.js';
import AnswerController from "../controllers/AnswerController.js";

const router = new Router();
router.set('view engine', 'pug');
router.set('views', 'src/views');

router.get('/:id', CheckIsAdminMiddleware, AnswerController.getOne);
router.get('/', CheckIsAdminMiddleware, AnswerController.getAll);
router.post('/', AnswerController.addNew);

export default router;