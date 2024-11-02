import express, { NextFunction, Request, Response } from "express";
import userRouter from "./routes/userRouter";
import adminRouter from "./routes/adminRouter";
import { dbConnection } from "./db/dbConfig";
import cors from 'cors'
import cookieParser from 'cookie-parser';



const app = express();

const corsOptions = {
  origin: ['http://localhost:5173'], // Allow multiple origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser())



//for form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//connecting db
dbConnection();

//for redirecting each request from the client (specified with api) to appropriate routers
app.use("/api", userRouter);
app.use("/api/admin", adminRouter);

// error handling middleware

app.use((err:any, req:Request, res:Response, next:NextFunction) => {
  console.log(err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({ success: false, message: err.message || 'internal server error  ' });
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`server running on port http://localhost:${port}`);
});
