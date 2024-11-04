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

app.get("/about", (req, res) => {
  res.render("about.ejs");
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

    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ success: false, error: 'Failed to send email' });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
