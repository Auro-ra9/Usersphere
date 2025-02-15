import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();  
console.log("Connection String:", process.env.CONNECTION_STRING);

export const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.CONNECTION_STRING!);
        console.log("Mongodb Connected successfully");
    } catch (error) {
        console.log(error);
        //if any error occurs we need to exit from here as well
        process.exit(1)
    }
};

