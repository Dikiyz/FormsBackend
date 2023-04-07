import env from "dotenv";
import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import system from "./system.js";
import router from "./routes/index.js";
import errorHandler from "./middlewares/ErrorHandlingMiddleware.js";
import ApiError from "./ApiError.js";
import session from "express-session";

env.config();

const PORT = process.env.PORT ?? 80;
const App = express();

App.set('view engine', 'pug');
App.set('views', 'src/views');
App.use(express.static('src/static/'));
App.use(session({ secret: "sdfsdfsdfsdffsddsf23423s drf234 f34", cookie: { maxAge: 60000 }}))

App.use(cors());
App.use(express.json());
App.use(fileUpload({}));
App.use('/', router);

App.post('/test1', (request, response, next) => {
    console.log(1);
});
App.use('/test', (request, response, next) => {
    try {
        response.render('authorization', {
            title: `Регистрация`,
            isAuthorization: false
        });
    } catch (err) { next(ApiError.internal(err.message)) }
});

// Обработка ошибок. Последний Middleware.
App.use(errorHandler);
App.use((request, response, next) => response.status(500).json({ message: "Непредвиденная ошибка!" }));

App.listen(PORT, () => system.success(`Server created successfuly on port ${PORT}!`));

export default App;