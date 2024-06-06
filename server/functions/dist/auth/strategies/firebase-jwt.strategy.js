"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var FirebaseJwtStrategy_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseJwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_firebase_jwt_1 = require("passport-firebase-jwt");
const firebase_admin_1 = require("firebase-admin");
const user_service_1 = require("../../user/user.service");
let FirebaseJwtStrategy = FirebaseJwtStrategy_1 = class FirebaseJwtStrategy extends (0, passport_1.PassportStrategy)(passport_firebase_jwt_1.Strategy) {
    constructor(usersService) {
        super({
            jwtFromRequest: passport_firebase_jwt_1.ExtractJwt.fromExtractors([
                FirebaseJwtStrategy_1.extractJwtFromCookies,
            ]),
        });
        this.usersService = usersService;
    }
    async validate(token) {
        try {
            const validatedUserData = await (0, firebase_admin_1.auth)().verifyIdToken(token, true);
            if (!validatedUserData) {
                throw new common_1.UnauthorizedException();
            }
            const user = await this.usersService.findOrCreateFromDbOrAuth(validatedUserData.sub);
            return user;
        }
        catch (e) {
            console.log(e);
            throw new common_1.UnauthorizedException();
        }
    }
    static extractJwtFromCookies(req) {
        let token = null;
        if (req && req.cookies) {
            token = req.cookies['token'];
        }
        return token;
    }
};
exports.FirebaseJwtStrategy = FirebaseJwtStrategy;
exports.FirebaseJwtStrategy = FirebaseJwtStrategy = FirebaseJwtStrategy_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], FirebaseJwtStrategy);
//# sourceMappingURL=firebase-jwt.strategy.js.map