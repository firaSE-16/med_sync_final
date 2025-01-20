import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Doctor from "../models/doctor.model.js";
import Nurse from "../models/nurse.model.js";
import Triage from "../models/triage.model.js";
import Laboratorist from "../models/labratorist.model.js";
import User from "../models/user.model.js";

import Admin from "../models/admin.model.js";
import { generateToken } from "../lib/utils.js";


const checkCredentials = async (Model, email, password) => {
  const user = await Model.findOne({ email });
  if (!user) return null;
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  return isPasswordCorrect ? user : null;
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const roles = [
    { role: "doctor", model: Doctor },
    { role: "nurse", model: Nurse },
    { role: "triage", model: Triage },
    { role: "laboratorist", model: Laboratorist },
    { role: "user", model: User },
    { role: "admin", model: Admin },
  ];

  try {
    let user = null;
    let role = null;

    for (const entry of roles) {
      user = await checkCredentials(entry.model, email, password);
      if (user) {
        role = entry.role;
        break;
      }
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    
    generateToken(user._id, role, res);

    
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role, 
    });
  } catch (error) {
    console.error("Error in login controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};




export const logout = async (req, res) => {
  try{
     res.cookie("jwt","",{maxAge:0})
     res.status(200).json({message:"Logged out successfully"})

  } catch(error){

          console.log("Error in logout controller",error.message)
          res.status(500).json({message:"Internal server Error"}) 
  }
};




