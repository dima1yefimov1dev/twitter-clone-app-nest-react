"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("./auth/auth.module");
const user_module_1 = require("./user/user.module");
const posts_service_1 = require("./posts/posts.service");
const posts_controller_1 = require("./posts/posts.controller");
const posts_module_1 = require("./posts/posts.module");
const user_service_1 = require("./user/user.service");
const firebase_auth_service_1 = require("./firebase/services/firebase.auth.service");
const firebase_jwt_strategy_1 = require("./auth/strategies/firebase-jwt.strategy");
const passport_1 = require("@nestjs/passport");
const likes_module_1 = require("./likes/likes.module");
const firebase_module_1 = require("./firebase/firebase.module");
const comments_module_1 = require("./comments/comments.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            auth_module_1.AuthModule,
            firebase_module_1.FirebaseModule,
            user_module_1.UserModule,
            posts_module_1.PostsModule,
            comments_module_1.CommentsModule,
            likes_module_1.LikesModule,
        ],
        controllers: [posts_controller_1.PostsController],
        providers: [
            firebase_jwt_strategy_1.FirebaseJwtStrategy,
            firebase_auth_service_1.FirebaseAuthService,
            user_service_1.UserService,
            posts_service_1.PostsService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map