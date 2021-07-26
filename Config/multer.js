const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    return callback(null, "public/photos");
  },
  filename: (req, file, callback) => {
    return callback(null, Date.now() + file.originalname);
  },
});
module.exports = { storage };
