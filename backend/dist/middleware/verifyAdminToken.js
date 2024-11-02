"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAdminToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyAdminToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //first we need to get token from the cookie
        const token = req.cookies.adminToken;
        if (!token) {
            res.status(404).json({ message: "Token is missing" });
            return;
        }
        //verify the token we get
        let jwtSecretKey = process.env.JWT_SECRET || '';
        const decodedToken = yield jsonwebtoken_1.default.verify(token, jwtSecretKey);
        if (decodedToken) {
            next();
        }
        else {
            res.status(401).json({ message: "Invalid token" });
            return;
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.verifyAdminToken = verifyAdminToken;
