const nodemailer = require("nodemailer");
require("dotenv").config();

const {META_PASSWORD} = process.env;

const nodemailerConfig = {
    host: "smtp.gmail.com",
    port: 587, // 25, 465 и 2255
    secure: false,
    auth: {
        user: "darkeden48@gmail.com",
        pass: META_PASSWORD
    }
};

const transporter = nodemailer.createTransport(nodemailerConfig);

const email = {
    to: "sagoh64660@meidir.com",
    from: "darkeden48@gmail.com",
    subject: "Новая заявка с сайта",
    html: "<p>С сайта пришла новая заявка</p>"
};

transporter.sendMail(email)
    .then(()=> console.log("Email send success"))
    .catch(error => console.log(error.message))