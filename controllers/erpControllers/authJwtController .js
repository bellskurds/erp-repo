const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { stubFalse } = require('lodash');

const mongoose = require('mongoose');

const Admin = mongoose.model('Admin');
const secretKey = 'mysecretkey';
require('dotenv').config({ path: '.variables.env' });
exports.generateResetToken = (email) => {
  // Generate a random token
  const resetToken = jwt.sign({ email }, 'setPassword', { expiresIn: '1h' });
  return resetToken;
};
exports.verifyResetToken = (token) => {
  const decodedToken = jwt.verify(token, 'setPassword');
  return decodedToken;
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validate
    if (!email || !password)
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Not all fields have been entered.',
      });

    const admin = await Admin.findOne({ email: email, removed: false });


    if (!admin)
      return res.status(400).json({
        success: false,
        result: null,
        message: 'No account with this email has been registered.',
      });

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch)
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Invalid credentials.',
      });



    const token = jwt.sign(
      {
        id: admin._id,
      },
      secretKey,
      { expiresIn: '72h' }
    );
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        console.error(err);
        return;
      }

      console.log(decoded, '3333');
    });

    const result = await Admin.findOneAndUpdate(
      { _id: admin._id },
      { isLoggedIn: true },
      {
        new: true,
      }
    ).exec();

    res.cookie('token', token, {
      maxAge: req.body.remember ? 72 * 60 * 60 * 1000 : 60 * 60 * 1000, // Cookie expires after 30 days
      sameSite: 'none',
      httpOnly: true,
      secure: true,
    });

    res.json({
      success: true,
      result: {
        token,
        admin: {
          id: result._id,
          name: result.name,
          role: result.role,
          isLoggedIn: result.isLoggedIn,
        },
      },
      message: 'Successfully login admin',
    });
  } catch (err) {
    res.status(500).json({ success: false, result: null, message: err.message, error: err });
  }
};

exports.isValidAdminToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token)
      return res.status(401).json({
        success: false,
        result: null,
        message: 'No authentication token, authorization denied.',
        jwtExpired: true,
      });

    const verified = jwt.verify(token, secretKey);

    if (!verified)
      return res.status(401).json({
        success: false,
        result: null,
        message: 'Token verification failed, authorization denied.',
        jwtExpired: true,
      });

    const admin = await Admin.findOne({ _id: verified.id, removed: false });
    if (!admin)
      return res.status(401).json({
        success: false,
        result: null,
        message: "Admin doens't Exist, authorization denied.",
        jwtExpired: true,
      });

    if (admin.isLoggedIn === false)
      return res.status(401).json({
        success: false,
        result: null,
        message: 'Admin is already logout try to login, authorization denied.',
        jwtExpired: true,
      });
    else {
      req.admin = admin;
      next();
    }
  } catch (err) {

    console.log(err, 'error')
    res.status(503).json({
      success: false,
      result: null,
      message: err.message,
      error: err,
    });
  }
};

exports.logout = async (req, res) => {
  const result = await Admin.findOneAndUpdate(
    { _id: req.admin._id },
    { isLoggedIn: false },
    {
      new: true,
    }
  ).exec();

  res.clearCookie('token');
  res.json({ isLoggedOut: true });
};
