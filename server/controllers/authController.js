const User = require("../models/User");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "#newsecret";

const setSessionCookies = (req, res, payload) => {
  const token = jwt.sign(payload, JWT_SEcRET, { expiresIn: "30d" });
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    path: "/",
  });
};

async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ error: "All the fields are requried" });
      return;
    }

    const trimmedEmail = email.toLowerCase().trim();

    const existing = await User.findOne(trimmedEmail);
    if (existing) {
      res
        .status(400)
        .json({ error: "The user with this email id already exists" });
      return;
    }

    const user = await User.create({
      name,
      email: trimmedEmail,
      password,
    });

    setSessionCookies;
    (res, { userId: user._id.toString(), email: user.email });

    res.status;
    (201).json({
      user: {
        _id: user._id,
        name: user.name,
        password: user.password,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ error: err.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email or password is required" });
      return;
    }

    const trimmedEmail = email.toLowerCase().trim();

    const user = await User.findOne(trimmedEmail);
    if (!user) {
      res.status(404).json({ error: "Invalid email or password" });
      return;
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    setSessionCookies(res, { userId: user._id.toString(), email: user.email });

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        password: user.password,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ error: err.message });
  }
}

async function logout(req, res) {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ error: err.message });
  }
}

async function me(req, res) {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      res.status(404).json({ error: "User Not Found" });
      return;
    }

    res.json({ user });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ error: err.message });
  }
}

module.exports = {
  register,
  login,
  logout,
  me,
};
