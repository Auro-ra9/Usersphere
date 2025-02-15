import { NextFunction, Request, Response } from "express";
import userModel from "../models/userModel";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

export const userSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log(req.body);
    const { username, email, password } = req.body;

    // Check if required fields are present
    if (!username || !email || !password) {
      res.status(400).json({ message: "Invalid form details", success: false });
      return;
    }

    // Check if user already exists
    const userExist = await userModel.findOne({ email });
    if (userExist) {
      res.status(400).json({ message: "User already exists", success: false });
      return;
    }
    //before hashing use genSalt for how many times we need to hash
    let saltValue = await bcrypt.genSalt(10);
    //secure this password using hash
    let hashedPassword = await bcrypt.hash(password, saltValue);
    // Create a new user
    const newUser = new userModel({
      name:username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    // Send success response
    res
      .status(200)
      .json({ message: "User created successfully", success: true });
  } catch (error) {
    // Pass error to the error-handling middleware
    next(error);
  }
};
export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check if required fields are present
    if (!email || !password) {
      res.status(400).json({ message: "Invalid form details", success: false });
      return;
    }

    // Check if user already exists
    const userExist = await userModel.findOne({ email });
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

    let comparedPassword = await bcrypt.compare(password, userExist.password!);
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
        name:userExist.name
    }

    let token = jwt.sign(payload, jwtSecretKey, { expiresIn: '1h' });

    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 24
    }).status(200).json({ message: "User login successfully", success: true,user:payload });
  } catch (error) {
    // Pass error to the error-handling middleware
    next(error);
  }
};

type DecodedTokenType = {
  id: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
}


export const getProfile = async (req:Request,res:Response,next:NextFunction):Promise<void> => {
  try {

      let token = req.cookies.token;

      let decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as DecodedTokenType;

      let userDetails = await userModel.findOne({_id:decodedToken.id},{password:0});
      if (!userDetails) {
          res.status(400).json({ message: "Cannot get the user Profile details" });
          return;
      }

      res.status(200).json({ message: "profile details fetched successfully" ,user:userDetails});
      
  } catch (error) {
      next(error);
  }
}

export const userLogout = async (req: Request, res: Response, next: NextFunction) => {
  try {

      res.clearCookie('token');
      res.status(200).json({ message: "logout successfully" });
      
  } catch (error) {
      next(error);
  }
}

export const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
  try {

      let { image } = req.body;

      let token = req.cookies.token;

      let decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as DecodedTokenType;

      if (!image) {
          res.status(404).json({ message: "Image is missing" });
          return;
      }

      const updatedUser = await userModel.findByIdAndUpdate(decodedToken.id, { image });

      if (!updatedUser) {
          res.status(404).json({ message: "Image is missing" });
          return;
      }


      res.status(200).json({message:"user Profile update successfully",image})
      
  } catch (error) {
      next(error);
  }
}