const Admin = require("../models/admin");
const verifyAdmin = require("./verifyAdmin");

module.exports = async function allowFirstAdminOrRequireAdmin(req, res, next) {
  try {
    const existingCount = await Admin.countDocuments();
    //agar new admin hai to create ho jaega warna, verify karna padega ki koi purana admin hi new admin create kr paaye
    if (existingCount === 0){
      return next();
    }
    return verifyAdmin(req, res, next);
  } catch (error) {
    return res.status(500).json({ message: "Unable to verify admin state" });
  }
};


