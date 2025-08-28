const express = require("express");
const router = express.Router();

router.post("/authenticate", (req, res) => {
  const { password } = req.body;
  if (password === "itsmeaddy") {
    return res.status(200).json({ success: true, message: "Authenticated" });
  } else {
    return res.status(401).json({ success: false, error: "Invalid password" });
  }
});

module.exports = router;
