const path = require('path');
const multer = require('multer');
const crypto = require('crypto');

const TEMP_FOLDER = path.resolve(__dirname, '..', '..', 'temp');
const UPLOADS_FOLDER = path.resolve(TEMP_FOLDER, 'uploads');

const MULTER = {
  storage: multer.diskStorage({
    destination: TEMP_FOLDER,
    filename(req, file, cb){
      const fileHash = crypto.randomBytes(10).toString("hex");
        const fileName = `${fileHash}-${file.originalname}`;
        return cb(null, fileName);
    },
  }),
};

module.exports = {
  TEMP_FOLDER, UPLOADS_FOLDER, MULTER
};