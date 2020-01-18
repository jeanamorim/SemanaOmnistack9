const multer = require("multer");
const path = require("path");

module.exports = {
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, "..", "..", "uploads"),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname); // Extensao do arquivo
      const name = path.basename(file.originalname, ext); // Nome do arquivo

      cb(null, `${name}-${Date.now()}${ext}`);
    }
  })
};
