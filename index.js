import express from "express";
import nodemailer from "nodemailer";
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/contact", (req, res) => {
  res.render("contact.ejs", { success: req.query.success, error: req.query.error });
});

app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    console.log('Form data received:', { name, email, message });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    console.log('Transporter created');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Contact Form Message from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `
    };

    console.log('Attempting to send email...');
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');

    res.redirect('/contact?success=true');
  } catch (error) {
    console.error('Detailed error:', error);
    res.redirect('/contact?error=true');
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
