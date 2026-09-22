const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const cloudinary = require("../config/cloudinary");

const uploadsRoot = path.join(__dirname, "../../uploads");

/**
 * Saves a buffer to local disk under uploads/<subfolder>
 * and returns the public accessible URL.
 */
const saveFileLocally = async (buffer, originalname, subfolder = "general", mimetype = "") => {
  const targetDir = path.join(uploadsRoot, subfolder);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  let ext = "";
  if (originalname && path.extname(originalname)) {
    ext = path.extname(originalname);
  } else if (mimetype) {
    if (mimetype.includes("png")) ext = ".png";
    else if (mimetype.includes("webp")) ext = ".webp";
    else if (mimetype.includes("gif")) ext = ".gif";
    else if (mimetype.includes("mp4")) ext = ".mp4";
    else if (mimetype.includes("quicktime")) ext = ".mov";
    else ext = ".jpg";
  } else {
    ext = ".jpg";
  }

  const uniqueName = `${Date.now()}_${crypto.randomBytes(6).toString("hex")}${ext}`;
  const filePath = path.join(targetDir, uniqueName);

  await fs.promises.writeFile(filePath, buffer);

  const baseUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
  return `${baseUrl}/uploads/${subfolder}/${uniqueName}`;
};

/**
 * Uploads to Cloudinary with automatic fallback to local disk storage
 * if Cloudinary is not configured or throws an error (e.g. cloud_name disabled/expired).
 */
const uploadWithFallback = async ({
  buffer,
  originalname,
  mimetype = "",
  subfolder = "general",
  cloudinaryOptions = {},
}) => {
  const hasCloudinaryCredentials = Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );

  if (hasCloudinaryCredentials) {
    try {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          cloudinaryOptions,
          (err, res) => (err ? reject(err) : resolve(res))
        );
        stream.end(buffer);
      });

      return {
        secure_url: result.secure_url,
        public_id: result.public_id,
        duration: result.duration ? Math.round(result.duration) : null,
        isLocal: false,
      };
    } catch (err) {
      console.warn(
        `[fileStorage] Cloudinary upload failed (${err.message}). Using local storage fallback.`
      );
    }
  }

  // Fallback: save directly to local disk
  const localUrl = await saveFileLocally(buffer, originalname, subfolder, mimetype);
  return {
    secure_url: localUrl,
    public_id: null,
    duration: null,
    isLocal: true,
  };
};

module.exports = {
  saveFileLocally,
  uploadWithFallback,
};
