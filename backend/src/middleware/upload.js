
// backend/src/middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = 'uploads/logos';
if (!fs.existsSync(uploadDir)) {
     fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
     destination: (req, file, cb) => {
          cb(null, uploadDir);
     },
     filename: (req, file, cb) => {
          // Senior tip: Use unique filenames to prevent overwriting
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          cb(null, `brand-${uniqueSuffix}${path.extname(file.originalname)}`);
     }
});

const fileFilter = (req, _file, cb) => {
     if (!_file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
          return cb(new Error('Only image files (jpg, png, webp) are allowed!'), false);
     }
     cb(null, true);
};


const upload = multer({
     storage: storage,
     fileFilter: fileFilter,
     limits: {
          fileSize: 2 * 1024 * 1024 // 2MB Limit
     }
});

module.exports = upload;