"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const verifyToken_1 = require("../middleware/verifyToken");
const userRouter = (0, express_1.Router)();
//here everything comes with a prefix of api/ from the client (here index.ts) 
userRouter.post('/signup', userController_1.userSignup);
userRouter.post('/login', userController_1.userLogin);
userRouter.post('/get-profile', verifyToken_1.verifyToken, userController_1.getProfile);
userRouter.post('/logout', userController_1.userLogout);
userRouter.post('/upload-image', verifyToken_1.verifyToken, userController_1.uploadImage);
exports.default = userRouter;
