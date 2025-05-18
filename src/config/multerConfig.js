const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Directory to save uploaded files
const uploadDir = 'uploads/products';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ensure the directory exists
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

module.exports = upload;
