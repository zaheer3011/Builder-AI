const jwt = require("jsonwebtoken");

function authMiddleWare(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ error: "Access denied. No session token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
}

module.exports = authMiddleWare;
