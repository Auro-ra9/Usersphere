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
exports.uploadImage = exports.userLogout = exports.getProfile = exports.userLogin = exports.userSignup = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userSignup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const { username, email, password } = req.body;
        // Check if required fields are present
        if (!username || !email || !password) {
            res.status(400).json({ message: "Invalid form details", success: false });
            return;
        }
        // Check if user already exists
        const userExist = yield userModel_1.default.findOne({ email });
        if (userExist) {
            res.status(400).json({ message: "User already exists", success: false });
            return;
        }
        //before hashing use genSalt for how many times we need to hash
        let saltValue = yield bcryptjs_1.default.genSalt(10);
        //secure this password using hash
        let hashedPassword = yield bcryptjs_1.default.hash(password, saltValue);
        // Create a new user
        const newUser = new userModel_1.default({
            name: username,
            email,
            password: hashedPassword,
        });
        yield newUser.save();
        // Send success response
        res
            .status(200)
            .json({ message: "User created successfully", success: true });
    }
    catch (error) {
        // Pass error to the error-handling middleware
        next(error);
    }
});
exports.userSignup = userSignup;
const userLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Check if required fields are present
        if (!email || !password) {
            res.status(400).json({ message: "Invalid form details", success: false });
            return;
        }
        // Check if user already exists
        const userExist = yield userModel_1.default.findOne({ email });
        if (!userExist) {
            res
                .status(404)
                .json({
                message: "User not exist with this email address",
                success: false,
            });
            return;
        }
        //now user is exist we want check the password
        let comparedPassword = yield bcryptjs_1.default.compare(password, userExist.password);
        if (!comparedPassword) {
            res
                .status(404)
                .json({ message: "Invalid email or password", success: false });
            return;
        }
        // create a token
        let jwtSecretKey = process.env.JWT_SECRET || '';
        let payload = {
            id: userExist.id,
            email: userExist.email,
            name: userExist.name
        };
        let token = jsonwebtoken_1.default.sign(payload, jwtSecretKey, { expiresIn: '1h' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            maxAge: 60 * 60 * 24
        }).status(200).json({ message: "User login successfully", success: true, user: payload });
    }
    catch (error) {
        // Pass error to the error-handling middleware
        next(error);
    }
});
exports.userLogin = userLogin;
const getProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = req.cookies.token;
        let decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        let userDetails = yield userModel_1.default.findOne({ _id: decodedToken.id }, { password: 0 });
        if (!userDetails) {
            res.status(400).json({ message: "Cannot get the user Profile details" });
            return;
        }
        res.status(200).json({ message: "profile details fetched successfully", user: userDetails });
    }
    catch (error) {
        next(error);
    }
});
exports.getProfile = getProfile;
const userLogout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie('token');
        res.status(200).json({ message: "logout successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.userLogout = userLogout;
const uploadImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { image } = req.body;
        let token = req.cookies.token;
        let decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!image) {
            res.status(404).json({ message: "Image is missing" });
            return;
        }
        const updatedUser = yield userModel_1.default.findByIdAndUpdate(decodedToken.id, { image });
        if (!updatedUser) {
            res.status(404).json({ message: "Image is missing" });
            return;
        }
        res.status(200).json({ message: "user Profile update successfully", image });
    }
    catch (error) {
        next(error);
    }
});
exports.uploadImage = uploadImage;
