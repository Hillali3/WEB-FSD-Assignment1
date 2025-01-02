import { Request, Response } from "express";
import User from "../models/user";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { sendError } from "../utils/sendError";

// Create a new user
export const createUser = async (req: Request, res: Response) => {
  const { username, name, email, password } = req.body;

  if (!username || !name || !email || !password) {
    return res
      .status(400)
      .json({ message: "username, name, email and password are required" });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const encryptedPAssword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      name,
      email,
      password: encryptedPAssword,
    });
    await newUser.save();
    return res.status(201).json(newUser);
  } catch {
    return sendError(res, "Fail registration");
  }
};

// Get  all users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching users", error });
  }
};

//   // Get user by id
//   export const getUserById = async (req: Request, res: Response) => {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ error: "Invalid id" });
//     }

//     try {
//       const user = await User.findById(id);
//       if (!user) {
//         return res.status(404).json({ message: "User is not found" });
//       }
//       res.status(200).json(user);
//     } catch (error) {
//       res.status(500).json({ message: "Error fetching user", error });
//     }
//   };

//   // Get user by username
//   export const getUserByUsername = async (req: Request, res: Response) => {
//     const { username } = req.params;

//     try {
//       const user = await User.find({ username });
//       if (user.length === 0) {
//         return res
//           .status(404)
//           .json({ message: "No user found for this username" });
//       }
//       return res.status(200).json(user);
//     } catch (error) {
//       return res.status(500).json({ message: "Error fetching users", error });
//     }
//   };

//   //update user by id
//   export const updateUser = async (req: Request, res: Response) => {
//     const id = req.params.id;
//     const { name, password, email, birthDate, username } = req.body;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ error: "Invalid id" });
//     }

//     try {
//       const updatedUser = await User.findByIdAndUpdate(
//         id,
//         { name, password, email, birthDate, username },
//         { new: true }
//       );
//       if (!updatedUser) {
//         return res.status(404).json({ message: "User not found" });
//       }
//       res.status(200).json(updatedUser);
//     } catch (error) {
//       res.status(500).json({ message: "Error updating user", error });
//     }
//   };

//   // Delete user by id
//   export const deleteUser = async (req: Request, res: Response) => {
//     const id = req.params.id;

//     try {
//       const deletedUser = await User.findByIdAndDelete(id);

//       if (!deletedUser) {
//         return res.status(404).json({ message: "User not found" });
//       }

//       return res.status(200).json({ message: "user deleted successfully" });
//     } catch (error) {
//       return res.status(500).json({ message: "Error deleting user", error });
//     }
//   };
