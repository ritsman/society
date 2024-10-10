// const express = require("express");
// const Razorpay = require("razorpay");
// const bodyParser = require("body-parser");
// const mongoose = require("mongoose");

// const app = express();
// app.use(bodyParser.json());

// // MongoDB connection (adjust connection string)
// mongoose.connect("mongodb://localhost/society-management", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// // Schema for transactions (optional to store transaction details)
// const transactionSchema = new mongoose.Schema({
//   paymentId: String,
//   orderId: String,
//   amount: Number,
//   status: String,
//   createdAt: { type: Date, default: Date.now },
// });
// const Transaction = mongoose.model("Transaction", transactionSchema);

// // Initialize Razorpay instance
// const razorpayInstance = new Razorpay({
//   key_id: "YOUR_RAZORPAY_KEY_ID", // Replace with your Razorpay Key ID
//   key_secret: "YOUR_RAZORPAY_SECRET_KEY", // Replace with your Razorpay Secret Key
// });

// // Create a Razorpay order
// app.post("/create-order", async (req, res) => {
//   const { amount } = req.body; // Get amount from request

//   try {
//     const options = {
//       amount: amount * 100, // Amount is in paise (multiply by 100)
//       currency: "INR",
//       receipt: `receipt_order_${Math.floor(Math.random() * 1000)}`,
//     };

//     const order = await razorpayInstance.orders.create(options);
//     res.json(order);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send("Something went wrong");
//   }
// });

// // Payment verification endpoint (called after payment success)
// app.post("/verify-payment", async (req, res) => {
//   const { paymentId, orderId, signature } = req.body;

//   try {
//     // Save transaction details to MongoDB (optional)
//     const transaction = new Transaction({
//       paymentId,
//       orderId,
//       amount: req.body.amount,
//       status: "Success",
//     });

//     await transaction.save();

//     res.json({ status: "success", transaction });
//   } catch (error) {
//     res.status(500).json({ error: "Payment verification failed" });
//   }
// });

// // Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });




// import axios from "axios"




// const CLIENT_ID =
//   "AVxqVz0iOAcUA6D16biiXK8SBczvPAPTD-ewQJCsbKvJ8pBrVMRxs9qhZrPqWrJ2v_AykLR-nfytTsS5";
// const CLIENT_SECRET =
//   "EGL7rpPMl4gTu0V889xySbyLfXg-9gbkiWtvVfVB9rsjssuOnuw-B0xSjqY0Io3NA6rUW0ZNxYCkRVHe";
// const PAYPAL_API = "https://api-m.sandbox.paypal.com"; // PayPal API for sandbox mode

// // Create order
// export const createOrder = async (req, res) => {
//   try {
//     const response = await axios.post(
//       `${PAYPAL_API}/v2/checkout/orders`,
//       {
//         intent: "CAPTURE",
//         purchase_units: [
//           {
//             amount: {
//               currency_code: "USD",
//               value: req.body.amount,
//             },
//           },
//         ],
//       },
//       {
//         auth: {
//           username: CLIENT_ID,
//           password: CLIENT_SECRET,
//         },
//       }
//     );

//     res.json({ id: response.data.id });
//   } catch (error) {
//     console.log(error)
//     res.status(500).send(error);
//   }
// };

// // Capture payment
// export const capturePayment =  async (req, res) => {
//   console.log("inside capture payment")
//   const { orderID } = req.body;
//   try {
//     const response = await axios.post(
//       `${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`,
//       {},
//       {
//         auth: {
//           username: CLIENT_ID,
//           password: CLIENT_SECRET,
//         },
//       }
//     );

//     res.json(response.data);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// };

// const express = require('express');
// const crypto = require('crypto');
// const axios = require('axios');
// const router = express.Router();
import crypto from "crypto";
import { PayTransaction } from "./User.controller.js";

// Your PayU credentials
const MERCHANT_KEY = "j52n3W";
const MERCHANT_SALT = "hLGTlfrb3yUU57ojuLEQZJ9aBbsOHD2p";
const PAYU_BASE_URL = "https://test.payu.in/_payment"; // Use 'test' endpoint for sandbox


export const payment = async (req,res)=>{
 const { amount, email, phone, productInfo, firstname } = req.body;

 const txnId = "Txn" + new Date().getTime(); // Unique transaction ID
 const successUrl = "http://localhost:3001/api/society/success"; // Handle success on frontend
 const failureUrl = "http://localhost:3001/api/society/failure"; // Handle failure on frontend

 // Creating hash string
 const hashString = `${MERCHANT_KEY}|${txnId}|${amount}|${productInfo}|${firstname}|${email}|||||||||||${MERCHANT_SALT}`;
 const hash = crypto.createHash("sha512").update(hashString).digest("hex");

 const paymentData = {
   key: MERCHANT_KEY,
   txnid: txnId,
   amount: amount,
   productinfo: productInfo,
   firstname: firstname,
   email: email,
   phone: phone,
   surl: successUrl,
   furl: failureUrl,
   hash: hash,
 };

 try {
   // Send response to frontend for PayU form submission
   res.json(paymentData);
 } catch (error) {
   res.status(500).send("Payment initiation failed");
 }
}

export const success = async (req,res) =>{
  const {
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    status,
    mihpayid,
    hash,
  } = req.body;

  // Store transaction details in the database
  const newTransaction = new PayTransaction({
    txnid,
    mihpayid, // PayU transaction ID
    amount,
    productinfo,
    firstname,
    email,
    status,
    hash, // To verify the transaction hash if needed
    createdAt: new Date(),
  });

  try {
    await newTransaction.save(); // Save transaction in DB
    res.send("Payment successful and transaction recorded");
  } catch (error) {
    res.status(500).send("Error saving transaction");
  }
}

export const failure = async(req,res)=>{
   const {
     txnid,
     amount,
     productinfo,
     firstname,
     email,
     status,
     mihpayid,
     hash,
   } = req.body;

   // Store failed transaction details in the database
   const failedTransaction = new PayTransaction({
     txnid,
     mihpayid,
     amount,
     productinfo,
     firstname,
     email,
     status,
     hash,
     createdAt: new Date(),
   });

   try {
     await failedTransaction.save();
     res.send("Payment failed and transaction recorded");
   } catch (error) {
     res.status(500).send("Error saving failed transaction");
   }
}


export const getTransactionList = async(req,res)=>{
  try {
    let result = await PayTransaction.find({});
    res.status(200).send(result)
  } catch (error) {
    console.log(error)
    res.status(500).send("error in sending trans list")
  }
}


