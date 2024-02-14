import db from '../../db/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
dotenv.config();

export const register = async (req, res) => {
  //CHECK EXISTING USER
  const { token, username, email, password } = req.body;

  if (!token) return res.status(400).json('Captcha token is required');

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
    );
    console.log(response);
    if (response.data.success) {
      const q = 'SELECT * FROM users WHERE email = ? OR username = ?';

      db.query(q, [req.body.email, req.body.username], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length) return res.status(409).json('User already exists!');

        //Hash the password and create a user
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const q = 'INSERT INTO users(`username`,`email`,`password`) VALUES (?)';
        const values = [username, email, hash];

        db.query(q, [values], (err, data) => {
          if (err) return res.status(500).json(err);
          return res.status(200).json('User has been created.');
        });
      });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const login = (req, res) => {
  //CHECK USER

  const q = 'SELECT * FROM users WHERE username = ?';

  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json('User not found!');

    //Check password
    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );

    if (!isPasswordCorrect)
      return res.status(400).json('Wrong username or password!');

    const token = jwt.sign({ id: data[0].id }, 'jwtkey');
    const { password, ...other } = data[0];

    // console.log(token);

    res.cookie('access_token', token, {
      httpOnly: true,
      sameSite: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    const cookieToken = req.cookies.access_token;
    // const cookieToken = req.cookies;
    // res.setHeader('Access-Control-Allow-Origin', '*');
    // console.log(cookieToken);
    return res.status(200).json({ ...other, cookieToken });
    // return res.status(200).json(other);
  });
};

export const logout = (req, res) => {
  res.clearCookie('access_token', {
    sameSite: 'none',
    secure: true,
  });

  return res.status(200).json('user has been left');
};

// forget password
// export const ForgotPassword = (req, res) => {
//   const { email } = req.body;

//   const q = 'SELECT * FROM users WHERE email = ?';

//   db.query(q, [email], (err, data) => {
//     if (err) return res.status(500).json(err);
//     if (data.length === 0) return res.status(404).json('email not found!');

//     const secret = process.env.JWT_SECRET + data[0].password;

//     const token = jwt.sign({ email: data[0].email, id: data[0].id }, secret, {
//       expiresIn: '5m',
//     });

//     const link = `http://localhost:8000/api/auth/reset/${data[0].id}/${token}`;

//     var transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.EMAIL,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     var mailOptions = {
//       from: process.env.EMAIL,
//       to: email,
//       subject: 'Reset Your Password ✔',
//       text: 'You can reset your password from here: \n' + link,
//     };

//     transporter.sendMail(mailOptions, function (error, info) {
//       if (error) {
//         console.log(error);
//       } else {
//         console.log('Email sent: ' + info.response);
//       }
//     });

//     res.status(200).json(link);
//   });
// };

// export const resetPassword = (req, res) => {
//   const { id, token } = req.params;

//   const q = 'SELECT * FROM users WHERE id = ?';

//   db.query(q, [id], (err, data) => {
//     if (err) return res.status(500).json(err);
//     if (data.length === 0) return res.status(404).json('user not found!');

//     const secret = process.env.JWT_SECRET + data[0].password;

//     try {
//       const verify = jwt.verify(token, secret);
//       res.status(200).json('Verified');
//     } catch (err) {
//       res.status(500).json('Not verified');
//     }
//   });
// };

// export const changePassword = async (req, res) => {
//   const { id, token } = req.params;
//   const { password } = req.body;

//   const q = 'SELECT * FROM users WHERE id = ?';

//   db.query(q, [id], async (err, data) => {
//     if (err) return res.status(500).json(err);
//     if (data.length === 0) return res.status(404).json('user not found!');

//     const secret = process.env.JWT_SECRET + data[0].password;

//     try {
//       const verify = jwt.verify(token, secret);
//       const salt = bcrypt.genSaltSync(10);
//       const hashedPassword = await bcrypt.hash(password, salt);

//       const q = 'UPDATE users SET password = ? WHERE id = ?';
//       db.query(q, [hashedPassword, id], (err, data) => {
//         if (err) return res.status(500).json(err);
//         res.status(200).json('Password updated');
//       });
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   });
// };
