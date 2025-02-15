import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel";
import bcrypt from "bcryptjs";

dotenv.config();

export const adminLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let { username, password } = req.body;

    if (!username || !password) {
      res.status(404).json({ message: "All fields are required" });
      return;
    }

    if (
      username === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // create a token

      let payload = {
        isAdmin: true,
      };
      let jwtSecretKey = process.env.JWT_SECRET || "";

      let token = jwt.sign(payload, jwtSecretKey, { expiresIn: "1h" });

      res
        .cookie("adminToken", token, {
          httpOnly: true,
          secure: true,
          maxAge: 60 * 60 * 24,
        })
        .status(200)
        .json({ message: "Login successful" });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let userList = await userModel.find({}, { password: 0 });

    if (!userList) {
      res.status(404).json({ message: "There is no user details" });
      return;
    }

    let userDetails = userList.map((ele) => {
      return {
        name: ele.name,
        email: ele.email,
        id: ele.id,
      };
    });
    console.log(
      "🚀 ~ file: adminController.ts:60 ~ userDetails ~ userDetails:",
      userDetails
    );

    res
      .status(200)
      .json({
        message: "user details retrieved successfully",
        users: userDetails,
      });
  } catch (error) {
    next(error);
  }
};

export const adminLogout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie("adminToken");
    res.status(200).json({ message: "logout successfully" });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let { id } = req.body;

    if (!id) {
      res.status(404).json({ message: "Cannot find the user without id" });
      return;
    }

    let deletedUser = await userModel.findByIdAndDelete(id);

    if (deletedUser) {
      res.status(200).json({ message: "user deleted successfully" });
    } else {
      res.status(404).json({ message: "Cannot delete the user" });
    }
  } catch (error) {
    next(error);
  }
};

export const editUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id, name, email } = req.body;

    // Check if all required fields are provided
    if (!id || !name || !email) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    // Find user by ID and update
    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { name, email },
      { new: true } // This option returns the updated document
    );

    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    next(error);
  }
};

export const addUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    // Validate input fields
    if (!username || !email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    // Check if the user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: "User already exists" });
      return;
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10); // Adjust the salt rounds as needed

    // Create a new user object
    const newUser = new userModel({
      name: username,
      email,
      password: hashedPassword, // Store the hashed password
    });

    // Save the user to the database
    let createdUser = await newUser.save();

    let responseUser = {
      name: createdUser.name,
      email: createdUser.email,
      id: createdUser.id,
    };

    res
      .status(200)
      .json({ message: "User added successfully", user: responseUser });
  } catch (error) {
    next(error);
  }
};
