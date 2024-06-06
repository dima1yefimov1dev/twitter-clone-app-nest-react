"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const core_1 = require("@nestjs/core");
const platform_express_1 = require("@nestjs/platform-express");
const express = require("express");
const functions = require("firebase-functions");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const app_module_1 = require("./app.module");
const main_1 = require("./main");
const common_1 = require("@nestjs/common");
const expressServer = express();
const createFunction = async (expressInstance) => {
    (0, main_1.initializeFirebase)();
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(expressInstance));
    app.enableCors({
        origin: 'https://twt-clone-b4321.web.app',
        credentials: true,
        allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie',
        methods: 'GET,HEAD,OPTIONS,POST,PUT, PATCH, DELETE',
    });
    app.use(cookieParser());
    app.use(bodyParser.json({ limit: '1mb' }));
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true }));
    app.use(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', 'https://twt-clone-b4321.web.app');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie');
        next();
    });
    await app.init();
};
exports.api = functions.https.onRequest(async (request, response) => {
    await createFunction(expressServer);
    expressServer(request, response);
});
//# sourceMappingURL=index.js.map