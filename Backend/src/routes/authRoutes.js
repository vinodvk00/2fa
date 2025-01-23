import { Router } from "express";
import { set } from "mongoose";
import passport from "passport";
import {
  register,
  login,
  authStatus,
  logout,
  setup2FA,
  verify2FA,
  reset2FA,
} from "../controllers/authController.js";

const router = Router();

// Registration route
router.post("/register", register);

// Login route
router.post("/login", passport.authenticate("local"), login);

// Auth Status route
router.get("/status", authStatus);

// Logout route
router.post("/logout", logout);

// 2FA setup route
router.post(
  "/2fa/setup",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ message: "User is not authenticated" });
  },
  setup2FA
);

// 2FA verify route
router.post(
  "/2fa/verify",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ message: "User is not authenticated" });
  },
  verify2FA
);

// 2FA reset route
router.post(
  "/2fa/reset",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ message: "User is not authenticated" });
  },
  reset2FA
);

export default router;
