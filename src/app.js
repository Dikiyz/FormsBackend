import env from "dotenv";
import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import system from "./system.js";
import router from "./routes/index.js";
import errorHandler from "./middlewares/ErrorHandlingMiddleware.js";
import ApiError from "./ApiError.js";

env.config();

const PORT = process.env.PORT ?? 80;
const App = express();

App.set('view engine', 'pug');
App.set('views', 'src/views');
App.use(express.static('src/static/'));

App.use(cors());
App.use(express.json());
App.use(cookieParser());
App.use(fileUpload({}));
App.use('/', router);

// Обработка ошибок. Последний Middleware.
App.use(errorHandler);

App.listen(PORT, () => system.success(`Server created successfuly on port ${PORT}!`));

export default App;