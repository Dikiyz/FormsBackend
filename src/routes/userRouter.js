import Router from "express";

import UserController from "../controllers/UserController.js";
import AuthentificateMiddleware from '../middlewares/AuthentificateMiddleware.js';

const router = new Router();
router.set('view engine', 'pug');
router.set('views', 'src/views');

router.get('/logout', AuthentificateMiddleware, UserController.logOut);
router.get('/auth', UserController.authorization);
router.get('/login', UserController.logIn);
router.post('/signup', UserController.signUp);

export default router;