import Router from "express";

import adminRouter from "./adminRouter.js";
import formRouter from "./formRouter.js";
import userRouter from "./userRouter.js";
import AuthentificateMiddleware from '../middlewares/AuthentificateMiddleware.js';

const router = new Router();

router.use('/admin', adminRouter); // Not work now.
router.use('/form', formRouter);
router.use('/user', userRouter)

export default router;