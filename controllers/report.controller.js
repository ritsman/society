import { pool } from "../mysql/mysql.js";
import nodemailer from "nodemailer"
import readline from "readline"

export const getSql = async (req, res) => {
  const { startDate, endDate } = req.body;

  if (!startDate || !endDate) {
    return res.status(400).send("start_date and end_date are required.");
  }

  const query = "SELECT * FROM your_table WHERE date_column BETWEEN ? AND ?";

  const values = [startDate, endDate];

  pool.query(query, values, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return;
    }

    res.json(results);
  });
};


export const postSendEmail = async(req,res) =>{
  const { email, subject, message } = req.body;
  console.log(email , subject , message)

  try {
    const cout = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Create a transporter object with SMTP details
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "yadavkaran471@gmail.com",
      pass: "nwik qkkk eslr noij",
    },
  });

  // prompt the user to enter their email address
 
    // Define mail options
    let mailOptions = {
      from: "yadavkaran471@gmail.com",
      to: email,
      text: message,
      subject: subject,
    };

    // Send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error,"line no 58");
      } else {
        console.log(`Success: Email sent to ${email}`);
      }
    });
    cout.close();
 
   res.send("Email sent!");

     } catch (error) {
       res.send("error in sending email")
       console.log(error,"line no 69")
  }
} 


