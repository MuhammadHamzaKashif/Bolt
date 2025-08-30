const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = "pfp"; // default

    if (req.baseUrl.includes("post")) folder = "posts";
    if (req.baseUrl.includes("bolt")) folder = "bolts";

    return {
      folder: folder,
      resource_type: "auto", // auto = handles both images & videos
      public_id: file.originalname.split(".")[0], // use filename
    };
  },
});

const upload = multer({ storage });

module.exports = upload;
