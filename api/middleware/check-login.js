const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();


module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    console.log('hello');
    const decoded = jwt.verify(token, process.env.SECRET);
    req.userData = decoded;
    console.log(decoded);
    next();
  }
  catch (error) {
    return res.status(401).json({
      message: 'login failed'
    });
  }


};