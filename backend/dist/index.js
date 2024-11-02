"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRouter_1 = __importDefault(require("./routes/userRouter"));
const adminRouter_1 = __importDefault(require("./routes/adminRouter"));
const dbConfig_1 = require("./db/dbConfig");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
const corsOptions = {
    origin: ['http://localhost:5173'], // Allow multiple origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, cookie_parser_1.default)());
//for form data
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
//connecting db
(0, dbConfig_1.dbConnection)();
//for redirecting each request from the client (specified with api) to appropriate routers
app.use("/api", userRouter_1.default);
app.use("/api/admin", adminRouter_1.default);
// error handling middleware
app.use((err, req, res, next) => {
    console.log(err);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ success: false, message: err.message || 'internal server error  ' });
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`server running on port http://localhost:${port}`);
});
