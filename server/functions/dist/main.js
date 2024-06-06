"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeFirebase = void 0;
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const admin = require("firebase-admin");
const serviceAccount = require("./configs/firebase.json");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const initializeFirebase = () => {
    const firebaseServiceAccount = JSON.parse(JSON.stringify(serviceAccount));
    if (admin.apps.length === 0) {
        admin.initializeApp({
            credential: admin.credential.cert(firebaseServiceAccount),
            storageBucket: 'twt-clone-b4321.appspot.com',
        });
    }
};
exports.initializeFirebase = initializeFirebase;
async function bootstrap() {
    const firebaseServiceAccount = JSON.parse(JSON.stringify(serviceAccount));
    if (admin.apps.length === 0) {
        admin.initializeApp({
            credential: admin.credential.cert(firebaseServiceAccount),
            storageBucket: 'twt-clone-b4321.appspot.com',
        });
    }
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: 'https://twt-clone-b4321.web.app',
        methods: 'GET,HEAD,OPTIONS,POST,PUT, PATCH, DELETE',
        allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie',
        credentials: true,
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
    await app.listen(7774);
}
bootstrap();
//# sourceMappingURL=main.js.map