import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import User from "../Models/User.models.js";
// import { User } from "./SuperAdmin/admin.controller.js";
import { createSocietyDbConnection } from "../mongodb/config.js";


//kjhj

export let SocProfile;
export let BillHeads;
export let BillMaster;
export let Bills;
export let billGenerate;
export let groups;
export let PartyLedger;
export let AccLedger;
export let CashAccLedger;
export let BankAccLedger;
export let MasterHead;
export let MemberLedger;
export let profile;
export let OpeningMember;
export let OpeningBalance;
export let BankPayment;
export let CashPayment;
export let BankReceipt;
export let CashReceipt;

//lklk

const generateJWTSecret = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const login = async (req, res) => {
  console.log("inside login controller", req.body);

  const jwtSecret = generateJWTSecret();
      const {superAdmin,societyId} = req.body;
       try {
         if (superAdmin) {
             const society = await User.findOne({ societyId });
             if (!society) {
               return res.status(404).json({ error: "Society not found" });
             }
               ({
                 SocProfile,
                 BillHeads,
                 BillMaster,
                 Bills,
                 billGenerate,
                 groups,
                 PartyLedger,
                 AccLedger,
                 CashAccLedger,
                 BankAccLedger,
                 MasterHead,
                 MemberLedger,
                 profile,
                 OpeningMember,
                 OpeningBalance,
                 BankPayment,
                 CashPayment,
                 BankReceipt,
                 CashReceipt,
               } = createSocietyDbConnection(
                 society.dbConnection,
                 society.societyName
               ));
                
               res.status(200).json({ message: "successfully login in" });

         } else {
              const { user, password } = req.body;
              let role = "";

              const users = await User.findOne({ user });
              if (!users) {
                return res.status(400).send("Invalid email or password");
              } else {
                if (user == "admin@gmail.com") {
                  role = "admin";
                } else if (user == "supadmin@gmail.com") {
                  role = "superAdmin";
                } else {
                  role = users.role;
                }
                const validPassword = await bcrypt.compare(
                  password,
                  users.password
                );
                if (!validPassword) {
                  return res.status(400).send("Invalid email or password");
                } else {
                  if (users.status == "pending") {
                    return res.status(403).json({
                      message:
                        "Account not approved. Please wait for admin approval.",
                    });
                  }

                  ({
                    SocProfile,
                    BillHeads,
                    BillMaster,
                    Bills,
                    billGenerate,
                    groups,
                    PartyLedger,
                    AccLedger,
                    CashAccLedger,
                    BankAccLedger,
                    MasterHead,
                    MemberLedger,
                    profile,
                    OpeningMember,
                    OpeningBalance,
                    BankPayment,
                    CashPayment,
                    BankReceipt,
                    CashReceipt,
                  } = createSocietyDbConnection(
                    users.dbConnection,
                    users.societyName
                  ));

                  const token = jwt.sign(
                    {
                      _id: users._id,
                      role: role,
                      name: users.name,
                      user: users.user,
                    },
                    jwtSecret,
                    {
                      expiresIn: "2d",
                    }
                  );
                  res.send(token);
                }
              }
         }

        
       } catch (error) {
         console.error(error);
         return res.status(500).json({
           message: "Internal Server Error",
         });
       }
};

export const register = async (req, res) => {
  console.log(req.body);
  try {
    const { name, user, password,societyId,societyName } = req.body;

    const existingUser = await User.findOne({ user });
    if (existingUser) {
      console.log(existingUser);
      return res.status(400).send("User already exists");
    }

const sanitizedSocietyName = societyId.replace(/\s+/g, "_"); 
const dbConnection = `mongodb://0.0.0.0:27017/${sanitizedSocietyName}_db`;

    const hashedPassword = await bcrypt.hash(password, 10);
    const users = new User({
      name,
      user,
      societyId,
      societyName,
      dbConnection,
      password: hashedPassword,
      status: "pending",
    });
    await users.save();
    res.status(200).json({
   message: "Signup request submitted. Waiting for admin approval.",
 });  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error processing signup request" });
  }
};

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "yadavkaran471@gmail.com",
    pass: "szwn jnwm kiqj vupk",
  },
});

export const forgotPass = async (req, res) => {
  const { email } = req.body;

  console.log("insdie forgot password", req.body);
  try {
    const user = await User.findOne({ user: email });
    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }
    console.log(user);
    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${token}`;
    const mailOptions = {
      to: user.user,
      from: "yadavkaran471@gmail.com",
      subject: "Password Reset",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
             Please click on the following link, or paste this into your browser to complete the process:\n\n
             ${resetUrl}\n\n
             If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ msg: "Email sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const resetPass = async (req, res) => {
  const { password } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ msg: "Invalid or expired token" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ msg: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};


export const getUsers = async (req,res) =>{
    try {
      let result = await User.find({});

      res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error in getting users", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
}

export const approveUser = async (req,res) =>{
   try {
    const role = req.body.role;
     const user = await User.findByIdAndUpdate(
       req.params.userId,
       { status: "active", role: role },
       { new: true }
     );
     if (!user) {
       return res.status(404).json({ message: "User not found" });
     }
     res.json({ message: "User approved successfully" });
   } catch (error) {
     res.status(500).json({ message: "Error approving user" });
   }
}

export const rejectUser = async (req,res)=>{
   try {
     const user = await User.findByIdAndDelete(req.params.userId);
     if (!user) {
       return res.status(404).json({ message: "User not found" });
     }
     res.json({ message: "User rejected successfully" });
   } catch (error) {
     res.status(500).json({ message: "Error rejecting user" });
   }
}

// function authenticateToken(req, res, next) {
//   const token = req.header("Authorization");
//   if (!token) return res.status(401).send("Access Denied");
//   try {
//     const decoded = jwt.verify(token, "jwtPrivateKey");
//     req.user = decoded;
//     next();
//   } catch (error) {
//     res.status(400).send("Invalid Token");
//   }
// }

// // Example protected route
// app.get("/api/user", authenticateToken, (req, res) => {
//   if (req.user.role !== "user") return res.status(403).send("Forbidden");
//   res.send("User content");
// });

// // Example protected admin route
// app.get("/api/admin", authenticateToken, (req, res) => {
//   if (req.user.role !== "admin") return res.status(403).send("Forbidden");
//   res.send("Admin content");
// });
