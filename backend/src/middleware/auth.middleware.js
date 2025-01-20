import jwt from 'jsonwebtoken';
import Doctor from '../models/doctor.model.js';
import Nurse from '../models/nurse.model.js';
import Triage from '../models/triage.model.js';
import Laboratorist from '../models/labratorist.model.js';
import User from '../models/user.model.js';
import Admin from '../models/admin.model.js';

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    const roles = [
      { role: "doctor", model: Doctor },
      { role: "nurse", model: Nurse },
      { role: "triage", model: Triage },
      { role: "laboratorist", model: Laboratorist },
      { role: "user", model: User },
      { role: "admin", model: Admin },
    ];

    let user = null;
    for (const entry of roles) {
      if (entry.role === decoded.role) {
        user = await entry.model.findById(decoded.userId).select("-password");
        if (user) break;
      }
    }

    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User Not Found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
} 
