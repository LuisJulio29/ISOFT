const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Carpeta donde se guardarán los informes PDF
const uploadPath = 'uploads/reportes/';
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const nombre = `${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`;
    cb(null, nombre);
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== '.pdf') {
    return cb(new Error('Formato inválido. Solo se permiten archivos .pdf'), false);
  }
  cb(null, true);
};

const uploadPDF = multer({ storage, fileFilter });

module.exports = uploadPDF; 