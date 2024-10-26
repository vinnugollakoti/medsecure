const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv")
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const User = require("../model")



const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "blogiepost@gmail.com",
    pass: "vuvmzygkwombzvur",
  },
});

router.post("/signup", async (req, res) => {
    const { username, email, password, userType } = req.body;
    console.log(req.body);
  
    try {
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
  
      const hashPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username,
        email,
        password: hashPassword,
        userType, // Store userType
      });
  
      await newUser.save();
  
      // Send welcome email
      const mailOptions = {
        from: "your_email@gmail.com",
        to: email,
        subject: "Welcome to Our Medsecure!",
        html: `<h1>Hey ${username}, welcome to our Medsecure!</h1>`,
      };
  
      await transporter.sendMail(mailOptions);
  
      // Generate JWT token
      const token = jwt.sign({ username: newUser.username }, process.env.JWT_SECRET || "JWTCODE", { expiresIn: "1h" });
  
      // Set cookies
      res.cookie('authToken', token, {
        maxAge: 3600000, // 1 hour
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict'
      });
      res.cookie("username", newUser.username, {
        maxAge: 3600000, // 1 hour
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict'
      });
  
      console.log("User registered successfully");
      return res.json({ status: true, message: "User registered successfully" });
    } catch (error) {
      console.error("Error registering user:", error);
      return res.status(500).json({ message: "Error registering user" });
    }
  });
  

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    console.log(user);

    if (!user) {
      return res.status(400).json({ message: "User is not registered" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Password is incorrect" });
    }

    const token = jwt.sign({ username: user.username }, "JWTCODE", { expiresIn: "1h" });

    // Set cookies
    res.cookie('authToken', token, {
      maxAge: 3600000, // 1 hour
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict'
    });
    res.cookie("username", user.username, {
      maxAge: 3600000, // 1 hour
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict'
    });

    console.log("Login successful");
    return res.json({ message: "Login successful", authToken: token, username: user.username });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ message: "Error logging in" });
  }
});

router.post("/otp", async (req, res) => {
  try {
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    var mailOptions = {
      from: "blogiepost@gmail.com",
      to: req.body.email,
      subject: "Your otp " + otp,
      html:
        "<h1>Hey welcome</h1> <p>Here is your otp</p>" + `<h2> '${otp}'</h2>`,
    };
    await transporter.sendMail(mailOptions);
    console.log("OTP sent");
    res.send(otp);
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


router.put("/otpvalid", async (req, res) => {
  try {
    const otp = await req.body.otp;
    const hashedotp = req.body.valid;
    if (bcrypt.compare(otp, hashedotp)) {
      const update = await User.findOneAndUpdate(
        { email: req.body.email },
        { password: await bcrypt.hash(req.body.password, 10) }
      );
      if (!update) {
        res.status(404).send("User not in database");
      } else {
        res.send("Password updated successfully");
      }
    } else {
      res.status(400).send("Invalid OTP");
    }
  } catch (error) {
    console.error("Error validating OTP:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = { UserRouter: router };