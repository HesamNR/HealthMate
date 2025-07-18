// middleware/auth.js
export default function (req, res, next) {
  const email = req.query.email || req.body.email;
  if (!email) {
    return res.status(401).json({ error: "Unauthorized: Email is required." });
  }
  req.user = { email };
  next();
}
