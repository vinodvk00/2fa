import bcrypt from "bcrypt";
import User from "../models/user.js";
import speakeasy from "speakeasy";
import qrCode from "qrcode";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      isMfaActive: false,
    });

    console.log("Username : ", username);
    console.log("Password : ", password);

    console.log("New User : ", newUser);

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error registering user", message: error });
  }
};

export const login = async (req, res) => {
  console.log("Login : ", req.user);

  res
    .status(200)
    .json({
      message: "User logged in successfully",
      username: req.user.username,
      isMfaActive: req.user.isMfaActive,
    });
};

export const authStatus = async (req, res) => {
  if (req.user) {
    res.status(200).json({
      message: "User is authenticated",
      username: req.user.username,
      isMfaActive: req.user.isMfaActive,
    });
  } else {
    res.status(401).json({ message: "User is not authenticated" });
  }
};

export const logout = async (req, res) => {
  if (!req.user) {
    res.status(401).json({
      message: "User is not authenticated",
    });
  }

  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.clearCookie("connect.sid");
      res.status(200).json({ message: "User logged out successfully" });
    });
  });
};

export const setup2FA = async (req, res) => {
  try {
    console.log("Setup 2FA : ", req.user);

    const user = req.user;
    var secret = speakeasy.generateSecret();

    console.log("Secret : ", secret);

    user.twoFactorSecret = secret.base32;
    user.isMfaActive = true;

    await user.save();

    const url = speakeasy.otpauthURL({
      secret: secret.base32,
      label: `${req.user.username}`,
      issuer: "MyApp.com",
      encoding: "base32",
    });

    const qrImageUrl = await qrCode.toDataURL(url);

    // not recommended
    res.status(200).json({
      message: "2FA setup successfully",
      qrImageUrl,
      secret: secret.base32,
      qrCode: qrImageUrl,
    });
  } catch (error) {
    res.status(500).json({ error: "Error setting up 2FA", message: error });
  }
};

export const verify2FA = async (req, res) => {
  const { token } = req.body;
  const user = req.user;

  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: "base32",
    token,
  });

  if (verified) {
    const jwtToken = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res
      .status(200)
      .json({ message: "2FA verified successfully", token: jwtToken });
  } else {
    res.status(400).json({ message: "2FA verification failed" });
  }
};

export const reset2FA = async (req, res) => {
  try {
    const user = req.user;

    user.isMfaActive = false;
    user.twoFactorSecret = null;

    await user.save();

    res.status(200).json({ message: "2FA reset successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error resetting 2FA", message: error });
  }
};
