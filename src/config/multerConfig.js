const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Directory to save uploaded files
const uploadDir = 'src/uploads/products';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ensure the directory exists
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'photo-' + uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

module.exports = upload;
