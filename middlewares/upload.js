const multer = require("multer");
const path = require("path");

const FILE_EXTENSION = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/svg+xml": "svg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_EXTENSION[file.mimetype];
    let upLoadErr = "Invalid image type!";
    const uploadPath = path.join(__dirname, "../public/uploads");
    console.log("Path: ", uploadPath);
    if (isValid) {
      upLoadErr = "";
    }

    cb(upLoadErr, uploadPath);
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_EXTENSION[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

module.exports = uploadOptions;
