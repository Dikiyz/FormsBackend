import Router from "express";

import adminRouter from "./adminRouter.js";
import formRouter from "./formRouter.js";
import userRouter from "./userRouter.js";
import answerRouter from "./answerRouter.js";
import AuthentificateMiddleware from '../middlewares/AuthentificateMiddleware.js';
import CheckIsAdminMiddleware from "../middlewares/CheckIsAdminMiddleware.js";

const router = new Router();

router.use('/admin', CheckIsAdminMiddleware, adminRouter); // Not work now.
router.use('/form', AuthentificateMiddleware, formRouter);
router.use('/answer', AuthentificateMiddleware, answerRouter);
router.use('/user', userRouter)

export default router;