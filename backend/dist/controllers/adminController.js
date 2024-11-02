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
exports.addUser = exports.editUser = exports.deleteUser = exports.adminLogout = exports.getUsers = exports.adminLogin = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
dotenv_1.default.config();
const adminLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        let { username, password } = req.body;
        if (!username || !password) {
            res.status(404).json({ message: "All fields are required" });
            return;
        }
        if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
            // create a token
            let payload = {
                isAdmin: true,
            };
            let jwtSecretKey = process.env.JWT_SECRET || '';
            let token = jsonwebtoken_1.default.sign(payload, jwtSecretKey, { expiresIn: '1h' });
            res.cookie('adminToken', token, {
                httpOnly: true,
                secure: true,
                maxAge: 60 * 60 * 24
            }).status(200).json({ message: "Login successful" });
        }
        else {
            res.status(401).json({ message: "Invalid username or password" });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.adminLogin = adminLogin;
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userList = yield userModel_1.default.find({}, { password: 0 });
        if (!userList) {
            res.status(404).json({ message: "There is no user details" });
            return;
        }
        let userDetails = userList.map((ele) => {
            return {
                name: ele.name,
                email: ele.email,
                id: ele.id
            };
        });
        console.log("🚀 ~ file: adminController.ts:60 ~ userDetails ~ userDetails:", userDetails);
        res.status(200).json({ message: "user details retrieved successfully", users: userDetails });
    }
    catch (error) {
        next(error);
    }
});
exports.getUsers = getUsers;
const adminLogout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie('adminToken');
        res.status(200).json({ message: "logout successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.adminLogout = adminLogout;
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        let { id } = req.body;
        if (!id) {
            res.status(404).json({ message: "Cannot find the user without id" });
            return;
        }
        let deletedUser = yield userModel_1.default.findByIdAndDelete(id);
        if (deletedUser) {
            res.status(200).json({ message: "user deleted successfully" });
        }
        else {
            res.status(404).json({ message: "Cannot delete the user" });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.deleteUser = deleteUser;
const editUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const { id, name, email } = req.body;
        // Check if all required fields are provided
        if (!id || !name || !email) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }
        // Find user by ID and update
        const updatedUser = yield userModel_1.default.findByIdAndUpdate(id, { name, email }, { new: true } // This option returns the updated document
        );
        if (!updatedUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    }
    catch (error) {
        next(error);
    }
});
exports.editUser = editUser;
const addUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const { username, email, password } = req.body;
        // Validate input fields
        if (!username || !email || !password) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }
        // Check if the user already exists
        const existingUser = yield userModel_1.default.findOne({ email });
        if (existingUser) {
            res.status(409).json({ message: "User already exists" });
            return;
        }
        // Hash the password before saving
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10); // Adjust the salt rounds as needed
        // Create a new user object
        const newUser = new userModel_1.default({
            name: username,
            email,
            password: hashedPassword, // Store the hashed password
        });
        console.log('newUser', newUser);
        // Save the user to the database
        let createdUser = yield newUser.save();
        console.log('createdUser', createdUser);
        let responseUser = {
            name: createdUser.name,
            email: createdUser.email,
            id: createdUser.id
        };
        res.status(200).json({ message: "User added successfully", user: responseUser });
    }
    catch (error) {
        next(error);
    }
});
exports.addUser = addUser;
